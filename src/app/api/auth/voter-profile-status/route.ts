import { getSession } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeVoterProfile = searchParams.get("includeVoterProfile") !== "false";
  const session = await getSession();

  if (!session) {
    return Response.json(
      {
        ok: false,
        isAuthenticated: false,
        emailVerified: false,
        role: null,
        hasVoterProfile: false,
      },
      { status: 200 },
    );
  }

  const voter = includeVoterProfile
    ? await prisma.voter.findUnique({
        where: { voterId: session.user.id },
        select: { id: true },
      })
    : null;

  return Response.json({
    ok: true,
    isAuthenticated: true,
    emailVerified: Boolean(session.user.emailVerified),
    role: session.user.role,
    hasVoterProfile: includeVoterProfile ? Boolean(voter) : false,
  });
}
