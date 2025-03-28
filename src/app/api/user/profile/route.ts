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

// POST: Create rider profile (for new users)
export async function POST(req: NextRequest) {
  try {
    const { userId, name, phone } = await req.json();

    if (!userId || !name || !phone) {
      return createResponse(400, null, "All fields are required.");
    }

    const supabase = await createClient();

    // Verify user exists in public.users (created during auth callback)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (userError || !user) {
      return createResponse(
        404,
        null,
        "User record not found. Please sign in again."
      );
    }

    // Create rider profile (no upsert - this should be a fresh creation)
    const { error: profileError } = await supabase.from("riders").insert({
      user_id: userId,
      name,
      phone,
      is_first_login: false,
    });

    if (profileError) {
      console.error("Error creating rider profile:", profileError);
      return createResponse(500, null, "Failed to create rider profile.");
    }

    return createResponse(201, { success: true });
  } catch (error) {
    console.error("Error in POST profile route:", error);
    return createResponse(500, null, "Internal server error");
  }
}
