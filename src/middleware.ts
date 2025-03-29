import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|public/).*)",
    "/user/:path*",
    "/driver/:path*",
    "/admin/:path*",
    "/api/auth/verify-magic-link",
    "/api/user/profile",
  ],
};
