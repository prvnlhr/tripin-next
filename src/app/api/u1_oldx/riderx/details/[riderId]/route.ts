import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";

// Define status constants for better maintainability
type Params = Promise<{ riderId: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const supabase = await createClient();
    const { riderId } = await segmentData.params;

    // Validate riderId
    if (!riderId) {
      return createResponse(
        400,
        null,
        "Rider ID is required",
        "Missing required parameters"
      );
    }

    // Fetch rider information
    const { data: rider, error: riderError } = await supabase
      .from("riders")
      .select(
        `
        rider_id,
        user_id,
        name,
        phone
      `
      )
      .eq("rider_id", riderId)
      .maybeSingle();

    if (riderError) {
      throw new Error(
        `Failed to fetch rider information: ${riderError.message}`
      );
    }

    if (!rider) {
      return createResponse(
        404,
        null,
        "Rider not found",
        "Rider with the specified ID not found"
      );
    }

    // Get count of active rides
    const { count: activeRidesCount = 0, error: countError } = await supabase
      .from("rides_new")
      .select("*", { count: "exact", head: true })
      .eq("rider_id", riderId)
      .in("status", [
        "DRIVER_ASSIGNED",
        "REACHED_PICKUP",
        "TRIP_STARTED",
        "TRIP_ENDED",
      ]);
    console.log(" activeRidesCount:", activeRidesCount);

    if (countError) {
      console.error("Error fetching ride count:", countError);
    }

    return createResponse(
      200,
      {
        ...rider,
        active_rides_count: activeRidesCount,
      },
      null,
      "Rider information fetched successfully"
    );
  } catch (error) {
    console.error("GET Error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Unknown error",
      "Error in fetching rider information"
    );
  }
}
