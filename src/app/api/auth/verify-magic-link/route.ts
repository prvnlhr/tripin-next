import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type UserRole = "rider" | "driver" | "admin";
type UserMetadata = {
  role: UserRole;
  requires_onboarding: boolean;
  last_verified: string;
  email: string;
  rider_id?: string;
  driver_id?: string;
  admin_id?: string;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role") as UserRole | null;

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
    const email = data.user?.email ?? "";
    if (!userId) throw new Error("Authentication failed");

    // 2. Determine user's role (default to rider if not specified)
    const resolvedRole = role || data.user?.user_metadata?.role || "rider";

    // 3. Create or update user in users table
    const { error: userError } = await supabase.from("users").upsert(
      {
        user_id: userId,
        email,
        role: resolvedRole,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (userError) throw userError;

    // 4. Ensure role-specific record exists and get onboarding status
    const { roleId, requiresOnboarding } = await ensureRoleSpecificRecord(
      userId,
      resolvedRole
    );

    // 5. Prepare metadata with all required fields
    const metadataUpdate: UserMetadata = {
      role: resolvedRole,
      requires_onboarding: requiresOnboarding,
      last_verified: new Date().toISOString(),
      email,
    };

    // Add role-specific ID to metadata
    if (resolvedRole === "rider") {
      metadataUpdate.rider_id = roleId;
    } else if (resolvedRole === "driver") {
      metadataUpdate.driver_id = roleId;
    } else if (resolvedRole === "admin") {
      metadataUpdate.admin_id = roleId;
    }

    // 6. Update session metadata
    await supabase.auth.updateUser({
      data: metadataUpdate,
    });

    // 7. Determine redirect path based on onboarding status
    const redirectPath = getRedirectPath(
      resolvedRole,
      requiresOnboarding,
      requestUrl.origin
    );

    return NextResponse.redirect(redirectPath);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=${error instanceof Error ? error.message : "Verification failed"}`
    );
  }
}

async function ensureRoleSpecificRecord(
  userId: string,
  role: UserRole
): Promise<{ roleId: string; requiresOnboarding: boolean }> {
  const supabase = await createClient();
  const roleTable = {
    rider: "riders",
    driver: "drivers",
    admin: "admins",
  }[role];

  // Check if record exists
  const { data: existingRecord, error: fetchError } = await supabase
    .from(roleTable)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  // If record exists, return its ID and onboarding status
  if (existingRecord) {
    return {
      roleId: existingRecord[`${role}_id`],
      requiresOnboarding: existingRecord.is_first_login !== false,
    };
  }

  // Create new record if it doesn't exist
  const insertData = {
    user_id: userId,
    is_first_login: true,
    ...(role === "driver"
      ? {
          name: "",
          phone: "",
          approval_status: "pending",
        }
      : {}),
    ...(role === "rider" || role === "admin"
      ? {
          name: "",
          phone: "",
        }
      : {}),
  };

  const { data: newRecord, error: insertError } = await supabase
    .from(roleTable)
    .insert(insertData)
    .select()
    .single();

  if (insertError) throw insertError;

  return {
    roleId: newRecord[`${role}_id`],
    requiresOnboarding: true,
  };
}

function getRedirectPath(
  role: UserRole,
  requiresOnboarding: boolean,
  origin: string
): string {
  const paths = {
    rider: {
      completed: "/user/trip/book-ride",
      onboarding: "/user/auth/onboarding/profile",
    },
    driver: {
      completed: "/driver/dashboard",
      onboarding: "/driver/auth/onboarding/profile",
    },
    admin: {
      completed: "/admin/dashboard",
      onboarding: "/admin/auth/onboarding/profile",
    },
  };

  return requiresOnboarding
    ? `${origin}${paths[role].onboarding}`
    : `${origin}${paths[role].completed}`;
}
