// /app/api/user/profile/route.ts
import { createResponse } from "@/utils/apiResponseUtils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

// GET: Fetch rider profile (unchanged)
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return createResponse(400, null, "User ID is required.");
    }

    const supabase = await createClient();

    const { data: profile, error: profileError } = await supabase
      .from("riders")
      .select("name, phone, is_first_login")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return createResponse(500, null, "Failed to fetch profile.");
    }

    if (!profile) {
      return createResponse(404, null, "Profile not found.");
    }

    return createResponse(200, {
      name: profile.name,
      phone: profile.phone,
      isComplete: !profile.is_first_login,
    });
  } catch (error) {
    console.error("Error in GET profile route:", error);
    return createResponse(500, null, "Internal server error");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, name, phone } = await req.json();

    console.log(" phone:", phone);
    console.log(" name:", name);
    console.log(" userId:", userId);

    if (!userId || !name || !phone) {
      return createResponse(400, null, "All fields are required.");
    }

    const supabase = await createClient();

    // 1. Verify user exists and get role
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_id, role")
      .eq("user_id", userId)
      .single();

    if (userError || !user) {
      return createResponse(404, null, "User record not found.");
    }

    // 2. Update role-specific profile (using is_first_login from your schema)
    const roleTable = {
      rider: "riders",
      driver: "drivers",
      admin: "admins",
    }[user.role as "rider" | "driver" | "admin"];

    const { error: profileError } = await supabase.from(roleTable).upsert(
      {
        user_id: userId,
        name,
        phone,
        is_first_login: false, // Mark onboarding as complete
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (profileError) throw profileError;

    // 3. Update auth session metadata (not stored in DB)
    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        ...(await supabase.auth.getUser()).data.user?.user_metadata, // Preserve existing
        name,
        phone,
        requires_onboarding: false, // Session-only flag
        onboarded_at: new Date().toISOString(),
      },
    });

    if (authUpdateError) throw authUpdateError;

    // 4. Update users table (only with fields that exist in your schema)
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
      data: { name, phone, role: user.role },
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
