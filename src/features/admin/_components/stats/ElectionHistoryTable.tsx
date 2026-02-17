"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginateCandidate from "@/features/admin/_components/manage/manage_election/_candidate/PaginateCandidate";
import SortByElectionStatus from "@/features/admin/_components/stats/SortByElectionStatus";
import { MyToast } from "@/components/MyToast";
import { getEffectiveElectionStatus } from "@/lib/election-status";
import { cn } from "@/lib/utils";
import { History, Wrench } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ElectionRow = {
  id: string;
  name: string;
  status:
    | "ONGOING"
    | "SCHEDULED"
    | "COMPLETED"
    | "PENDING"
    | "STOPPED"
    | "PAUSED";
  start: string | null;
  end: string | null;
  slug: string;
  candidateCount: number;
  partylistCount: number;
};

type ElectionApi = {
  ok: boolean;
  message: string;
  data?: ElectionRow[];
  totalPage?: number;
  totalItems?: number;
  page?: number;
  hasNext?: boolean;
};

const ROW_SKELETON_COUNT = 8;

function formatDateTime(date?: string | null) {
  if (!date) return "--";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

function statusClass(status: ElectionRow["status"]) {
  return cn(
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
    status === "ONGOING" && "bg-orange-50 text-orange-600 ring-orange-200",
    status === "COMPLETED" && "bg-green-50 text-green-600 ring-green-200",
    status === "PENDING" && "bg-blue-50 text-blue-600 ring-blue-200",
    status === "STOPPED" && "bg-red-50 text-red-600 ring-red-200",
    status === "PAUSED" && "bg-yellow-50 text-yellow-600 ring-yellow-200",
    status === "SCHEDULED" && "bg-purple-50 text-purple-600 ring-purple-200",
  );
}

export default function ElectionHistoryTable() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [electionApi, setElectionApi] = useState<ElectionApi>({
    ok: false,
    message: "",
    data: [],
    totalPage: 1,
  });

  const fetchElections = useCallback(async () => {
    setIsFetchingData(true);

    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "8");
      params.set("sortBy", "latest");

      if (selectedStatus) {
        params.set("status", selectedStatus);
      }

      const res = await fetch(`/api/admin/election?${params.toString()}`);
      const json = (await res.json()) as ElectionApi;

      if (!res.ok && res.status !== 404) {
        MyToast.error(json.message || "Failed to fetch election list.");
      }

      setElectionApi({
        ok: Boolean(json.ok),
        message: json.message ?? "",
        data: json.data ?? [],
        totalPage: json.totalPage ?? 1,
        totalItems: json.totalItems,
        page: json.page,
        hasNext: json.hasNext,
      });
    } catch {
      MyToast.error("Something went wrong while fetching elections.");
    } finally {
      setIsFetchingData(false);
    }
  }, [currentPage, selectedStatus]);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  const totalPage =
    electionApi.totalPage && electionApi.totalPage > 0
      ? electionApi.totalPage
      : 1;

  return (
    <>
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-brand-100 flex gap-1 items-center">
          <History size={18} /> Election&apos;s history
        </p>

        <div className="flex items-center gap-4 sm:justify-end">
          <SortByElectionStatus
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
          <PaginateCandidate
            page={currentPage}
            totalPage={totalPage}
            onChange={setCurrentPage}
          />
        </div>
      </div>

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
            {isFetchingData &&
              Array.from({ length: ROW_SKELETON_COUNT }).map((_, index) => (
                <TableRow key={`election-loading-${index}`}>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-9 w-20" />
                  </TableCell>
                </TableRow>
              ))}

            {!isFetchingData &&
              (electionApi.data ?? []).map((election) => {
                const effectiveStatus = getEffectiveElectionStatus({
                  status: election.status,
                  start: election.start,
                  end: election.end,
                });

                return (
                  <TableRow
                    key={election.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="px-4 py-3 font-medium text-slate-900">
                      {election.name}
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <span className={statusClass(effectiveStatus)}>
                        {effectiveStatus.charAt(0) +
                          effectiveStatus.slice(1).toLowerCase()}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-slate-600">
                      {election.candidateCount}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-slate-600">
                      {election.partylistCount}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-slate-600">
                      {formatDateTime(election.start)}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-slate-600">
                      {formatDateTime(election.end)}
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <Button size="sm" asChild>
                        <Link href={`/admin/election/manage/${election.slug}`}>
                          <Wrench />
                          Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

            {!isFetchingData && (electionApi.data ?? []).length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No election records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
