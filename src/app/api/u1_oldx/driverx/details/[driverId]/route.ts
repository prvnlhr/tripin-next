import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";

type Params = Promise<{ driverId: string }>;
export async function GET(request: Request, segmentData: { params: Params }) {
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

    const { data: driver, error: driverError } = await supabase
      .from("drivers")
      .select(
        `
        driver_id,
        user_id,
        name,
        phone,
        car_name,
        car_model,
        license_plate,
        cab_type,
        is_online,
        location,
        approval_status,
        is_first_login,
        created_at,
        updated_at
      `
      )
      .eq("driver_id", driverId)
      .single();

    if (driverError) {
      throw new Error(
        "Failed to fetch driver information: " + driverError.message
      );
    }

    if (!driver) {
      return createResponse(
        404,
        null,
        "Driver not found",
        "Driver with the specified ID not found"
      );
    }

    // Get count of active rides for this driver
    const { count: activeRidesCount, error: countError } = await supabase
      .from("rides_new")
      .select("*", { count: "exact", head: true })
      .eq("driver_id", driverId)
      // .neq("status", "COMPLETED")
      // .neq("status", "CANCELLED");
      .in("status", [
        "DRIVER_ASSIGNED",
        "REACHED_PICKUP",
        "TRIP_STARTED",
        "TRIP_ENDED",
      ]);

    if (countError) {
      console.error("Error fetching ride count:", countError);
      // Continue with response even if count fails
    }

    return createResponse(
      200,
      {
        ...driver,
        active_rides_count: activeRidesCount || 0,
      },
      null,
      "Driver information fetched successfully"
    );
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in fetching driver information"
    );
  }
}

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
