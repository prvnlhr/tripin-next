import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";

type Params = Promise<{ driverId: string }>;

// Type for driver profile data (without cab_type)
type DriverProfileData = {
  name: string;
  phone: string;
  car_name: string;
  car_model: string;
  license_plate: string;
};

export async function PATCH(request: Request, segmentData: { params: Params }) {
  const supabase = await createClient();
  const { driverId } = await segmentData.params;

  try {
    // 1. Validate driverId
    if (!driverId) {
      return createResponse(400, null, "Driver ID is required");
    }

    // 2. Parse and validate request body
    const { profileData }: { profileData?: DriverProfileData } =
      await request.json();

    if (!profileData) {
      return createResponse(400, null, "Profile data is required");
    }

    const { name, phone, car_name, car_model, license_plate } = profileData;

    const requiredFields = { name, phone, car_name, car_model, license_plate };
    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return createResponse(
        400,
        null,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    if (missingFields.length > 0) {
      return createResponse(
        400,
        null,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    // 3. Get current user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return createResponse(401, null, "Unauthorized - Please log in");
    }

    // 4. Verify driver exists and belongs to the current user
    const { data: driver, error: driverError } = await supabase
      .from("drivers")
      .select("user_id")
      .eq("driver_id", driverId)
      .single();

    if (driverError || !driver) {
      return createResponse(404, null, "Driver profile not found");
    }

    if (driver.user_id !== user.id) {
      return createResponse(
        403,
        null,
        "Forbidden - You can only update your own profile"
      );
    }

    // 5. Update driver profile (without cab_type)
    const { error: updateError } = await supabase
      .from("drivers")
      .update({
        name,
        phone,
        car_name,
        car_model,
        license_plate,
        is_first_login: false,
        updated_at: new Date().toISOString(),
      })
      .eq("driver_id", driverId);

    if (updateError) {
      console.error("Database update error:", updateError);
      return createResponse(500, null, "Failed to update driver profile");
    }

    // 6. Update auth metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        name,
        phone,
        requires_onboarding: false,
      },
    });

    if (metadataError) {
      console.error("Auth metadata update error:", metadataError);
      return createResponse(500, null, "Failed to update user metadata");
    }

    // 7. Update users table timestamp
    await supabase
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    // 8. Return success response
    return createResponse(200, {
      success: true,
      data: {
        driver_id: driverId,
        name,
        phone,
        car_name,
        car_model,
        license_plate,
      },
    });
  } catch (error) {
    console.error("Driver profile update error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
