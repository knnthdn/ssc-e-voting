import { getSession, Session } from "@/actions/auth-actions";
import { authClient } from "@/lib/auth-client";
import { findIp } from "@arcjet/ip";
import arcjet, {
  type ArcjetDecision,
  type BotOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { NextRequest } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

//* BOT OPTION
const botOptions = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions;

const rateLimit = {
  mode: "LIVE",
  max: 5,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;

async function protect(
  req: NextRequest,
  session: Session,
): Promise<ArcjetDecision> {
  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = findIp(req) || "127.0.0.1";
  }

  return aj
    .withRule(detectBot(botOptions))
    .withRule(slidingWindow(rateLimit))
    .protect(req, { userId });
}
export async function POST(request: NextRequest) {
  const session = await getSession();

  const decision = await protect(request, session);

  if (!session)
    return Response.json({ message: "unauthorize action" }, { status: 401 });

  try {
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      if (decision.reason.isRateLimit()) {
        return Response.json(
          {
            error: true,
            message: "Too many request please try again in 10 minutes",
          },
          { status: 429 },
        );
      } else {
        return Response.json(
          {
            error: true,
            message: "Something went wrong, Please contact support",
          },
          { status: 500 },
        );
      }
    }

    const { error } = await authClient.sendVerificationEmail({
      email: session.user.email,
    });

    if (error) {
      return Response.json(
        { error: true, message: error.message },
        { status: 500 },
      );
    }

    return Response.json({ error: false, message: "Success" }, { status: 200 });
  } catch {
    return Response.json(
      { error: true, message: "InternalError" },
      { status: 500 },
    );
  }
}
