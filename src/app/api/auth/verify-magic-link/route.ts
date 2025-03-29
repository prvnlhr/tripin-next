import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role") as
    | "rider"
    | "driver"
    | "admin"
    | null;

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=Invalid link`
    );
  }

  const supabase = await createClient();

  try {
    // 1. Authenticate user with magic link
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    const userId = data.user?.id;
    const email = data.user?.email;
    if (!userId || !email) throw new Error("Authentication failed");

    // 2. Determine user's role
    const resolvedRole = role || data.user?.user_metadata?.role || "rider";

    // 3. Update users table (EXACTLY matching your schema)
    const { error: userError } = await supabase.from("users").upsert(
      {
        user_id: userId,
        email,
        role: resolvedRole,
        updated_at: new Date().toISOString(), // Only fields that exist in your schema
      },
      { onConflict: "user_id" }
    );
    if (userError) throw userError;

    // 4. Check onboarding status from role-specific table
    const { requiresOnboarding, redirectPath } = await checkOnboardingStatus(
      userId,
      resolvedRole,
      requestUrl.origin
    );

    // 5. Update session metadata (not stored in DB)
    await supabase.auth.updateUser({
      data: {
        ...data.user?.user_metadata,
        role: resolvedRole,
        requires_onboarding: requiresOnboarding, // Session-only flag
        last_verified: new Date().toISOString(),
      },
    });

    return NextResponse.redirect(redirectPath);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=${error instanceof Error ? error.message : "Verification failed"}`
    );
  }
}

async function checkOnboardingStatus(
  userId: string,
  role: "rider" | "driver" | "admin",
  origin: string
): Promise<{ requiresOnboarding: boolean; redirectPath: string }> {
  const supabase = await createClient();
  const roleTable = {
    rider: "riders",
    driver: "drivers",
    admin: "admins",
  }[role];

  const paths = {
    rider: {
      completed: "/user/trip/book-ride",
      onboarding: "/user/auth/onboarding/profile",
    },
    driver: {
      completed: "/driver/dashboard",
      onboarding: "/driver/auth/onboarding",
    },
    admin: {
      completed: "/admin/dashboard",
      onboarding: "/admin/auth/onboarding",
    },
  };

  const { data: profile, error } = await supabase
    .from(roleTable)
    .select("is_first_login")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  const requiresOnboarding = !profile || profile.is_first_login !== false;

  return {
    requiresOnboarding,
    redirectPath: requiresOnboarding
      ? `${origin}${paths[role].onboarding}`
      : `${origin}${paths[role].completed}`,
  };
}
