import { getSession } from "@/actions/auth-actions";
import ElectionCard from "@/features/admin/_components/ElectionCard";
import ElectionLoading from "@/features/admin/_components/manage/ElectionLoading";
import prisma from "@/lib/prisma";
import Image from "next/image";
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

  const voter = await prisma.voter.findUnique({
    where: { voterId: session.user.id },
    select: { id: true },
  });

  if (!voter) {
    redirect("/");
  }

  const activeElection = await prisma.election.findMany({
    where: { status: "ONGOING" },
    include: {
      _count: {
        select: {
          partylists: true,
        },
      },
    },
  });
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const visibleElections = activeElection.filter(
    (election) => new Date(election.end) >= sevenDaysAgo,
  );

  const electionWithCounts = await Promise.all(
    visibleElections.map(async (election) => {
      const candidateCount = await prisma.candidate.count({
        where: {
          position: {
            electionId: election.id,
          },
        },
      });

      return {
        ...election,
        candidateCount,
        partylistCount: election._count.partylists,
      };
    }),
  );
  const electionCountById = new Map(
    electionWithCounts.map((election) => [
      election.id,
      {
        candidateCount: election.candidateCount,
        partylistCount: election.partylistCount,
      },
    ]),
  );

  const votedElectionIds =
    visibleElections.length === 0
      ? []
      : await prisma.vote.findMany({
          where: {
            voterId: voter.id,
            electionId: {
              in: visibleElections.map((election) => election.id),
            },
          },
          select: { electionId: true },
          distinct: ["electionId"],
        });

  const votedElectionIdSet = new Set(
    votedElectionIds.map((item) => item.electionId),
  );

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
        </div>
      </div>
    );

  return (
    <div className="space-y-3 mt-5 px-2 sm:px-5 lg:mt-8 xl:px-10">
      {/* HEADER */}
      <h2 className="text-2xl text-brand-100 lg:text-3xl">
        Active Election List
      </h2>

      <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
        {visibleElections.map((items, index) => {
          return (
            <ElectionCard
              key={index}
              election={{
                ...items,
                candidateCount:
                  electionCountById.get(items.id)?.candidateCount ?? 0,
                partylistCount:
                  electionCountById.get(items.id)?.partylistCount ?? 0,
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
