import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { PastRide, RideRequest } from "@/types/rideTypes";

type Params = Promise<{ driverId: string }>;

// Main API Handler
export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { driverId } = await segmentData.params;

    if (!driverId || typeof driverId !== "string") {
      return createResponse(400, null, "Valid driver userId is required");
    }

    // 1. Fetch active ride requests from 'ride_requests' table
    const { data: rideRequests, error: rideRequestError } = await supabase
      .from("ride_requests")
      .select(
        `
        id,
        rider_id,
        pickup_coordinates,
        pickup_address,
        dropoff_coordinates,
        dropoff_address,
        distance_km,
        duration_minutes,
        cab_type,
        status,
        created_at,
        expires_at
      `
      )
      .eq("driver_id", driverId)
      .eq("status", "PENDING")
      .order("created_at", { ascending: false }); // Most recent first

    if (rideRequestError) {
      throw new Error(
        `Failed to fetch ride requests: ${rideRequestError.message}`
      );
    }

    // 2. Fetch past rides from 'rides' table (COMPLETED or CANCELLED)
    const { data: pastRides, error: pastRidesError } = await supabase
      .from("rides")
      .select(
        `
        id,
        request_id,
        rider_id,
        pickup_coordinates,
        pickup_address,
        dropoff_coordinates,
        dropoff_address,
        cab_type,
        estimated_distance_km,
        estimated_duration_minutes,
        fare_estimate,
        status,
        cancelled_by,
        created_at,
        updated_at
      `
      )
      .eq("driver_id", driverId)
      .in("status", ["COMPLETED", "CANCELLED"]) // Only completed or cancelled rides
      .order("updated_at", { ascending: false }); // Most recent first

    if (pastRidesError) {
      throw new Error(`Failed to fetch past rides: ${pastRidesError.message}`);
    }

    // 3. Return the combined response
    return createResponse(200, {
      rideRequests: (rideRequests as RideRequest[]) || [],
      pastRides: (pastRides as PastRide[]) || [],
    });
  } catch (error) {
    console.error("Driver Rides API Error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Unknown error",
      "Failed to fetch driver ride data"
    );
  }
}
