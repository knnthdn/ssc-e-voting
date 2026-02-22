import { getSession } from "@/actions/auth-actions";
import { Prisma } from "@/lib/generated/prisma/client";
import { getEffectiveElectionStatus } from "@/lib/election-status";
import prisma from "@/lib/prisma";

type VoteItem = {
  positionId: string;
  candidateId: string;
};

type VotePayload = {
  slug?: string;
  votes?: VoteItem[];
};

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { ok: false, message: "Authentication Error" },
      { status: 401 },
    );
  }

  const body = (await req.json()) as VotePayload;
  const slug = body.slug;
  const votes = body.votes;

  if (!slug || !Array.isArray(votes) || votes.length === 0) {
    return Response.json(
      { ok: false, message: "Invalid vote payload." },
      { status: 400 },
    );
  }

  const [voter, election] = await Promise.all([
    prisma.voter.findUnique({
      where: { voterId: session.user.id },
      select: { id: true },
    }),
    prisma.election.findUnique({
      where: { slug },
      select: { id: true, status: true, start: true, end: true },
    }),
  ]);

  if (!voter) {
    return Response.json(
      { ok: false, message: "Voter profile not found." },
      { status: 404 },
    );
  }

  if (
    !election ||
    getEffectiveElectionStatus({
      status: election.status,
      start: election.start,
      end: election.end,
    }) !== "ONGOING"
  ) {
    return Response.json(
      { ok: false, message: "Election is not available for voting." },
      { status: 400 },
    );
  }

  const alreadyVoted = await prisma.vote.findFirst({
    where: {
      voterId: voter.id,
      electionId: election.id,
    },
    select: { id: true },
  });

  if (alreadyVoted) {
    return Response.json(
      { ok: false, message: "You already voted in this election." },
      { status: 409 },
    );
  }

  const candidateIds = [...new Set(votes.map((item) => item.candidateId))];

  if (candidateIds.length !== votes.length) {
    return Response.json(
      { ok: false, message: "Duplicate candidates in payload." },
      { status: 400 },
    );
  }

  const candidates = await prisma.candidate.findMany({
    where: { id: { in: candidateIds } },
    select: {
      id: true,
      positionId: true,
      position: {
        select: {
          electionId: true,
        },
      },
    },
  });

  if (candidates.length !== votes.length) {
    return Response.json(
      { ok: false, message: "One or more candidates are invalid." },
      { status: 400 },
    );
  }

  const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const usedPositions = new Set<string>();

  for (const item of votes) {
    const candidate = candidateMap.get(item.candidateId);

    if (!candidate) {
      return Response.json(
        { ok: false, message: "Candidate not found." },
        { status: 400 },
      );
    }

    if (candidate.positionId !== item.positionId) {
      return Response.json(
        { ok: false, message: "Candidate does not match the selected position." },
        { status: 400 },
      );
    }

    if (candidate.position.electionId !== election.id) {
      return Response.json(
        { ok: false, message: "Candidate is not part of this election." },
        { status: 400 },
      );
    }

    if (usedPositions.has(item.positionId)) {
      return Response.json(
        { ok: false, message: "Only one candidate per position is allowed." },
        { status: 400 },
      );
    }

    usedPositions.add(item.positionId);
  }

  try {
    await prisma.vote.createMany({
      data: votes.map((item) => ({
        voterId: voter.id,
        electionId: election.id,
        positionId: item.positionId,
        candidateId: item.candidateId,
      })),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { ok: false, message: "You already voted in this election." },
        { status: 409 },
      );
    }

    return Response.json(
      { ok: false, message: "Unable to submit your vote." },
      { status: 500 },
    );
  }

  return Response.json(
    { ok: true, message: "Vote submitted successfully." },
    { status: 200 },
  );
}
