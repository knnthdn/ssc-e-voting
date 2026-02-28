import { getSession } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ ok: false, hasVoterProfile: false }, { status: 401 });
  }

  const voter = await prisma.voter.findUnique({
    where: { voterId: session.user.id },
    select: { id: true },
  });

  return Response.json({
    ok: true,
    hasVoterProfile: Boolean(voter),
  });
}
