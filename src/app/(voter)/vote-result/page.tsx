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

  const electionWithCounts = await Promise.all(
    resultElections.map(async (election) => {
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
    <div className="space-y-3 mt-5 px-2 sm:px-5 lg:mt-8 xl:px-10">
      <h2 className="text-2xl text-brand-100 lg:text-3xl">Eelction Results</h2>

      <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
        {resultElections.map((items, index) => (
          <ElectionCard
            key={index}
            election={{
              ...items,
              candidateCount:
                electionCountById.get(items.id)?.candidateCount ?? 0,
              partylistCount:
                electionCountById.get(items.id)?.partylistCount ?? 0,
              hasVoted: false,
            }}
            href={`/vote-result/${items.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
