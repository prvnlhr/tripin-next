import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

// Type definitions
interface Coordinate {
  lat: number;
  lng: number;
}

interface BookingDetails {
  userId: string;
  cabType: string;
  pickup_coordinates: Coordinate;
  dropoff_coordinates: Coordinate;
  pickup_address: string;
  dropoff_address: string;
}

interface Driver {
  driver_id: string;
  user_id: string;
  name: string;
  cab_type: string;
  distance_meters?: number;
}

// Reused Functions (assumed to be in a utils file or imported)
async function validateCoordinates(coords: {
  pickup: Coordinate;
  dropoff: Coordinate;
}): Promise<{ isValid: boolean; error?: Response }> {
  const { pickup, dropoff } = coords;
  if (
    isNaN(pickup.lat) ||
    isNaN(pickup.lng) ||
    isNaN(dropoff.lat) ||
    isNaN(dropoff.lng)
  ) {
    return {
      isValid: false,
      error: createResponse(400, null, "Valid coordinates required"),
    };
  }
  return { isValid: true };
}

async function calculateRouteDistance(points: {
  pickup: Coordinate;
  dropoff: Coordinate;
}): Promise<{
  distanceKm: number;
  durationMinutes: number;
  source: "google" | "postgis";
}> {
  const { pickup, dropoff } = points;
  const supabase = await createClient();

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
  } catch (error) {
    console.warn("Google Maps API failed, falling back to PostGIS:", error);
  }

  const { data: straightLineDistance } = await supabase.rpc(
    "calculate_distance_meters",
    {
      point1: `POINT(${pickup.lng} ${pickup.lat})`,
      point2: `POINT(${dropoff.lng} ${dropoff.lat})`,
    }
  );

  const distanceKm = (straightLineDistance || 0) / 1000;
  return {
    distanceKm: distanceKm * 1.3, // Add 30% buffer for urban routes
    durationMinutes: distanceKm * 2, // Estimate 2 mins per km
    source: "postgis",
  };
}

async function getAvailableDrivers(
  pickup: Coordinate,
  cabType: string
): Promise<Driver[]> {
  const supabase = await createClient();
  const { data: nearbyDrivers, error } = await supabase.rpc(
    "find_nearby_drivers",
    {
      lat: pickup.lat,
      long: pickup.lng,
      max_distance_meters: 5000,
      max_duration_minutes: 15,
    }
  );

  if (error) throw new Error(`Driver query failed: ${error.message}`);

  // Filter by cab type
  return (nearbyDrivers || []).filter((driver) => driver.cab_type === cabType);
}

async function filterBusyDrivers(drivers: Driver[]): Promise<Driver[]> {
  if (drivers.length === 0) return [];

  const supabase = await createClient();

  const { data: activeRides } = await supabase
    .from("rides")
    .select("driver_id")
    .in(
      "driver_id",
      drivers.map((d) => d.driver_id)
    )
    .in("status", ["ACCEPTED", "ARRIVED", "STARTED"]);

  const busyDriverIds = new Set(activeRides?.map((r) => r.driver_id) || []);
  return drivers.filter((d) => !busyDriverIds.has(d.driver_id));
}

// New Function: Create Ride Requests
async function createRideRequests(
  bookingDetails: BookingDetails,
  eligibleDrivers: Driver[],
  distanceKm: number,
  durationMinutes: number
): Promise<void> {
  const supabase = await createClient();

  // Get rider_id from users table based on userId
  const { data: riderData, error: riderError } = await supabase
    .from("riders")
    .select("rider_id")
    .eq("user_id", bookingDetails.userId)
    .single();

  if (riderError || !riderData) {
    throw new Error("Rider not found");
  }

  const riderId = riderData.rider_id;

  // Prepare ride request data for each eligible driver
  const rideRequests = eligibleDrivers.map((driver) => ({
    rider_id: riderId,
    driver_id: driver.driver_id,
    pickup_coordinates: `POINT(${bookingDetails.pickup_coordinates.lng} ${bookingDetails.pickup_coordinates.lat})`,
    pickup_address: bookingDetails.pickup_address,
    dropoff_coordinates: `POINT(${bookingDetails.dropoff_coordinates.lng} ${bookingDetails.dropoff_coordinates.lat})`,
    dropoff_address: bookingDetails.dropoff_address,
    distance_km: distanceKm,
    duration_minutes: Math.ceil(durationMinutes),
    cab_type: bookingDetails.cabType,
    status: "PENDING",
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  }));

  // Insert ride requests into the database
  const { error } = await supabase.from("ride_requests").insert(rideRequests);

  if (error) {
    throw new Error(`Failed to create ride requests: ${error.message}`);
  }
}

// Main API Handler
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // 1. Parse and validate booking details
    const bookingDetails: BookingDetails = await request.json();

    if (
      !bookingDetails.userId ||
      !bookingDetails.cabType ||
      !bookingDetails.pickup_coordinates ||
      !bookingDetails.dropoff_coordinates ||
      !bookingDetails.pickup_address ||
      !bookingDetails.dropoff_address
    ) {
      return createResponse(400, null, "Missing required booking details");
    }

    const { isValid, error: coordError } = await validateCoordinates({
      pickup: bookingDetails.pickup_coordinates,
      dropoff: bookingDetails.dropoff_coordinates,
    });
    if (!isValid) return coordError!;

    // 2. Calculate route distance and duration
    const { distanceKm, durationMinutes } = await calculateRouteDistance({
      pickup: bookingDetails.pickup_coordinates,
      dropoff: bookingDetails.dropoff_coordinates,
    });

    // 3. Find available drivers matching the cab type
    const nearbyDrivers = await getAvailableDrivers(
      bookingDetails.pickup_coordinates,
      bookingDetails.cabType
    );

    // 4. Filter out busy drivers
    const eligibleDrivers = await filterBusyDrivers(nearbyDrivers);

    if (eligibleDrivers.length === 0) {
      return createResponse(404, null, "No eligible drivers found");
    }

    // 5. Create ride requests for all eligible drivers
    await createRideRequests(
      bookingDetails,
      eligibleDrivers,
      distanceKm,
      durationMinutes
    );

    // 6. Return success response
    return createResponse(200, {
      message: "Ride request sent to eligible drivers",
      driverCount: eligibleDrivers.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Ride Request API Error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Unknown error",
      "Failed to process ride request"
    );
  }
}
