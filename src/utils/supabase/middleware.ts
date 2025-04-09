import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (
    request.nextUrl.pathname.startsWith("/api") &&
    ![
      "/api/auth/verify-magic-link",
      "/api/rider/profile/:path*",
      "/api/driver/profile/:path*",
      "/api/admin/profile/:path*",
    ].some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    return supabaseResponse;
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  return supabaseResponse;

  // Route configuration
  const routeConfig = {
    rider: {
      auth: "/user/auth",
      onboarding: "/user/auth/onboarding/profile",
      main: "/user/trip",
      mainRedirect: "/user/trip/book-ride",
    },
    driver: {
      auth: "/driver/auth",
      onboarding: "/driver/auth/onboarding/profile",
      main: "/driver/dashboard",
      mainRedirect: "/driver/dashboard",
    },
    admin: {
      auth: "/admin/auth",
      onboarding: "/admin/auth/onboarding/profile",
      main: "/admin/dashboard",
      mainRedirect: "/admin/dashboard",
    },
  } as const;

  // Determine role (default to 'rider' if not set)
  const role =
    (user?.user_metadata?.role as keyof typeof routeConfig) || "rider";
  const config = routeConfig[role];

  const requiresOnboarding = user?.user_metadata?.requires_onboarding !== false;
  // 1. Unauthenticated users
  if (!user) {
    // Allow auth pages and API route for magic link verification
    if (
      pathname === config.auth ||
      pathname === routeConfig.driver.auth ||
      pathname === routeConfig.admin.auth ||
      pathname.startsWith("/api/auth/verify-magic-link")
    ) {
      return supabaseResponse;
    }
    // Restrict everything else
    return NextResponse.redirect(new URL(config.auth, request.url));
  }

  // 2. Authenticated users
  // requires_onboarding: true means NOT onboarded, false means onboarded

  if (requiresOnboarding) {
    // Allowed: onboarding page only
    if (
      pathname === config.onboarding ||
      pathname === "/api/rider/profile" ||
      pathname === "/api/driver/profile" ||
      pathname === "/api/admin/profile"
    ) {
      return supabaseResponse;
    }
    // Restrict everything else, redirect to onboarding
    return NextResponse.redirect(new URL(config.onboarding, request.url));
  }

  // Onboarded (requires_onboarding: false)
  if (!requiresOnboarding) {
    // Allowed: main pages
    if (
      pathname.startsWith(config.main) ||
      pathname === "/api/rider/profile" ||
      pathname === "/api/driver/profile" ||
      pathname === "/api/admin/profile"
    ) {
      return supabaseResponse;
    }
    // Restrict auth and onboarding pages, redirect to main
    return NextResponse.redirect(new URL(config.mainRedirect, request.url));
  }

  return supabaseResponse;
}

// return supabaseResponse;
// console.log({
//   user: user?.email,
//   role,
//   requiresOnboarding,
//   pathname,
//   redirect: supabaseResponse.headers.get("Location"),
// });
