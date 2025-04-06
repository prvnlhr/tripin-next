import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";

interface RiderProfileUpdate {
  name: string;
  phone: string;
}
type Params = Promise<{ riderId: string }>;

export async function PATCH(
  request: Request,
  segmentData: { params: Params }
): Promise<Response> {
  const supabase = await createClient();
  const { riderId } = await segmentData.params;

  try {
    // 1. Validate riderId
    if (!riderId) {
      return createResponse(400, null, "Rider ID is required");
    }

    // 2. Parse and validate request body
    const { profileData }: { profileData?: RiderProfileUpdate } =
      await request.json();

    if (!profileData) {
      return createResponse(400, null, "Profile data is required");
    }

    const { name, phone } = profileData;
    if (!name || !phone) {
      return createResponse(400, null, "Name and phone are required fields");
    }

    // 3. Get current user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return createResponse(401, null, "Unauthorized - Please log in");
    }

    // 4. Verify rider exists and belongs to the current user
    const { data: rider, error: riderError } = await supabase
      .from("riders")
      .select("user_id")
      .eq("rider_id", riderId)
      .single();

    if (riderError || !rider) {
      return createResponse(404, null, "Rider profile not found");
    }

    if (rider.user_id !== user.id) {
      return createResponse(
        403,
        null,
        "Forbidden - You can only update your own profile"
      );
    }

    // 5. Update rider profile
    const { error: updateError } = await supabase
      .from("riders")
      .update({
        name,
        phone,
        is_first_login: false,
        updated_at: new Date().toISOString(),
      })
      .eq("rider_id", riderId);

    if (updateError) {
      console.error("Database update error:", updateError);
      return createResponse(500, null, "Failed to update rider profile");
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
        rider_id: riderId,
        name,
        phone,
      },
    });
  } catch (error) {
    console.error("Rider profile update error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
