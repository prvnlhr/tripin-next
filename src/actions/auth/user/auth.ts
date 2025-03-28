"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function siginWithMagicLink(email: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
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

    if (error) {
      console.error("Sign-out error:", error.message);
      return {
        success: false,
        message: error.message || "Failed to sign out",
      };
    }

    // Redirect after successful sign out
    redirect("/user/auth");
  } catch (error) {
    let errorMessage = "An unexpected error occurred during sign out";

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Sign-out error:", errorMessage);
    } else {
      console.error("Unknown sign-out error occurred:", error);
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
