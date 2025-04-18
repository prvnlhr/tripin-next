import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

// --- TYPES ---
type Coordinates = {
  lat: number;
  lng: number;
};

type DistanceInfo = {
  distanceKm: number;
  durationMinutes: number;
  source: "google" | "postgis";
};

type Driver = {
  driver_id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
  car_name: string;
  car_model: string;
  cab_type: "AUTO" | "COMFORT" | "ELITE";
  is_online: boolean;
  location: string;
  license_plate: string;
};

type BookingDetails = {
  riderId: string;
  cabType: "AUTO" | "COMFORT" | "ELITE";
  pickup_coordinates: Coordinates;
  dropoff_coordinates: Coordinates;
  pickup_address: string;
  dropoff_address: string;
  radius?: number;
};

type FarePricing = {
  auto_base: number;
  auto_per_km: number;
  auto_min_fare: number;
  comfort_base: number;
  comfort_per_km: number;
  comfort_min_fare: number;
  elite_base: number;
  elite_per_km: number;
  elite_min_fare: number;
};

// --- DISTANCE CALCULATORS ---
async function calculateDistanceGoogle(
  pickup: Coordinates,
  dropoff: Coordinates
): Promise<DistanceInfo> {
  try {
    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${pickup.lat},${pickup.lng}&` +
        `destinations=${dropoff.lat},${dropoff.lng}&` +
        `key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const googleData = await googleResponse.json();

    if (
      googleData.status === "OK" &&
      googleData.rows[0]?.elements[0]?.distance
    ) {
      return {
        distanceKm: googleData.rows[0].elements[0].distance.value / 1000,
        durationMinutes: googleData.rows[0].elements[0].duration.value / 60,
        source: "google",
      };
    }
    throw new Error("Google Maps API returned invalid data");
  } catch (error) {
    console.error("Google Maps API error:", error);
    throw error;
  }
}

async function calculateDistancePostGIS(
  pickup: Coordinates,
  dropoff: Coordinates
): Promise<DistanceInfo> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc("calculate_route_distance", {
      pickup_lng: pickup.lng,
      pickup_lat: pickup.lat,
      dropoff_lng: dropoff.lng,
      dropoff_lat: dropoff.lat,
    });

    if (error || !data) throw error;

    return {
      distanceKm: data.distance_km,
      durationMinutes: data.duration_minutes,
      source: "postgis",
    };
  } catch (error) {
    console.error("PostGIS calculation error:", error);
    throw error;
  }
}

// --- FARE CALCULATOR ---
function calculateFare(
  cabType: "AUTO" | "COMFORT" | "ELITE",
  distanceKm: number,
  pricing: FarePricing
): number {
  const config = {
    AUTO: {
      base: pricing.auto_base,
      perKm: pricing.auto_per_km,
      min: pricing.auto_min_fare,
    },
    COMFORT: {
      base: pricing.comfort_base,
      perKm: pricing.comfort_per_km,
      min: pricing.comfort_min_fare,
    },
    ELITE: {
      base: pricing.elite_base,
      perKm: pricing.elite_per_km,
      min: pricing.elite_min_fare,
    },
  };

  const { base, perKm, min } = config[cabType];
  const calculatedFare = base + distanceKm * perKm;
  return parseFloat(Math.max(calculatedFare, min).toFixed(2));
}

