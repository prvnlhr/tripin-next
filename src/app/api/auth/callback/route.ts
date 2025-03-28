import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo =
    requestUrl.searchParams.get("redirect") || "/user/trip/book-ride";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/user/auth?error=Invalid link`
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
}
