"use server";

import { createClient } from "@/utils/supabase/server";
import type { AuthResponse } from "@/types/authTypes";

export async function signInWithMagicLink(
  email: string,
  attemptedRole: "rider" | "driver" | "admin"
): Promise<AuthResponse> {
  const supabase = await createClient();
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  // const baseUrl = "https://tripin-next.vercel.app";

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

  try {
    // 1. Check if user exists with a different role
    const { data: existingUser, error: queryError } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .maybeSingle();

    if (queryError) throw queryError;

    if (existingUser && existingUser.role !== attemptedRole) {
      return {
        success: false,
        errorType: "WRONG_ROLE",
        correctRole: existingUser.role,
        correctPortal: `/${existingUser.role}/auth`,
      };
    }

    // 2. Send magic link for new users or correct role
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: { role: attemptedRole },
        emailRedirectTo: `${baseUrl}/api/auth/verify-magic-link?role=${attemptedRole}`,
      },
    });

    if (authError) throw authError;

    return {
      success: true,
      message: "Check your email for the sign in link",
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      errorType: "GENERIC_ERROR",
      message: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

// signOut
export async function signOut() {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Sign-out failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Sign out failed",
    };
  }
}
