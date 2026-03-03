import { env } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

type MiddlewareAuthState = {
  isAuthenticated: boolean;
  emailVerified: boolean;
  role: "ADMIN" | "VOTER" | null;
  hasVoterProfile: boolean;
};

type CachedAuthState = {
  value: MiddlewareAuthState | null;
  expiresAt: number;
};

const AUTH_STATE_CACHE_TTL_MS = 3000;
const authStateCache = new Map<string, CachedAuthState>();

function getAuthCacheKey(
  request: NextRequest,
  includeVoterProfile: boolean,
): string {
  const cookie = request.headers.get("cookie") ?? "";
  return `${includeVoterProfile ? "1" : "0"}:${cookie}`;
}

function getCachedAuthState(key: string): MiddlewareAuthState | null | undefined {
  const cached = authStateCache.get(key);
  if (!cached) return undefined;

  if (Date.now() > cached.expiresAt) {
    authStateCache.delete(key);
    return undefined;
  }

  return cached.value;
}

function setCachedAuthState(key: string, value: MiddlewareAuthState | null) {
  authStateCache.set(key, {
    value,
    expiresAt: Date.now() + AUTH_STATE_CACHE_TTL_MS,
  });
}

async function getMiddlewareAuthState(
  request: NextRequest,
  includeVoterProfile: boolean,
): Promise<MiddlewareAuthState | null> {
  const cacheKey = getAuthCacheKey(request, includeVoterProfile);
  const cachedState = getCachedAuthState(cacheKey);

  if (cachedState !== undefined) {
    return cachedState;
  }

  try {
    const endpoint = new URL("/api/auth/voter-profile-status", request.url);
    endpoint.searchParams.set(
      "includeVoterProfile",
      includeVoterProfile ? "true" : "false",
    );

    const response = await fetch(
      endpoint,
      {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      setCachedAuthState(cacheKey, null);
      return null;
    }

    const data = (await response.json()) as Partial<MiddlewareAuthState>;
    const normalized = {
      isAuthenticated: Boolean(data.isAuthenticated),
      emailVerified: Boolean(data.emailVerified),
      role: data.role === "ADMIN" || data.role === "VOTER" ? data.role : null,
      hasVoterProfile: Boolean(data.hasVoterProfile),
    };
    setCachedAuthState(cacheKey, normalized);
    return normalized;
  } catch {
    setCachedAuthState(cacheKey, null);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsVoterProfileCheck = pathname.startsWith("/vote");
  const authState = await getMiddlewareAuthState(
    request,
    needsVoterProfileCheck,
  );

  //* If auth-state lookup fails (network/cold-start/transient issue),
  //* fail open to avoid infinite redirect loops.
  if (!authState) {
    return NextResponse.next();
  }

  //* Redirect to /signup when there's no session
  if (!authState.isAuthenticated) {
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
      needsVoterProfileCheck &&
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
