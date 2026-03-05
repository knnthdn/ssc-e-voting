import { getSession } from "@/actions/auth-actions";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import ElectionCard from "@/features/admin/_components/ElectionCard";
import ElectionLoading from "@/features/admin/_components/manage/ElectionLoading";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { CheckCircle2, Clock3, ListChecks } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default function VotersPage() {
  return (
    <Suspense fallback={<ElectionLoading />}>
      <FetchElections />
    </Suspense>
  );
}

async function FetchElections() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [voter, activeElection] = await Promise.all([
    prisma.voter.findUnique({
      where: { voterId: session.user.id },
      select: { id: true },
    }),
    prisma.election.findMany({
      where: {
        status: {
          in: ["ONGOING", "PAUSED"],
        },
        end: { gte: sevenDaysAgo },
      },
      include: {
        _count: {
          select: {
            partylists: true,
          },
        },
      },
    }),
  ]);

  if (!voter) {
    redirect("/");
  }

  const visibleElections = activeElection;

  const visibleElectionIds = visibleElections.map((election) => election.id);

  const [positionCounts, votedElectionIds] =
    visibleElectionIds.length === 0
      ? [[], []]
      : await Promise.all([
          prisma.position.findMany({
            where: {
              electionId: {
                in: visibleElectionIds,
              },
            },
            select: {
              electionId: true,
              _count: {
                select: {
                  canditates: true,
                },
              },
            },
          }),
          prisma.vote.findMany({
            where: {
              voterId: voter.id,
              electionId: {
                in: visibleElectionIds,
              },
            },
            select: { electionId: true },
            distinct: ["electionId"],
          }),
        ]);

  const candidateCountByElectionId = (
    positionCounts as typeof positionCounts
  ).reduce((acc, position) => {
    acc.set(
      position.electionId,
      (acc.get(position.electionId) ?? 0) + position._count.canditates,
    );
    return acc;
  }, new Map<string, number>());

  const votedElectionIdSet = new Set(
    votedElectionIds.map((item) => item.electionId),
  );
  const totalElections = visibleElections.length;
  const votedCount = votedElectionIdSet.size;
  const pendingCount = Math.max(totalElections - votedCount, 0);

  if (visibleElections.length === 0)
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

          <p className="text-lg xl:text-xl">
            There&apos;s no active election yet.
          </p>

          <Link
            href="/vote-history"
            className={buttonVariants({ variant: "outline" }) + " mt-4"}
          >
            Check Vote History
          </Link>
        </div>
      </div>
    );

  return (
    <div className="space-y-3 mt-5 px-2 sm:px-5 lg:mt-8 xl:px-10 pb-10">
      <div className="rounded-2xl border border-brand-100/30 bg-gradient-to-br from-brand-50 via-white to-orange-50 p-5 shadow-sm">
        <h2 className="text-2xl text-brand-100 lg:text-3xl">Your Ballot Hub</h2>
        <p className="mt-1 text-sm text-slate-600 lg:text-base">
          Review active elections, check your progress, and open a ballot when
          you are ready.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Card className="border-brand-100/30 shadow-none">
            <CardContent className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Active Elections</p>
                <p className="text-2xl font-semibold text-brand-700">
                  {totalElections}
                </p>
              </div>
              <ListChecks className="text-brand-500" size={20} />
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-none">
            <CardContent className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Already Voted</p>
                <p className="text-2xl font-semibold text-green-700">
                  {votedCount}
                </p>
              </div>
              <CheckCircle2 className="text-green-600" size={20} />
            </CardContent>
          </Card>

          <Card className="border-orange-200 shadow-none">
            <CardContent className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Pending Ballots</p>
                <p className="text-2xl font-semibold text-orange-700">
                  {pendingCount}
                </p>
              </div>
              <Clock3 className="text-orange-600" size={20} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 rounded-xl border border-brand-100/30 bg-white/80 px-4 py-3">
          <p className="text-sm font-medium text-brand-700">How voting works</p>
          <p className="text-sm text-slate-600">
            Open any election card, review candidates by position, then submit
            your ballot once. Submitted ballots cannot be changed.
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
          Active Elections
        </span>
        <div className="h-px flex-1 bg-brand-100/40" />
      </div>

      <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
        {visibleElections.map((items, index) => {
          return (
            <ElectionCard
              key={index}
              election={{
                ...items,
                candidateCount: candidateCountByElectionId.get(items.id) ?? 0,
                partylistCount: items._count.partylists,
                hasVoted: votedElectionIdSet.has(items.id),
              }}
              href={`/vote/${items.slug}`}
            />
          );
        })}
      </div>
    </div>
  );
}
