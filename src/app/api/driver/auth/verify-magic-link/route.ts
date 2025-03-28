import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/driver/auth?error=Invalid link`
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/driver/auth?error=Invalid link`
    );
  }

  const userId = data.user?.id;
  const email = data.user?.email;

  if (!userId || !email) {
    return NextResponse.redirect(
      `${requestUrl.origin}/driver/auth?error=Authentication failed`
    );
  }

  // Create public.users record (if doesn't exist)
  const { error: userError } = await supabase.from("users").upsert(
    {
      user_id: userId,
      email: email,
      role: "driver", // Default role for driver
    },
    {
      onConflict: "user_id",
    }
  );

  if (userError) {
    console.error("User record creation failed:", userError);
    return NextResponse.redirect(
      `${requestUrl.origin}/driver/auth?error=Profile setup failed`
    );
  }

  // Check driver profile existence
  const { data: rider } = await supabase
    .from("riders")
    .select("is_first_login")
    .eq("user_id", userId)
    .single();

  // Redirect logic
  return NextResponse.redirect(
    rider?.is_first_login === false
      ? `${requestUrl.origin}/driver/dashboard`
      : `${requestUrl.origin}/driver/onboarding/profile`
  );
}
