import prisma from "@/lib/prisma";
import StatisticPositionFilter from "@/components/StatisticPositionFilter";
import StatisticVoteTimeFilter from "@/components/StatisticVoteTimeFilter";
import StatisticRefreshButton from "@/components/StatisticRefreshButton";
import Image from "next/image";
import { BarChart3, CalendarDays, Crown } from "lucide-react";

export const revalidate = 0;

type RankedCandidate = {
  id: string;
  rank: number;
  name: string;
  image: string | null;
  party: string;
  votes: number;
  progress: number;
  accent?: "gold";
};

type CandidateBlock = {
  positionName: string;
  title: string;
  subtitle: string;
  topCandidates: RankedCandidate[];
  allCandidates: RankedCandidate[];
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
          image: true,
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
        );
      const maxVotes =
        sortedCandidates.length > 0 ? sortedCandidates[0].votes : 1;

      const allRankedCandidates: RankedCandidate[] = [];

      sortedCandidates.forEach((candidate, index) => {
        const votes = candidate.votes;
        const progress =
          votes === 0 ? 6 : Math.max(Math.round((votes / maxVotes) * 100), 6);

        allRankedCandidates.push({
          id: candidate.id,
          rank: index + 1,
          name: candidate.fullName,
          image: candidate.image,
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
      const topCandidates = allRankedCandidates.slice(0, 5);

      return {
        positionName: position.name,
        title,
        subtitle: `${position.name} - ${election.name}`,
        topCandidates,
        allCandidates: allRankedCandidates,
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

function CandidateTable({ candidates }: { candidates: RankedCandidate[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border sm:mt-5">
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className="flex flex-col gap-3 border-b bg-white p-3 last:border-b-0 sm:p-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4"
        >
          <div className="flex w-full items-center gap-3 lg:min-w-[280px] lg:flex-1">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-sm font-bold text-white sm:h-10 sm:w-10 sm:text-xl">
              {candidate.rank}
            </span>

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border aspect-square sm:h-14 sm:w-14">
              <Image
                src={candidate.image || "/portrait_placeholder.png"}
                alt={`${candidate.name} profile`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 48px, 56px"
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-slate-800 sm:text-lg lg:text-2xl">
                  {candidate.name}
                </p>
                {candidate.rank <= 3 && (
                  <Crown className={`h-4 w-4 ${crownClass(candidate.rank)}`} />
                )}
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-semibold sm:text-sm`}
                >
                  {candidate.party}
                </span>
              </div>
              <p className="text-sm text-slate-500 sm:text-base">
                {candidate.votes} Votes
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 lg:min-w-[220px] lg:flex-1">
            <div className="h-4 w-full rounded-full bg-amber-50">
              <div
                className={`h-full rounded-full ${barClass()}`}
                style={{ width: `${candidate.progress}%` }}
              />
            </div>
          </div>

          <div className="w-full text-left lg:w-[110px] lg:text-right">
            <p className="text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
              {candidate.votes}
            </p>
            <p className="text-sm text-slate-500 sm:text-base">Votes</p>
          </div>
        </div>
      ))}
    </div>
  );
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
  const rankingTimestamp = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date());

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
    <section className="space-y-4 p-4 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-xl font-semibold text-brand-100 sm:text-2xl lg:text-3xl">
          Election Statistics
        </h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base lg:text-lg">
          Election Statistic for {data.electionName}
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Candidate ranking as of {rankingTimestamp}
          </p>
          <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
            <StatisticRefreshButton />
          </div>
        </div>
      </div>

      {/* FILTER BLOCK */}
      <div className="rounded-2xl border bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatisticPositionFilter
            filterAction={filterAction}
            electionName={data.electionName}
            allPositionNames={data.allPositionNames}
            positionName={normalizedPositionName ?? "all"}
            voteTime={normalizedVoteTime}
          />

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
      <div className="rounded-2xl border bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-content-center rounded-xl bg-amber-50 text-amber-500 sm:h-14 sm:w-14">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                {data.totalVotes.toLocaleString()}{" "}
                <span className="text-lg font-medium text-slate-800 sm:text-2xl lg:text-3xl">
                  Total Votes
                </span>
              </p>
              <p className="text-sm text-slate-500 sm:text-base">Total Votes</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOP CANDIDATES TABLE BLOCKS (PER POSITION) */}
      {data.blocks.map((block: CandidateBlock) => (
        <div
          key={block.positionName}
          className="space-y-6 rounded-2xl border bg-white p-4 sm:space-y-8 sm:p-5 lg:space-y-10"
        >
          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl lg:text-3xl">
            {block.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500 sm:text-base lg:text-xl">
            {block.subtitle}
          </p>

          <CandidateTable candidates={block.topCandidates} />

          {block.allCandidates.length > 5 && (
            <details className="group rounded-xl border border-slate-200 px-4 py-3">
              <summary className="cursor-pointer select-none text-sm font-medium text-slate-700">
                <span className="group-open:hidden text-brand-100">
                  Show remaining candidates ({block.allCandidates.length - 5})
                </span>
                <span className="hidden group-open:inline text-brand-100">
                  Collapse remaining candidates
                </span>
              </summary>
              <CandidateTable candidates={block.allCandidates.slice(5)} />
            </details>
          )}
        </div>
      ))}
    </section>
  );
}
