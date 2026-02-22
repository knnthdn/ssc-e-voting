import prisma from "@/lib/prisma";
import StatisticVoteTimeFilter from "@/components/StatisticVoteTimeFilter";
import Image from "next/image";
import { BarChart3, BriefcaseBusiness, CalendarDays, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

type RankedCandidate = {
  id: string;
  rank: number;
  name: string;
  party: string;
  votes: number;
  progress: number;
  accent?: "gold";
};

export type StatisticProps = {
  electionSlug?: string;
  positionName?: string;
  voteTime?: string;
  filterAction?: string;
};

function normalizePositionFilter(value?: string): string | undefined {
  if (!value) return undefined;

  const normalized = value.trim().toUpperCase();
  if (!normalized) return undefined;
  if (normalized === "ALL" || normalized === "ALL POSITIONS") return undefined;

  return value.trim();
}

function barClass() {
  return "bg-gradient-to-r from-yellow-300 to-yellow-500";
}

function crownClass(rank: number) {
  if (rank === 1) return "text-yellow-500";
  if (rank === 2) return "text-slate-400";
  return "text-amber-700";
}

type VoteTimeFilter = "all" | "15m" | "1h" | "6h" | "24h" | "7d";

const voteTimeOptions: { value: VoteTimeFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "15m", label: "15 minutes ago" },
  { value: "1h", label: "1 hour ago" },
  { value: "6h", label: "6 hours ago" },
  { value: "24h", label: "24 hours ago" },
  { value: "7d", label: "7 days ago" },
];

function normalizeVoteTime(value?: string): VoteTimeFilter {
  if (value === "15m") return "15m";
  if (value === "1h") return "1h";
  if (value === "6h") return "6h";
  if (value === "24h") return "24h";
  if (value === "7d") return "7d";
  return "all";
}

