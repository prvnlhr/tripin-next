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

interface DriverDetails {
  driver_id: string;
  name: string;
  phone: string;
  location: Coordinates | null;
  car_name: string | null;
  car_model: string | null;
  license_plate: string | null;
  cab_type: string | null;
  is_online: boolean;
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
  driver_id: string | null;
  driver_details: DriverDetails | null;
}

interface PastRide extends RideBase {
  status: "COMPLETED" | "CANCELLED";
  completed_at: string | null;
  driver_id: string | null;
  driver_details: DriverDetails | null;
}

interface SupabaseRide {
  id: string;
  rider_id: string;
  driver_id: string | null;
  rider_details: {
    rider_id: string;
    name: string;
    phone: string;
  };
  driver_details: {
    driver_id: string;
    name: string;
    phone: string;
    location: string | null;
    car_name: string | null;
    car_model: string | null;
    license_plate: string | null;
    cab_type: string | null;
    is_online: boolean;
  } | null;
  pickup_location: string;
  pickup_address: string;
  dropoff_location: string;
  dropoff_address: string;
  current_driver_location: string | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status?: string;
  created_at: string;
  completed_at?: string | null;
}

// Helper function to safely convert WKB to Coordinates
function safeWkbToLatLng(wkb: string | null): Coordinates | null {
  if (!wkb) return null;
  const result = wkbToLatLng(wkb);
  return result || null;
}

// --- MAIN GET HANDLER TO GET ALL THE RIDE REQUEST FOR A DRIVER ---
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
        driver_id,
        rider_details,
        driver_details,
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
        driver_id,
        rider_details,
        driver_details,
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
    const transformRide = (ride: SupabaseRide) => {
      const baseRide = {
        id: ride.id,
        rider_id: ride.rider_id,
        driver_id: ride.driver_id,
        rider_details: ride.rider_details,
        pickup_location: safeWkbToLatLng(ride.pickup_location)!,
        pickup_address: ride.pickup_address,
        dropoff_location: safeWkbToLatLng(ride.dropoff_location)!,
        dropoff_address: ride.dropoff_address,
        distance_km: ride.distance_km,
        duration_minutes: ride.duration_minutes,
        fare: ride.fare,
        created_at: ride.created_at,
      };

      // Transform driver details if they exist
      const transformedDriverDetails = ride.driver_details
        ? {
            ...ride.driver_details,
            location: safeWkbToLatLng(ride.driver_details.location),
          }
        : null;

      return {
        ...baseRide,
        driver_details: transformedDriverDetails,
      };
    };

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


// -- HANDLER TO TOOGLE DRIVER ONLINE STATUS --

export async function PATCH(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { driverId } = await segmentData.params;

    if (!driverId) {
      return createResponse(
        400,
        null,
        "Driver ID is required",
        "Missing required parameters"
      );
    }

    // Get current status first
    const { data: currentDriver, error: fetchError } = await supabase
      .from("drivers")
      .select("is_online")
      .eq("driver_id", driverId)
      .single();

    if (fetchError) {
      throw new Error(
        "Failed to fetch current driver status: " + fetchError.message
      );
    }

    // Toggle the status
    const newStatus = !currentDriver.is_online;
    const { data: updatedDriver, error: updateError } = await supabase
      .from("drivers")
      .update({
        is_online: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("driver_id", driverId)
      .select("is_online")
      .single();

    if (updateError) {
      throw new Error("Failed to update driver status: " + updateError.message);
    }

    return createResponse(
      200,
      { is_online: updatedDriver.is_online },
      null,
      "Driver online status updated successfully"
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in toggling driver online status"
    );
  }
}
