import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { wkbToLatLng } from "@/utils/geoUtils";
type Params = Promise<{ requestId: string }>;

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
  location: string;
  car_name: string;
  car_model: string;
  license_plate: string;
  cab_type: string;
  is_online: boolean;
}

interface RideResponse {
  id: string;
  rider_id: string;
  driver_id: string | null;
  rider_details: RiderDetails;
  driver_details: DriverDetails | null;
  pickup_location: Coordinates;
  pickup_address: string;
  dropoff_location: Coordinates;
  dropoff_address: string;
  current_driver_location: Coordinates | null;
  distance_km: number;
  duration_minutes: number;
  fare: number;
  status: string;
  created_at: string;
}

// -- GETTING DETAILS OF A RIDE REQUEST MADE BY RIDER :  FOR THE RIDE REQUEST PAGE --
export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { requestId } = await segmentData.params;

    // Validate requestId
    if (!requestId || typeof requestId !== "string") {
      return createResponse(400, null, "Valid requestId is required");
    }

    const { data: rideData, error } = await supabase
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
        status,
        created_at
      `
      )
      .eq("id", requestId)
      .single();

    if (error || !rideData) {
      console.error("Error fetching ride request:", error);
      return createResponse(404, null, "Ride request not found");
    }

    // Transform the data
    const transformLocation = (wkb: string | null): Coordinates | null => {
      if (!wkb) return null;
      const coords = wkbToLatLng(wkb);
      return coords || null;
    };

    const response: RideResponse = {
      id: rideData.id,
      rider_id: rideData.rider_id,
      driver_id: rideData.driver_id,
      rider_details: rideData.rider_details as RiderDetails,
      driver_details: rideData.driver_details as DriverDetails | null,
      pickup_location: transformLocation(rideData.pickup_location)!,
      pickup_address: rideData.pickup_address,
      dropoff_location: transformLocation(rideData.dropoff_location)!,
      dropoff_address: rideData.dropoff_address,
      current_driver_location: transformLocation(
        rideData.current_driver_location
      ),
      distance_km: rideData.distance_km,
      duration_minutes: rideData.duration_minutes,
      fare: rideData.fare,
      status: rideData.status,
      created_at: rideData.created_at,
    };

    return createResponse(200, response);
  } catch (error) {
    console.error("Error in GET ride request:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------------
// -- PATCH API TO ACCEPT A RIDE REQUEST --------------------------------------------------------------------------------------------------------------

interface RideUpdatePayload {
  rider_id: string;
  driver_id: string;
  status?:
    | "DRIVER_ASSIGNED"
    | "REACHED_PICKUP"
    | "TRIP_STARTED"
    | "TRIP_ENDED"
    | "COMPLETED"
    | "CANCELLED";
}

interface UpdateRidePayload {
  status:
    | "DRIVER_ASSIGNED"
    | "REACHED_PICKUP"
    | "TRIP_STARTED"
    | "TRIP_ENDED"
    | "COMPLETED"
    | "CANCELLED";
  driver_id: string;
  accepted_at?: string;
  reached_pickup_at?: string;
  trip_started_at?: string;
  trip_ended_at?: string;
  completed_at?: string;
}

export async function PATCH(request: Request, segmentData: { params: Params }) {
  const supabase = await createClient();
  try {
    // 1. Extract and validate parameters
    const { requestId } = await segmentData.params;
    const rideDetails: RideUpdatePayload = await request.json();

    if (!requestId || typeof requestId !== "string") {
      return createResponse(400, null, "Valid request ID is required");
    }

    if (!rideDetails.rider_id || !rideDetails.driver_id) {
      return createResponse(
        400,
        null,
        "Both rider_id and driver_id are required"
      );
    }

    const newStatus = rideDetails.status || "DRIVER_ASSIGNED";

    // 2. Verify the ride exists and is in a valid state
    const { data: existingRide, error: fetchError } = await supabase
      .from("rides_new")
      .select("*")
      .eq("id", requestId)
      .eq("rider_id", rideDetails.rider_id)
      .single();

    if (fetchError || !existingRide) {
      return createResponse(404, null, "Ride not found or rider mismatch");
    }

    // 3. Update the ride status
    const updatePayload: UpdateRidePayload = {
      status: newStatus,
      driver_id: rideDetails.driver_id,
    };

    // Set appropriate timestamps based on status
    if (newStatus === "DRIVER_ASSIGNED") {
      updatePayload.accepted_at = new Date().toISOString();
    } else if (newStatus === "REACHED_PICKUP") {
      updatePayload.reached_pickup_at = new Date().toISOString();
    } else if (newStatus === "TRIP_STARTED") {
      updatePayload.trip_started_at = new Date().toISOString();
    } else if (newStatus === "TRIP_ENDED") {
      updatePayload.trip_ended_at = new Date().toISOString();
    } else if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
      updatePayload.completed_at = new Date().toISOString();
    }

    const { data: updatedRide, error: updateError } = await supabase
      .from("rides_new")
      .update(updatePayload)
      .eq("id", requestId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // 4. If this is a new driver assignment, clean up other requests
    if (newStatus === "DRIVER_ASSIGNED") {
      // Delete other requests from this rider
      const { error: deleteRiderRequestsError } = await supabase
        .from("rides_new")
        .delete()
        .eq("rider_id", rideDetails.rider_id)
        .eq("status", "SEARCHING")
        .neq("id", requestId);

      if (deleteRiderRequestsError) {
        console.error(
          "Failed to delete rider's other requests:",
          deleteRiderRequestsError
        );
        // Continue even if this fails - it's not critical
      }

      // Delete other requests to this driver
      const { error: deleteDriverRequestsError } = await supabase
        .from("rides_new")
        .delete()
        .eq("driver_id", rideDetails.driver_id)
        .eq("status", "SEARCHING")
        .neq("id", requestId);

      if (deleteDriverRequestsError) {
        console.error(
          "Failed to delete driver's other requests:",
          deleteDriverRequestsError
        );
        // Continue even if this fails - it's not critical
      }
    }

    // 5. Return success response
    return createResponse(200, {
      ...updatedRide,
      message: "Ride successfully updated",
    });
  } catch (error) {
    console.error("Error in PATCH ride request:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