function getVoteTimeStart(time: VoteTimeFilter): Date | undefined {
  const now = new Date();

  if (time === "15m") return new Date(now.getTime() - 15 * 60 * 1000);
  if (time === "1h") return new Date(now.getTime() - 60 * 60 * 1000);
  if (time === "6h") return new Date(now.getTime() - 6 * 60 * 60 * 1000);
  if (time === "24h") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (time === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return undefined;
}

async function getStatisticData(
  electionSlug?: string,
  positionName?: string,
  voteTime?: VoteTimeFilter,
) {
  if (!electionSlug) {
    throw new Error("Statistic component requires an electionSlug.");
  }

  const election = await prisma.election.findUnique({
    where: { slug: electionSlug },
    select: {
      id: true,
      name: true,
      positions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!election) return null;

  const voteTimeStart = getVoteTimeStart(voteTime ?? "all");
  const uniqueVoters = await prisma.vote.findMany({
    where: {
      electionId: election.id,
      ...(voteTimeStart ? { createdAt: { gte: voteTimeStart } } : {}),
    },
    select: {
      voterId: true,
    },
    distinct: ["voterId"],
  });

  const totalVotes = uniqueVoters.length;

  const normalizedPositionName = normalizePositionFilter(positionName);

  const positions = normalizedPositionName
    ? election.positions.filter(
        (position) =>
          position.name.toUpperCase() === normalizedPositionName.toUpperCase(),
      )
    : election.positions;

  const blocks = await Promise.all(
    positions.map(async (position) => {
      const grouped = await prisma.vote.groupBy({
        by: ["candidateId"],
        where: {
          electionId: election.id,
          positionId: position.id,
          ...(voteTimeStart ? { createdAt: { gte: voteTimeStart } } : {}),
        },
        _count: {
          candidateId: true,
        },
        orderBy: {
          _count: {
            candidateId: "desc",
          },
        },
      });

      const candidates = await prisma.candidate.findMany({
        where: { positionId: position.id },
        select: {
          id: true,
          fullName: true,
          partylist: {
            select: { name: true },
          },
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      });

      const voteCountByCandidateId = new Map(
        grouped.map((item) => [item.candidateId, item._count.candidateId]),
      );
      const sortedCandidates = candidates
        .map((candidate) => ({
          ...candidate,
          votes: voteCountByCandidateId.get(candidate.id) ?? 0,
        }))
        .sort(
          (a, b) => b.votes - a.votes || a.fullName.localeCompare(b.fullName),
        )
        .slice(0, 5);
      const maxVotes =
        sortedCandidates.length > 0 ? sortedCandidates[0].votes : 1;

      const rankedCandidates: RankedCandidate[] = [];

      sortedCandidates.forEach((candidate, index) => {
        const votes = candidate.votes;
        const progress =
          votes === 0 ? 6 : Math.max(Math.round((votes / maxVotes) * 100), 6);

        rankedCandidates.push({
          id: candidate.id,
          rank: index + 1,
          name: candidate.fullName,
          party: candidate.partylist?.name ?? "INDEPENDENT",
          votes,
          progress,
          accent: "gold",
        });
      });

      const hasLessThanFive = candidates.length < 5;
      const title = hasLessThanFive
        ? `Top Candidates - ${position.name}`
        : `Top 5 Candidates - ${position.name}`;

      return {
        positionName: position.name,
        title,
        subtitle: `${position.name} - ${election.name}`,
        candidates: rankedCandidates,
      };
    }),
  );

  return {
    electionName: election.name,
    totalVotes,
    allPositionNames: election.positions.map((position) => position.name),
    blocks,
  };
}

export default async function Statistic({
  electionSlug,
  positionName,
  voteTime,
  filterAction = "/admin/dashboard",
}: StatisticProps) {
  const normalizedPositionName = normalizePositionFilter(positionName);

  const normalizedVoteTime = normalizeVoteTime(voteTime);

  const data = await getStatisticData(
    electionSlug,
    normalizedPositionName,
    normalizedVoteTime,
  );

  if (!data) {
    return (
      <section className="space-y-4 p-8">
        <div className="rounded-2xl border bg-white p-8">
          <h2 className="text-2xl font-semibold text-brand-100 lg:text-3xl">
            Election Not Found
          </h2>
          <p className="mt-2 text-base text-slate-500 lg:text-lg">
            No election exists for slug:{" "}
            <span className="font-medium">{electionSlug}</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-semibold text-brand-100 lg:text-3xl">
          Election Statistics
        </h2>
        <p className="mt-2 text-base text-slate-500 lg:text-lg">
          Election Statistic for {data.electionName}
        </p>
      </div>

      {/* FILTER BLOCK */}
      <div className="rounded-2xl border bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form
            method="get"
            action={filterAction}
            className="flex flex-wrap items-center gap-2"
          >
            <input type="hidden" name="voteTime" value={normalizedVoteTime} />

            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
              <BriefcaseBusiness className="h-4 w-4" />
              {data.electionName}
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2">
              <BriefcaseBusiness className="h-4 w-4 text-amber-700" />
              <select
                name="position"
                defaultValue={normalizedPositionName ?? "all"}
                className="bg-transparent text-sm font-medium text-amber-900 outline-none"
              >
                <option value="all">All Positions</option>
                {data.allPositionNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="rounded-3xl">
              Apply
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2">
              <CalendarDays className="h-4 w-4" />
              <StatisticVoteTimeFilter
                filterAction={filterAction}
                voteTime={normalizedVoteTime}
                position={normalizedPositionName ?? "all"}
                options={voteTimeOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TOTAL VOTES SUMMARY */}
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-content-center rounded-xl bg-amber-50 text-amber-500">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 lg:text-4xl">
                {data.totalVotes.toLocaleString()}{" "}
                <span className="text-2xl font-medium text-slate-800 lg:text-3xl">
                  Total Votes
                </span>
              </p>
              <p className="text-lg text-slate-500">Total Votes</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOP CANDIDATES TABLE BLOCKS (PER POSITION) */}
      {data.blocks.map((block) => (
        <div
          key={block.positionName}
          className="rounded-2xl border bg-white p-5 space-y-10"
        >
          <h3 className="text-2xl font-semibold text-slate-900 lg:text-3xl">
            {block.title}
          </h3>
          <p className="mt-2 text-base text-slate-500 lg:text-xl">
            {block.subtitle}
          </p>

          {/* TABLE CONTENT */}
          <div className="mt-5 overflow-hidden rounded-2xl border">
            {block.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex flex-wrap items-center gap-4 border-b bg-white p-4 last:border-b-0"
              >
                <div className="flex min-w-[280px] flex-1 items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-xl font-bold text-white">
                    {candidate.rank}
                  </span>

                  <div className="relative h-14 w-14 overflow-hidden rounded-full border">
                    <Image
                      src="/portrait_placeholder.png"
                      alt={`${candidate.name} placeholder`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xl font-semibold text-slate-800 lg:text-2xl">
                        {candidate.name}
                      </p>
                      {candidate.rank <= 3 && (
                        <Crown
                          className={`h-4 w-4 ${crownClass(candidate.rank)}`}
                        />
                      )}
                      <span
                        className={`rounded-md border px-2 py-0.5 text-sm font-semibold`}
                      >
                        {candidate.party}
                      </span>
                    </div>
                    <p className="text-lg text-slate-500">
                      {candidate.votes} Votes
                    </p>
                  </div>
                </div>

                <div className="flex min-w-[220px] flex-1 items-center gap-3">
                  <div className="h-4 w-full rounded-full bg-amber-50">
                    <div
                      className={`h-full rounded-full ${barClass()}`}
                      style={{ width: `${candidate.progress}%` }}
                    />
                  </div>
                </div>

                <div className="w-[110px] text-right">
                  <p className="text-3xl font-semibold text-slate-900 lg:text-4xl">
                    {candidate.votes}
                  </p>
                  <p className="text-lg text-slate-500">Votes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
