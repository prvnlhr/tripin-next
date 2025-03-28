import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  // Debug logging
  // console.log("Middleware session:", {
  //   user: user?.email,
  //   path: pathname,
  //   cookies: request.cookies.getAll(),
  // });

  // Your existing routing logic
  if (user && pathname.startsWith("/user/auth")) {
    return NextResponse.redirect(new URL("/user/trip/book-ride", request.url));
  }

  if (!user && pathname.startsWith("/user/trip")) {
    return NextResponse.redirect(new URL("/user/auth", request.url));
  }

  return supabaseResponse;
}
