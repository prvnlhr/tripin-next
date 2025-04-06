import { createClient } from "@/utils/supabase/server";
import { createResponse } from "@/utils/apiResponseUtils";

type Params = Promise<{ rideId: string }>;

// -- PATCH API UPDATE THE RIDE STATUS BY RIDER : RIDE COMPLETED --
export async function PATCH(request: Request, segmentData: { params: Params }) {
  const supabase = await createClient();
  try {
    // 1. Extract and validate parameters
    const { rideId } = await segmentData.params;

    if (!rideId) {
      return createResponse(400, null, "rideId are required");
    }

    const completeRideData = {
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
    };

    const { data: updatedRide, error: updateError } = await supabase
      .from("rides_new")
      .update(completeRideData)
      .eq("id", rideId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // 5. Return success response
    return createResponse(200, {
      ...updatedRide,
      message: "Ride successfully completed",
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
