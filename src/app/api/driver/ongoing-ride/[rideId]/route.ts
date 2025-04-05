import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/utils/apiResponseUtils";

interface RideUpdatePayload {
  rider_id: string;
  status:
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

  rider_id: string;
  accepted_at?: string;
  reached_pickup_at?: string;
  trip_started_at?: string;
  trip_ended_at?: string;
  completed_at?: string;
}
type Params = Promise<{ rideId: string }>;

// -- PATCH API UPDATE THE RIDE STATUS BY DRIVER FOR RIDER --
export async function PATCH(request: Request, segmentData: { params: Params }) {
  const supabase = await createClient();
  try {
    // 1. Extract and validate parameters
    const { rideId } = await segmentData.params;
    const rideDetails: RideUpdatePayload = await request.json();

    if (!rideId || !rideDetails.rider_id) {
      return createResponse(400, null, "Both rider_id and rideId are required");
    }
    const newStatus = rideDetails.status;

    // 2. Verify the ride exists and is in a valid state
    const { data: existingRide, error: fetchError } = await supabase
      .from("rides_new")
      .select("*")
      .eq("id", rideId)
      .eq("rider_id", rideDetails.rider_id)
      .single();

    if (fetchError || !existingRide) {
      return createResponse(404, null, "Ride not found or rider mismatch");
    }

    // 3. Update the ride status
    const updatePayload: UpdateRidePayload = {
      status: newStatus,
      rider_id: rideDetails.rider_id,
    };

    if (newStatus === "REACHED_PICKUP") {
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
      .eq("id", rideId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
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
