import Statistic from "@/components/Statistic";
import StatisticLoading from "@/components/StatisticLoading";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Suspense } from "react";

type VoteStatisticPageProps = {
  params: Promise<{ electionId: string }>;
  searchParams: Promise<{
    position?: string;
    voteTime?: string;
  }>;
};

export const revalidate = 0;

export default async function VoteStatisticPage({
  params,
  searchParams,
}: VoteStatisticPageProps) {
  const { electionId } = await params;
  const { position, voteTime } = await searchParams;
  const election = await prisma.election.findUnique({
    where: { slug: electionId },
    select: { status: true },
  });

  if (!election || !["ONGOING", "PAUSED"].includes(election.status)) {
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
            There&apos;s no ongoing election.
          </p>
        </div>
      </div>
    );
  }

  const suspenseKey = `${electionId}:${position ?? "all"}:${voteTime ?? "all"}`;

  return (
    <div className="lg:px-10 xl:px-12">
      <Suspense key={suspenseKey} fallback={<StatisticLoading />}>
        <Statistic
          electionSlug={electionId}
          positionName={position?.trim() || undefined}
          voteTime={voteTime?.trim() || undefined}
          filterAction={`/vote-ranking/${electionId}`}
        />
      </Suspense>
    </div>
  );
}
