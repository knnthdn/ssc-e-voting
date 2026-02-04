import { getSession } from "@/actions/auth-actions";
import { hasVotersData } from "@/features/auth/_actions/hasVotersData";
import { env } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await getSession();

  //* Redirect to /signup when no there's no Session
  if (!session) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  //* Will check if there's a session
  if (session) {
    const voterData = await hasVotersData(session);

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
