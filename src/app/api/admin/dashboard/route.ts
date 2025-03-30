import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();

    // Fetch unverified drivers (is_verified: false, is_first_login: false)
    const { data: unverifiedDrivers, error: unverifiedError } = await supabase
      .from("drivers")
      .select(
        "driver_id, user_id, name, phone, car_name, car_model, license_plate, cab_type, approval_status, is_online, location, created_at, updated_at"
      )
      .eq("approval_status", "pending")
      .eq("is_first_login", false);

    if (unverifiedError) {
      throw new Error(
        "Failed to fetch unverified drivers: " + unverifiedError.message
      );
    }

    // Fetch verified drivers (is_verified: true, is_first_login: false)
    const { data: verifiedDrivers, error: verifiedError } = await supabase
      .from("drivers")
      .select(
        "driver_id, user_id, name, phone, car_name, car_model, license_plate, cab_type, approval_status, is_online, location, created_at, updated_at"
      )
      .eq("approval_status", "approved")
      .eq("is_first_login", false);

    if (verifiedError) {
      throw new Error(
        "Failed to fetch verified drivers: " + verifiedError.message
      );
    }

    // Combine data into response
    const dashboardData = {
      unverifiedDrivers: unverifiedDrivers || [],
      verifiedDrivers: verifiedDrivers || [],
    };

    return createResponse(
      200,
      dashboardData,
      null,
      "Dashboard content fetched successfully"
    );
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return createResponse(
      500,
      null,
      errorMessage,
      "Error in fetching dashboard content"
    );
  }
}
