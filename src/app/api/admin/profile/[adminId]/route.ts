import { AdminProfileData } from "@/types/admin/adminTypes";
import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";

type Params = Promise<{ adminId: string }>;

export async function PATCH(
  request: Request,
  segmentData: { params: Params }
): Promise<Response> {
  const supabase = await createClient();
  const { adminId } = await segmentData.params;

  try {
    // 1. Validate adminId
    if (!adminId) {
      return createResponse(400, null, "Admin ID is required");
    }

    // 2. Parse and validate request body
    const { profileData }: { profileData?: AdminProfileData } =
      await request.json();

    if (!profileData) {
      return createResponse(400, null, "Profile data is required");
    }

    const { name, phone } = profileData;

    // Validate all required fields
    const requiredFields = { name, phone };
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

    // 3. Get current user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return createResponse(401, null, "Unauthorized - Please log in");
    }

    // 4. Verify admin exists and belongs to the current user
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("user_id")
      .eq("admin_id", adminId)
      .single();

    if (adminError || !admin) {
      return createResponse(404, null, "Admin profile not found");
    }

    if (admin.user_id !== user.id) {
      return createResponse(
        403,
        null,
        "Forbidden - You can only update your own profile"
      );
    }

    // 5. Update admin profile
    const { error: updateError } = await supabase
      .from("admins")
      .update({
        name,
        phone,
        is_first_login: false,
        updated_at: new Date().toISOString(),
      })
      .eq("admin_id", adminId);

    if (updateError) {
      console.error("Database update error:", updateError);
      return createResponse(500, null, "Failed to update admin profile");
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
        admin_id: adminId,
        name,
        phone,
      },
    });
  } catch (error) {
    console.error("Admin profile update error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
