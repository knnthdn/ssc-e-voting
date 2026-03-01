import { auth } from "@/lib/auth";
import { findIp } from "@arcjet/ip";
import arcjet, {
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

function handleDenied(decision: ArcjetDecision) {
  if (decision.reason.isRateLimit()) {
    return Response.json(
      { message: "Too many requests. Please try again later" },
      { status: 429 },
    );
  }

  if (decision.reason.isEmail()) {
    let message = "Invalid email. Please try another one";
    if (decision.reason.emailTypes.includes("INVALID")) {
      message = "Email address format is invalid. Check for typos";
    } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
      message = "Disposable emails are not allowed";
    } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
      message = "Email domain does not have an MX record";
    }
    return Response.json({ message }, { status: 400 });
  }

  return Response.json(null, { status: 403 });
}

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

//* EMAIL OPTION
const emailOptions = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

//* BOT OPTION
const botOptions = {
  mode: "LIVE",

  allow: [],
} satisfies BotOptions;

//* RESTRICTIVE RATE LIMIT SETTINGS
const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 15,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;

//* LAX RATE LIMIT SETTINGS
const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} satisfies SlidingWindowRateLimitOptions<[]>;

//* SIGN UP OPTIONS
const signupOptions = {
  email: emailOptions,

  bots: botOptions,

  rateLimit: restrictiveRateLimitSettings,
} satisfies ProtectSignupOptions<[]>;

//* PROTECT FUNCTION
async function protect(req: NextRequest): Promise<ArcjetDecision> {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = findIp(req) || "127.0.0.1"; // Fall back to local IP if none
  }

  if (
    req.nextUrl.pathname.startsWith("/api/auth/sign-up") ||
    req.nextUrl.pathname.startsWith("/api/auth/request-password-reset")
  ) {
    const body = await req.clone().json();

    if (typeof body.email === "string") {
      return aj
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, userId });
    } else {
      return aj
        .withRule(detectBot(botOptions))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(req, { userId });
    }
  } else {
    return aj
      .withRule(detectBot(botOptions))
      .withRule(slidingWindow(laxRateLimitSettings))
      .protect(req, { userId });
  }
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

//* CUSTOM POST REQUEST (BETTER AUTH)
export const POST = async (req: NextRequest) => {
  const decision = await protect(req);

  if (decision.isDenied()) return handleDenied(decision);

  return authHandlers.POST(req.clone());
};
