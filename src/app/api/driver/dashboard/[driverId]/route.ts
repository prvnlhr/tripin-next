import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { wkbToLatLng } from "@/utils/geoUtils";

// --- TYPES ---
interface Coordinates {
  lat: number;
  lng: number;
}

interface RiderDetails {
  rider_id: string;
  name: string;
  phone: string;
}

interface RideBase {
  id: string;
  rider_id: string;
  rider_details: RiderDetails;
  pickup_location: Coordinates;
  pickup_address: string;
  dropoff_location: Coordinates;
  dropoff_address: string;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  created_at: string;
}

interface RideRequest extends RideBase {
  current_driver_location: Coordinates | null;
}

interface PastRide extends RideBase {
  status: "COMPLETED" | "CANCELLED";
  completed_at: string | null;
}

interface SupabaseRide {
  id: string;
  rider_id: string;
  riders: {
    rider_id: string;
    name: string;
    phone: string;
  };
  pickup_location: string; // WKB format
  pickup_address: string;
  dropoff_location: string; // WKB format
  dropoff_address: string;
  current_driver_location?: string | null; // WKB format
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status?: string;
  created_at: string;
  completed_at?: string | null;
}

// Helper function to safely convert WKB to Coordinates
function safeWkbToLatLng(wkb: string): Coordinates {
  const result = wkbToLatLng(wkb);
  if (!result) {
    console.error("Invalid location data received");
    return { lat: 0, lng: 0 }; // Default coordinates if parsing fails
  }
  return result;
}

// --- MAIN GET HANDLER ---
type Params = Promise<{ driverId: string }>;

export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  const supabase = await createClient();

  try {
    // 1. Extract and validate query parameters
    const { driverId } = await segmentData.params;

    if (!driverId) {
      return createResponse(400, null, "Driver ID is required");
    }

    // 2. Fetch ride requests (status = 'SEARCHING')
    const { data: rideRequests, error: requestsError } = await supabase
      .from("rides_new")
      .select(
        `
        id,
        rider_id,
        riders:rider_id (rider_id, name, phone),
        pickup_location,
        pickup_address,
        dropoff_location,
        dropoff_address,
        current_driver_location,
        distance_km,
        duration_minutes,
        fare,
        created_at
      `
      )
      .eq("driver_id", driverId)
      .eq("status", "SEARCHING");

    if (requestsError) {
      console.error("Error fetching ride requests:", requestsError);
      return createResponse(500, null, "Failed to fetch ride requests");
    }

    // 3. Fetch past rides (status = COMPLETED or CANCELLED)
    const { data: pastRides, error: pastRidesError } = await supabase
      .from("rides_new")
      .select(
        `
        id,
        rider_id,
        riders:rider_id (rider_id, name, phone),
        pickup_location,
        pickup_address,
        dropoff_location,
        dropoff_address,
        distance_km,
        duration_minutes,
        fare,
        status,
        created_at,
        completed_at
      `
      )
      .eq("driver_id", driverId)
      .in("status", ["COMPLETED", "CANCELLED"])
      .order("created_at", { ascending: false });

    if (pastRidesError) {
      console.error("Error fetching past rides:", pastRidesError);
      return createResponse(500, null, "Failed to fetch past rides");
    }

    // 4. Transform the data
    const transformRide = (ride: SupabaseRide): RideBase => ({
      id: ride.id,
      rider_id: ride.rider_id,
      rider_details: {
        rider_id: ride.riders.rider_id,
        name: ride.riders.name,
        phone: ride.riders.phone,
      },
      pickup_location: safeWkbToLatLng(ride.pickup_location),
      pickup_address: ride.pickup_address,
      dropoff_location: safeWkbToLatLng(ride.dropoff_location),
      dropoff_address: ride.dropoff_address,
      distance_km: ride.distance_km,
      duration_minutes: ride.duration_minutes,
      fare: ride.fare,
      created_at: ride.created_at,
    });

    const formattedRequests: RideRequest[] = (rideRequests || []).map(
      (ride) => ({
        ...transformRide(ride),
        current_driver_location: ride.current_driver_location
          ? safeWkbToLatLng(ride.current_driver_location)
          : null,
      })
    );

    const formattedPastRides: PastRide[] = (pastRides || []).map((ride) => ({
      ...transformRide(ride),
      status: ride.status as "COMPLETED" | "CANCELLED",
      completed_at: ride.completed_at || null,
    }));

    return createResponse(200, {
      rideRequests: formattedRequests,
      pastRides: formattedPastRides,
    });
  } catch (error) {
    console.error("Ride data fetch error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
