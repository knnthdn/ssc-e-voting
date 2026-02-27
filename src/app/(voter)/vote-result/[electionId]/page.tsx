import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Crown, Medal } from "lucide-react";
import Image from "next/image";

type VoteResultPageProps = {
  params: Promise<{ electionId: string }>;
};

type CandidateResult = {
  id: string;
  fullName: string;
  image: string | null;
  partylistName: string;
  votes: number;
};

export const revalidate = 0;

function percentage(value: number, total: number) {
  if (total <= 0) return "0.0";
  return ((value / total) * 100).toFixed(1);
}

function ResultFallback({ message }: { message: string }) {
  return (
    <div className="h-full w-full grid place-content-center">
      <div className="flex flex-col justify-center items-center">
        <div className="relative h-37.5 w-75 xl:h-50 xl:w-87.5">
          <Image
            alt="No Election image"
            src={"/no-election.png"}
            fill
            className="absolute object-cover"
          />
        </div>
        <p className="text-lg xl:text-xl text-center">{message}</p>
      </div>
    </div>
  );
}

export default async function VoteResultByElectionPage({
  params,
}: VoteResultPageProps) {
  const { electionId } = await params;

  const election = await prisma.election.findUnique({
    where: { slug: electionId },
    select: {
      id: true,
      name: true,
      status: true,
      end: true,
      positions: {
        select: {
          id: true,
          name: true,
          canditates: {
            select: {
              id: true,
              fullName: true,
              image: true,
              partylist: {
                select: { name: true },
              },
            },
            orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
          },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: {
          votes: true,
          positions: true,
        },
      },
    },
  });

  if (!election) {
    return <ResultFallback message="Election not found." />;
  }

  const now = new Date();
  const isResultAvailable =
    election.status === "COMPLETED" || new Date(election.end) <= now;

  if (!isResultAvailable) {
    return (
      <ResultFallback message="Results are not available yet for this election." />
    );
  }

  if (election.positions.length === 0) {
    return <ResultFallback message="No positions found for this election." />;
  }

  const groupedVotes = await prisma.vote.groupBy({
    by: ["positionId", "candidateId"],
    where: { electionId: election.id },
    _count: {
      candidateId: true,
    },
  });

  const voteCountByKey = new Map(
    groupedVotes.map((entry) => [
      `${entry.positionId}:${entry.candidateId}`,
      entry._count.candidateId,
    ]),
  );

  const positions = election.positions.map((position) => {
    const rankedCandidates: CandidateResult[] = position.canditates
      .map((candidate) => ({
        id: candidate.id,
        fullName: candidate.fullName,
        image: candidate.image,
        partylistName: candidate.partylist?.name ?? "INDEPENDENT",
        votes: voteCountByKey.get(`${position.id}:${candidate.id}`) ?? 0,
      }))
      .sort(
        (a, b) => b.votes - a.votes || a.fullName.localeCompare(b.fullName),
      );

    const totalPositionVotes = rankedCandidates.reduce(
      (sum, candidate) => sum + candidate.votes,
      0,
    );
    const topVotes = rankedCandidates[0]?.votes ?? 0;
    const winners = rankedCandidates.filter(
      (candidate) => topVotes > 0 && candidate.votes === topVotes,
    );
    const isTie = winners.length > 1;

    return {
      id: position.id,
      name: position.name,
      rankedCandidates,
      totalPositionVotes,
      topVotes,
      winners,
      isTie,
    };
  });

  const uniqueVoters = await prisma.vote.findMany({
    where: { electionId: election.id },
    select: { voterId: true },
    distinct: ["voterId"],
  });
  const totalVoterVotes = uniqueVoters.length;

  return (
    <section className="space-y-5 mt-5 px-2 sm:px-5 lg:mt-8 lg:px-10 xl:px-12">
      <div className="rounded-2xl border bg-white p-5">
        <h2 className="text-2xl text-brand-100 lg:text-3xl">
          Election Results
        </h2>
        <p className="mt-1 text-slate-600">{election.name}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <Badge variant="outline">Total Votes: {totalVoterVotes}</Badge>
          <Badge variant="outline">
            Positions: {election._count.positions}
          </Badge>
          <Badge
            variant="outline"
            className="border-green-300 bg-green-50 text-green-700"
          >
            {election.status}
          </Badge>
        </div>
      </div>

      {positions.map((position) => (
        <Card key={position.id} className="border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl">{position.name}</CardTitle>
              {position.topVotes === 0 ? (
                <Badge variant="outline">No Votes</Badge>
              ) : position.isTie ? (
                <Badge className="bg-orange-500">TIE</Badge>
              ) : (
                <Badge className="bg-amber-500">WINNER</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {position.rankedCandidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No candidates for this position.
              </p>
            ) : position.topVotes === 0 ? (
              <p className="text-sm text-muted-foreground">
                No votes have been cast for this position yet.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {position.winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="rounded-xl border border-amber-200 bg-amber-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-full border">
                        <Image
                          //   src={winner.image || "/portrait_placeholder.png"}
                          src={"/portrait_placeholder.png"}
                          alt={`${winner.fullName} profile`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-base">
                            {winner.fullName}
                          </p>
                          {position.isTie ? (
                            <Medal className="h-4 w-4 text-orange-500" />
                          ) : (
                            <Crown className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {winner.partylistName}
                        </p>
                        <p className="text-sm mt-1">
                          {winner.votes} votes (
                          {percentage(
                            winner.votes,
                            position.totalPositionVotes,
                          )}
                          %)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {position.rankedCandidates.length > 0 && (
              <div className="overflow-hidden rounded-xl border">
                {position.rankedCandidates.map((candidate, index) => {
                  const progress =
                    position.topVotes > 0
                      ? Math.max(
                          Math.round(
                            (candidate.votes / position.topVotes) * 100,
                          ),
                          6,
                        )
                      : 0;

                  return (
                    <div
                      key={candidate.id}
                      className="grid gap-3 border-b px-4 py-3 last:border-b-0 md:grid-cols-[auto_1fr_auto]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-slate-100 px-2 text-xs font-semibold">
                          {index + 1}
                        </span>
                        <p className="font-medium">{candidate.fullName}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {percentage(
                            candidate.votes,
                            position.totalPositionVotes,
                          )}
                          %
                        </span>
                      </div>

                      <p className="text-right text-sm font-semibold">
                        {candidate.votes} votes
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
