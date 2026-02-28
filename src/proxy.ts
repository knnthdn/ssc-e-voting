import { env } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

type MiddlewareAuthState = {
  isAuthenticated: boolean;
  emailVerified: boolean;
  role: "ADMIN" | "VOTER" | null;
  hasVoterProfile: boolean;
};

async function getMiddlewareAuthState(
  request: NextRequest,
): Promise<MiddlewareAuthState | null> {
  try {
    const response = await fetch(
      new URL("/api/auth/voter-profile-status", request.url),
      {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as Partial<MiddlewareAuthState>;
    return {
      isAuthenticated: Boolean(data.isAuthenticated),
      emailVerified: Boolean(data.emailVerified),
      role: data.role === "ADMIN" || data.role === "VOTER" ? data.role : null,
      hasVoterProfile: Boolean(data.hasVoterProfile),
    };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authState = await getMiddlewareAuthState(request);

  //* Redirect to /signup when no there's no Session
  if (!authState?.isAuthenticated) {
    if (pathname !== "/register") {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    return NextResponse.next();
  }

  //* Will check if there's a session
  if (authState.isAuthenticated) {
    const voterData = authState.hasVoterProfile;

    //* CHECK IF ADMIN
    if (
      !request.nextUrl.pathname.startsWith("/admin") &&
      authState.role === "ADMIN" &&
      authState.emailVerified
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    //* Redirect to /email-activation when user email is not verified
    if (
      request.nextUrl.pathname !== "/email-activation" &&
      !authState.emailVerified &&
      env.EMAIL_VERIFICATION === "true"
    ) {
      return NextResponse.redirect(new URL("/email-activation", request.url));
    }

    //* Check if user email is verified but has no voters data.
    if (
      !request.nextUrl.pathname.startsWith("/admin") &&
      !voterData &&
      authState.emailVerified &&
      request.nextUrl.pathname !== "/register-form"
    ) {
      return NextResponse.redirect(new URL("/register-form", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vote/:path*",
    "/email-activation/:path*",
    "/register-form/:path*",
    "/admin/:path*",
  ],
};
