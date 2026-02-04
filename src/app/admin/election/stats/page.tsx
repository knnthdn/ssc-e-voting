import StatsCard from "@/features/admin/_components/stats/StatsCard";
import { ChartNoAxesColumn, History, Wrench } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const elections = [
  {
    id: "election-20252-ssc",
    name: "2025 SSC Election",
    status: "Scheduled",
    candidateCount: 25,
    partylistCount: 10,
    startAt: "March 10, 2025 11:00",
    endAt: "not set yet",
  },
  {
    id: "election-2025-ssc",
    name: "2025 SSC Election",
    status: "Ongoing",
    candidateCount: 25,
    partylistCount: 10,
    startAt: "March 10, 2025 11:00",
    endAt: "March 15, 2025 11:00",
  },
  {
    id: "election-2024-ssc",
    name: "2024 SSC Election",
    status: "Completed",
    candidateCount: 22,
    partylistCount: 8,
    startAt: "March 12, 2024 09:00",
    endAt: "March 17, 2024 17:00",
  },
  {
    id: "election-special-2025",
    name: "Special SSC By-Election",
    status: "Pending",
    candidateCount: 12,
    partylistCount: 5,
    startAt: "April 5, 2025 08:00",
    endAt: "not set ",
  },
  {
    id: "election-2023-ssc",
    name: "2023 SSC Election",
    status: "Completed",
    candidateCount: 20,
    partylistCount: 7,
    startAt: "March 14, 2023 10:00",
    endAt: "March 19, 2023 16:00",
  },
  {
    id: "election-2023s-ssc",
    name: "2023 SSC Election",
    status: "Stopped",
    candidateCount: 32,
    partylistCount: 8,
    startAt: "April 14, 2023 10:00",
    endAt: "April 19, 2023 16:00",
  },
  {
    id: "election-2023s2-ssc",
    name: "2023 SSC Election",
    status: "Paused",
    candidateCount: 52,
    partylistCount: 13,
    startAt: "March 8, 2023 10:00",
    endAt: "April 1, 2023 16:00",
  },
];

export default function StatsPage() {
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
            value={2}
            info="Total of election's commit in this app"
            accent="bg-brand-100"
          />
          <StatsCard
            label="Active Elections"
            value={2}
            info="Currently active election's"
            accent="bg-green-400"
          />
          <StatsCard
            label="Partylist"
            value={2}
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
        <p className=" px-4 py-3 text-sm font-medium text-brand-100 flex gap-1 items-center">
          <History size={18} /> Election&apos;s history
        </p>

        {/* <div className="flex-1  text-slate-400 min-h-[500px] border border-black/15 rounded-xl shadow"> */}
        <div className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm flex-1">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Election Name
                </TableHead>

                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </TableHead>

                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Candidate
                </TableHead>

                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Partylist
                </TableHead>

                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Start
                </TableHead>

                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  End
                </TableHead>

                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {elections.map((election) => (
                <TableRow
                  key={election.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <TableCell className="px-4 py-3 font-medium text-slate-900">
                    {election.name}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                        election.status === "Ongoing" &&
                          "bg-orange-50 text-orange-600 ring-orange-200",
                        election.status === "Completed" &&
                          "bg-green-50 text-green-600 ring-green-200",
                        election.status === "Pending" &&
                          "bg-blue-50 text-blue-600 ring-blue-200",
                        election.status === "Stopped" &&
                          "bg-red-50 text-red-600 ring-red-200",
                        election.status === "Paused" &&
                          "bg-yellow-50 text-yellow-600 ring-yellow-200",
                        election.status === "Scheduled" &&
                          "bg-purple-50 text-purple-600 ring-purple-200",
                      )}
                    >
                      {election.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-600">
                    {election.candidateCount}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-600">
                    {election.partylistCount}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-600">
                    {election.startAt}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-600">
                    {election.endAt}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Button size="sm">
                      <Wrench />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
