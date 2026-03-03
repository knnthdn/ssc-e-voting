import { getSession } from "@/actions/auth-actions";
import VotersCandidate from "@/features/voters/_component/VotersCandidate";
import { getEffectiveElectionStatus } from "@/lib/election-status";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

type VotersElectionIdProps = {
  params: Promise<{ electionId: string }>;
};

export default async function VotersElectionId({
  params,
}: VotersElectionIdProps) {
  const { electionId } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const [voter, election, existingVote] = await Promise.all([
    prisma.voter.findUnique({
      where: { voterId: session.user.id },
      select: { id: true },
    }),
    prisma.election.findUnique({
      where: { slug: electionId },
      select: { id: true, status: true, start: true, end: true },
    }),
    prisma.vote.findFirst({
      where: {
        voter: {
          is: {
            voterId: session.user.id,
          },
        },
        election: {
          is: {
            slug: electionId,
          },
        },
      },
      select: { id: true },
    }),
  ]);

  if (
    !voter ||
    !election ||
    getEffectiveElectionStatus({
      status: election.status,
      start: election.start,
      end: election.end,
    }) !== "ONGOING"
  ) {
    redirect("/vote");
  }

  if (existingVote) {
    redirect("/vote");
  }

  return <VotersCandidate slug={electionId} />;
}
