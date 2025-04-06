import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, profileData } = await req.json();
    const { name, phone } = profileData;

    console.log("Request data:", { userId, profileData });

    if (!userId || !name || !phone) {
      return createResponse(400, null, "All fields are required.");
    }

    const supabase = await createClient();

    // 1. Verify user exists and get role.
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_id, role")
      .eq("user_id", userId)
      .single();

    if (userError || !user) {
      return createResponse(404, null, "User record not found.");
    }

    // 2. Update rider profile
    const { error: profileError } = await supabase.from("riders").upsert(
      {
        user_id: userId,
        ...profileData,
        is_first_login: false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (profileError) throw profileError;

    // 3. Update auth session metadata
    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        ...(await supabase.auth.getUser()).data.user?.user_metadata,
        ...profileData,
        requires_onboarding: false,
        onboarded_at: new Date().toISOString(),
      },
    });

    if (authUpdateError) throw authUpdateError;

    const { error: usersUpdateError } = await supabase
      .from("users")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (usersUpdateError) throw usersUpdateError;

    // 5. Refresh session
    await supabase.auth.refreshSession();

    return createResponse(200, {
      success: true,
      data: { ...profileData, role: user.role },
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return createResponse(
      500,
      null,
      error instanceof Error ? error.message : "Onboarding failed"
    );
  }
}
