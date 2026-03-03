import ElectionCard from "@/features/admin/_components/ElectionCard";
import ElectionLoading from "@/features/admin/_components/manage/ElectionLoading";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Suspense } from "react";

export const revalidate = 0;

export default function VoteResultsPage() {
  return (
    <Suspense fallback={<ElectionLoading />}>
      <FetchResultElections />
    </Suspense>
  );
}

async function FetchResultElections() {
  const currentDate = new Date();

  const resultElections = await prisma.election.findMany({
    where: {
      OR: [{ status: "COMPLETED" }, { end: { lte: currentDate } }],
    },
    include: {
      _count: {
        select: {
          partylists: true,
        },
      },
    },
  });

  const resultElectionIds = resultElections.map((election) => election.id);

  const positionCounts =
    resultElectionIds.length === 0
      ? []
      : await prisma.position.findMany({
          where: {
            electionId: {
              in: resultElectionIds,
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
        });

  const candidateCountByElectionId = positionCounts.reduce(
    (acc, position) => {
      acc.set(
        position.electionId,
        (acc.get(position.electionId) ?? 0) + position._count.canditates,
      );
      return acc;
    },
    new Map<string, number>(),
  );

  if (resultElections.length === 0)
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
            There&apos;s no election results yet.
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-3 mt-5 px-2 sm:px-5 lg:mt-8 xl:px-10 pb-5">
      <h2 className="text-2xl text-brand-100 lg:text-3xl">Eelction Results</h2>

      <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
        {resultElections.map((items, index) => (
          <ElectionCard
            key={index}
            election={{
              ...items,
              candidateCount: candidateCountByElectionId.get(items.id) ?? 0,
              partylistCount: items._count.partylists,
              hasVoted: false,
            }}
            href={`/vote-result/${items.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
