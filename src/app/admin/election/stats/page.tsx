import StatsCard from "@/features/admin/_components/stats/StatsCard";
import ElectionHistoryTable from "@/features/admin/_components/stats/ElectionHistoryTable";
import { ChartNoAxesColumn } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export default async function StatsPage() {
  const [totalElections, activeElections, activePartylistCount] =
    await Promise.all([
      prisma.election.count(),
      prisma.election.count({
        where: {
          status: "ONGOING",
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

  return (
    <div className="flex flex-col flex-1 gap-8 p-4 h-full">
      {/* Stats cards */}
      <div>
        <h2 className="text-lg flex text-brand-100 gap-1 mb-3">
          <ChartNoAxesColumn />
          Statistics
        </h2>
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
            value={50}
            info="Total vote's cast in active election's"
            accent="bg-orange-300"
          />
        </div>
      </div>

      {/* Election history - take remaining height */}
      <div className="flex-1 flex flex-col ">
        <ElectionHistoryTable />
      </div>
    </div>
  );
}
