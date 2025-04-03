import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/utils/apiResponseUtils";

type RideStatus =
  | "ACCEPTED"
  | "ARRIVED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

type Params = Promise<{ rideId: string }>;

export async function PATCH(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { rideId } = await segmentData.params;
    const { status }: { status: RideStatus } = await request.json();

    // Validate inputs
    if (!rideId) {
      return createResponse(400, null, "rideId is required in URL params");
    }

    if (!status) {
      return createResponse(400, null, "status is required in request body");
    }

    // Prepare update data
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Update the ride
    const { error } = await supabase
      .from("rides")
      .update(updateData)
      .eq("id", rideId);

    if (error) throw error;

    // Return just the success message without ride data
    return createResponse(200, null, `Ride status updated to ${status}`);
  } catch (error) {
    console.error("Error updating ride status:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Failed to update ride status"
    );
  }
}
