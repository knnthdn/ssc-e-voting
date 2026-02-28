import StatsCard from "@/features/admin/_components/stats/StatsCard";
import ElectionHistoryTable from "@/features/admin/_components/stats/ElectionHistoryTable";
import { ChartNoAxesColumn } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 0;

async function StatsOverviewCards() {
  const [totalElections, activeElectionRows, activePartylistCount] =
    await Promise.all([
      prisma.election.count(),
      prisma.election.findMany({
        where: {
          status: "ONGOING",
        },
        select: {
          id: true,
        },
      }),
      prisma.partylist.count({
        where: {
          election: {
            status: "ONGOING",
          },
        },
      }),
    ]);

  const activeElectionIds = activeElectionRows.map((item) => item.id);
  const activeElections = activeElectionIds.length;

  const voteCastRows =
    activeElectionIds.length === 0
      ? []
      : await prisma.vote.findMany({
          where: {
            electionId: {
              in: activeElectionIds,
            },
          },
          select: {
            electionId: true,
            voterId: true,
          },
          distinct: ["electionId", "voterId"],
        });

  const voteCast = voteCastRows.length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <StatsCard
        label="Total Elections"
        value={totalElections}
        info="Total of election's commit in this app"
        accent="bg-brand-100"
      />
      <StatsCard
        label="Active Elections"
        value={activeElections}
        info="Currently active election's"
        accent="bg-green-400"
      />
      <StatsCard
        label="Partylist"
        value={activePartylistCount}
        info="Total partylist of active election's"
        accent="bg-purple-400"
      />
      <StatsCard
        label="Vote Cast"
        value={voteCast}
        info="Total vote's cast in active election's"
        accent="bg-orange-300"
      />
    </div>
  );
}

export default async function StatsPage() {
  return (
    <div className="flex flex-col flex-1 gap-8 p-4 h-full">
      {/* Stats cards */}
      <div>
        <h2 className="text-lg flex text-brand-100 gap-1 mb-3">
          <ChartNoAxesColumn />
          Election Overview
        </h2>
        <StatsOverviewCards />
      </div>

      {/* Election history - take remaining height */}
      <div className="flex-1 flex flex-col ">
        <ElectionHistoryTable />
      </div>
    </div>
  );
}
