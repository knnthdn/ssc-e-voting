import { Session } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";

export async function hasVotersData(session: Session): Promise<boolean> {
  if (!session) return false;

  const voter = await prisma.voter.findUnique({
    where: { voterId: session.user.id },
  });

  if (!voter) return false;

  return true;
}
