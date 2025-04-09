import { createResponse } from "@/utils/apiResponseUtils";
import { wkbToLatLng } from "@/utils/geoUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

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

interface TransformedRide {
  id: string;
  rider_id: string;
  driver_id: string;
  rider_details: RiderDetails;
  driver_details: DriverDetails;
  pickup_location: Coordinates | null;
  pickup_address: string;
  dropoff_location: Coordinates | null;
  dropoff_address: string;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status: string;
  created_at: string;
  completed_at: string;
}

function safeWkbToLatLng(wkb: string | null): Coordinates | null {
  if (!wkb) return null;
  const result = wkbToLatLng(wkb);
  return result || null;
}

type Params = Promise<{ riderId: string }>;
export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  const supabase = await createClient();

  try {
    const { riderId } = await segmentData.params;

    if (!riderId) {
      return createResponse(400, null, "Rider ID is required");
    }

    // Fetch past rides
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
      .eq("rider_id", riderId)
      .in("status", ["COMPLETED", "CANCELLED"])
      .order("created_at", { ascending: false });

    if (pastRidesError) {
      console.error("Error fetching past rides:", pastRidesError);
      return createResponse(500, null, "Failed to fetch past rides");
    }

    const transformedRides: TransformedRide[] = pastRides.map((ride) => ({
      ...ride,
      pickup_location: ride.pickup_location
        ? safeWkbToLatLng(ride.pickup_location)
        : null,
      dropoff_location: ride.dropoff_location
        ? safeWkbToLatLng(ride.dropoff_location)
        : null,
    }));

    return createResponse(200, {
      pastRides: transformedRides,
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

//  PATCH HANDLER TO CHANGE DRIVER ONLINE STATUS ------------------------------------------------------------------------------
export async function PATCH(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { riderId } = await segmentData.params;

    if (!riderId) {
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
      .eq("driver_id", riderId)
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
      .eq("driver_id", riderId)
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
