import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";

// GET : get a driver by driver_id ---------------------------------------------------------------------------------------------------------
export async function GET(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    if (!requestId) {
      return createResponse(400, null, "requestId is required.");
    }

    const supabase = await createClient();

    // Fetch the driver with matching driver_id
    const { data: driver, error: fetchError } = await supabase
      .from("drivers")
      .select("*")
      .eq("driver_id", requestId)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase Error:", fetchError);
      return createResponse(500, null, "Failed to fetch driver.");
    }

    if (!driver) {
      return createResponse(404, null, "Driver not found.");
    }

    return createResponse(200, driver, null, "Driver fetched successfully.");
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(500, null, errorMessage, "Error in fetching driver.");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    if (!requestId) {
      return createResponse(400, null, "requestId is required.");
    }

    const supabase = await createClient();

    const { approval_status, cab_type } = await req.json();

    if (
      !approval_status ||
      !["approved", "rejected"].includes(approval_status)
    ) {
      return createResponse(
        400,
        null,
        "Valid approval_status (approved/rejected) is required."
      );
    }

    // Fetch the driver with matching driver_id
    const { data: driver, error: fetchError } = await supabase
      .from("drivers")
      .select("*")
      .eq("driver_id", requestId)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase Error:", fetchError);
      return createResponse(500, null, "Failed to fetch driver.");
    }
    if (!driver) {
      return createResponse(404, null, "Driver not found.");
    }

    // Update based on approval_status
    const updateData: {
      approval_status: string;
      cab_type?: string;
      updated_at: string;
    } = {
      approval_status,
      updated_at: new Date().toISOString(),
    };

    if (approval_status === "approved") {
      if (!cab_type) {
        return createResponse(400, null, "Cab type is required for approval.");
      }
      updateData.cab_type = cab_type;
    }

    const { error: updateError } = await supabase
      .from("drivers")
      .update(updateData)
      .eq("driver_id", requestId);

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      return createResponse(500, null, "Failed to update driver request.");
    }

    return createResponse(
      200,
      null,
      null,
      `Driver request ${approval_status} successfully.`
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createResponse(
      500,
      null,
      errorMessage,
      "Error in processing driver request."
    );
  }
}
