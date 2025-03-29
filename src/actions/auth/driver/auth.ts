"use server";

import { createClient } from "@/utils/supabase/server";

export async function signInWithMagicLink(email: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/driver/auth/verify-magic-link`,
      },
    });
    if (error) {
      console.error("Sign-in error:", error.message);
      return {
        success: false,
        message: error.message || "Failed to send magic link",
      };
    }

    return {
      success: true,
      message: "Check your email for the magic link!",
    };
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Authentication error:", errorMessage);
    } else {
      console.error("Unknown authentication error occurred:", error);
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

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
