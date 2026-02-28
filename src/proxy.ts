import { getSession } from "@/actions/auth-actions";
import { env } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

async function hasVoterDataInMiddleware(request: NextRequest): Promise<boolean> {
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

    if (!response.ok) return false;

    const data = (await response.json()) as { hasVoterProfile?: boolean };
    return Boolean(data.hasVoterProfile);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  //* Redirect to /signup when no there's no Session
  if (!session) {
    if (pathname !== "/register") {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    return NextResponse.next();
  }

  //* Will check if there's a session
  if (session) {
    const voterData = await hasVoterDataInMiddleware(request);

    //* CHECK IF ADMIN
    if (
      !request.nextUrl.pathname.startsWith("/admin") &&
      session.user.role === "ADMIN" &&
      session.user.emailVerified
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    //* Redirect to /email-activation when user email is not verified
    if (
      request.nextUrl.pathname !== "/email-activation" &&
      !session.user.emailVerified &&
      env.EMAIL_VERIFICATION === "true"
    ) {
      return NextResponse.redirect(new URL("/email-activation", request.url));
    }

    //* Check if user email is verified but has no voters data.
    if (
      !request.nextUrl.pathname.startsWith("/admin") &&
      !voterData &&
      session.user.emailVerified &&
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
