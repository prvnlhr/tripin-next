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

export interface Driver {
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
}

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

type CabOption = {
  cab_type: "AUTO" | "COMFORT" | "ELITE";
  fare: number;
  distance_km: number;
  duration_minutes: number;
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

// --- MAIN GET HANDLER ---

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const useGoogle = true;

  try {
    const { searchParams } = new URL(request.url);
    const pickupLat = parseFloat(searchParams.get("pickupLat") || "");
    const pickupLng = parseFloat(searchParams.get("pickupLng") || "");
    const dropoffLat = parseFloat(searchParams.get("dropoffLat") || "");
    const dropoffLng = parseFloat(searchParams.get("dropoffLng") || "");

    if (
      isNaN(pickupLat) ||
      isNaN(pickupLng) ||
      isNaN(dropoffLat) ||
      isNaN(dropoffLng)
    ) {
      return createResponse(400, null, "Valid coordinates are required");
    }

    const pickup = { lat: pickupLat, lng: pickupLng };
    const dropoff = { lat: dropoffLat, lng: dropoffLng };

    const distanceInfo: DistanceInfo = useGoogle
      ? await calculateDistanceGoogle(pickup, dropoff)
      : await calculateDistancePostGIS(pickup, dropoff);

    const { distanceKm, durationMinutes } = distanceInfo;

    const radius = 3000; // Default 3km radius
    // Fetch nearby online drivers
    const { data: nearbyDrivers, error: driversError } = await supabase.rpc(
      "get_nearby_drivers",
      {
        lat: pickupLat,
        long: pickupLng,
        max_distance: radius,
        only_online: true,
      }
    );


    if (driversError) {
      console.error("Error fetching nearby drivers:", driversError);
      return createResponse(500, null, "Failed to find nearby drivers");
    }

    if (!nearbyDrivers || nearbyDrivers.length === 0) {
      return createResponse(200, { options: [] });
    }

    // Check assigned rides
    const { data: assignedRides, error: ridesError } = await supabase
      .from("rides_new")
      .select("driver_id")
      .in("status", ["DRIVER_ASSIGNED", "REACHED_PICKUP", "TRIP_STARTED"]);

    if (ridesError) {
      console.error("Error checking assigned rides:", ridesError);
      return createResponse(500, null, "Failed to check driver assignments");
    }

    const assignedDriverIds = new Set(
      (assignedRides as { driver_id: string }[]).map((ride) => ride.driver_id)
    );

    const availableDrivers = nearbyDrivers.filter(
      (driver: Driver) => !assignedDriverIds.has(driver.driver_id)
    );

    // Fare pricing
    const { data: farePricing, error: fareError } = await supabase
      .from("fare_pricing")
      .select("*")
      .single();

    if (fareError || !farePricing) {
      console.error("Error fetching fare pricing:", fareError);
      return createResponse(500, null, "Failed to get fare information");
    }

    // Create cab options
    const cabOptions: CabOption[] = (["AUTO", "COMFORT", "ELITE"] as const).map(
      (cabType) => {
        const isAvailable = availableDrivers.some(
          (driver: Driver) => driver.cab_type === cabType
        );
        return {
          cab_type: cabType,
          fare: calculateFare(cabType, distanceKm, farePricing),
          distance_km: distanceKm,
          duration_minutes: durationMinutes,
          is_available: isAvailable,
        };
      }
    );
    return createResponse(200, {
      options: cabOptions,
    });
  } catch (error) {
    console.error("Ride options error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