// --- MAIN POST HANDLER : API HANDLER TO MAKE A RIDE REQUEST TO ALL ELIGIBLE DRIVERS---
// This is where user requests a cab of particular type(AUTO, COMFORT, ELITE) in 3km radius
export async function POST(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const useGoogle = true;

  try {
    // 1. Parse and validate booking details
    const bookingDetails: BookingDetails = await request.json();

    if (
      !bookingDetails.riderId ||
      !bookingDetails.cabType ||
      !bookingDetails.pickup_coordinates ||
      !bookingDetails.dropoff_coordinates ||
      !bookingDetails.pickup_address ||
      !bookingDetails.dropoff_address
    ) {
      return createResponse(409, null, "Missing required booking details");
    }

    const riderId = bookingDetails.riderId;
    //  First check if rider already has a ongoing ride
    const { data: existingRides, error: existingRidesError } = await supabase
      .from("rides_new")
      .select("rider_id, status")
      .eq("rider_id", riderId)
      .in("status", [
        "DRIVER_ASSIGNED",
        "REACHED_PICKUP",
        "TRIP_STARTED",
        "TRIP_ENDED",
      ]);

    if (existingRidesError) {
      console.error("Error checking existing rides:", existingRidesError);
      // Handle error appropriately
    }
    const hasOngoingRide = existingRides && existingRides.length > 0;

    if (hasOngoingRide) {
      return createResponse(
        409,
        null,
        "You already have an ongoing ride. Please complete your current ride before booking another"
      );
    }

    const { data: rider, error: riderError } = await supabase
      .from("riders")
      .select("rider_id, name, phone")
      .eq("rider_id", bookingDetails.riderId)
      .single();

    if (riderError || !rider) {
      return createResponse(404, null, "Rider not found");
    }

    // 2. Calculate distance and duration
    const distanceInfo = await (useGoogle
      ? calculateDistanceGoogle(
          bookingDetails.pickup_coordinates,
          bookingDetails.dropoff_coordinates
        )
      : calculateDistancePostGIS(
          bookingDetails.pickup_coordinates,
          bookingDetails.dropoff_coordinates
        ));

    // 3. Find eligible drivers
    const radius = bookingDetails.radius || 3000; // default 3 kms
    const { data: eligibleDrivers, error: driversError } = await supabase
      .rpc("get_nearby_drivers", {
        lat: bookingDetails.pickup_coordinates.lat,
        long: bookingDetails.pickup_coordinates.lng,
        max_distance: radius,
        only_online: true,
      })
      .eq("cab_type", bookingDetails.cabType);

    if (driversError || !eligibleDrivers) {
      console.error("Error finding eligible drivers:", driversError);
      return createResponse(500, null, "Failed to find available drivers");
    }

    if (eligibleDrivers.length === 0) {
      return createResponse(404, null, "No available drivers found");
    }

    // 4. Filter out assigned drivers
    const { data: assignedRides, error: ridesError } = await supabase
      .from("rides_new")
      .select("driver_id")
      .in("status", ["DRIVER_ASSIGNED", "REACHED_PICKUP", "TRIP_STARTED"]);

    if (ridesError) {
      console.error("Error checking assigned rides:", ridesError);
      return createResponse(500, null, "Failed to check driver availability");
    }

    const assignedDriverIds = new Set(
      assignedRides?.map((ride) => ride.driver_id) ?? []
    );

    const availableDrivers = eligibleDrivers.filter(
      (driver: Driver) => !assignedDriverIds.has(driver.driver_id)
    );

    if (availableDrivers.length === 0) {
      return createResponse(
        200,
        null,
        null,
        "All matching drivers are currently busy"
      );
    }

    // 5. Get fare pricing
    const { data: farePricing, error: fareError } = await supabase
      .from("fare_pricing")
      .select("*")
      .single();

    if (fareError || !farePricing) {
      console.error("Error fetching fare pricing:", fareError);
      return createResponse(500, null, "Failed to calculate fare");
    }

    const fare = calculateFare(
      bookingDetails.cabType,
      distanceInfo.distanceKm,
      farePricing
    );

    // 6. Create ride requests for all available drivers
    const rideRequests = availableDrivers.map((driver: Driver) => {
      // Prepare driver details with ALL required fields
      const driverDetails = {
        driver_id: driver.driver_id,
        name: driver.name,
        phone: driver.phone,
        location: driver.location,
        car_name: driver.car_name || "",
        car_model: driver.car_model || "",
        license_plate: driver.license_plate || "",
        cab_type: driver.cab_type,
        is_online: driver.is_online,
      };

      return {
        rider_id: bookingDetails.riderId,
        rider_details: {
          rider_id: rider.rider_id,
          name: rider.name,
          phone: rider.phone,
        },
        driver_id: driver.driver_id,
        driver_details: driverDetails,
        pickup_location: `POINT(${bookingDetails.pickup_coordinates.lng} ${bookingDetails.pickup_coordinates.lat})`,
        pickup_address: bookingDetails.pickup_address,
        dropoff_location: `POINT(${bookingDetails.dropoff_coordinates.lng} ${bookingDetails.dropoff_coordinates.lat})`,
        dropoff_address: bookingDetails.dropoff_address,
        distance_km: distanceInfo.distanceKm,
        duration_minutes: Math.round(distanceInfo.durationMinutes),
        fare: fare,
        status: "SEARCHING",
      };
    });

    const { error: insertError } = await supabase
      .from("rides_new")
      .insert(rideRequests);

    if (insertError) {
      console.error("Error creating ride requests:", insertError);
      return createResponse(500, null, "Failed to create ride requests");
    }

    return createResponse(200, {
      success: true,
      requested_drivers: availableDrivers.length,
      estimated_fare: fare,
      estimated_distance: distanceInfo.distanceKm,
      estimated_duration: distanceInfo.durationMinutes,
    });
  } catch (error) {
    console.error("Ride request error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
