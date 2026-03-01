"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CandidateForm from "@/features/admin/_components/manage/manage_election/_candidate/CandidateForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";
import { Search } from "lucide-react";
import CandidateList from "@/features/admin/_components/manage/manage_election/_candidate/CandidateList";
import { useCallback, useEffect, useState } from "react";
import { MyToast } from "@/components/MyToast";
import FilterCandidate from "@/features/admin/_components/manage/manage_election/_candidate/FilterCandidate";
import SortByCandidate, {
  CandidateSortBy,
} from "@/features/admin/_components/manage/manage_election/_status/SortByCandidate";
import PaginateCandidate from "@/features/admin/_components/manage/manage_election/_candidate/PaginateCandidate";

type Partylist = {
  id: string;
  name: string;
  electionId: string;
};

type Position = {
  id: string;
  name: string;
  electionId: string;
};

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  image: string;
  schoolId: string;
  partylistId: string;
  positionId: string;
  partylist?: Partylist;
  position?: Position;
};

type CandidateApiState = {
  ok: boolean;
  message: string;
  data: Candidate[];
  totalPage?: number;
  totalItems?: number;
  page?: number;
  hasNext?: boolean;
};

export default function Candidate({
  election,
}: {
  election: ManageElectionProps;
}) {
  const [candidateApi, setCandidateApi] = useState<CandidateApiState>({
    ok: false,
    message: "",
    data: [],
  });
  const [isFetchingData, setFetchingData] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedSortBy, setSelectedSortBy] =
    useState<CandidateSortBy>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCandidates = useCallback(async () => {
    setFetchingData(true);

    try {
      const params = new URLSearchParams();

      if (selectedPosition) {
        params.set("position", selectedPosition);
      }
      if (selectedSortBy) {
        params.set("sortBy", selectedSortBy);
      }
      if (searchQuery) {
        params.set("q", searchQuery);
      }
      params.set("page", String(currentPage));

      const query = params.toString();

      const res = await fetch(
        `/api/admin/candidate${query ? `?${query}` : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ electionId: election.id }),
        },
      );
      const json = await res.json();
      setCandidateApi({
        ok: Boolean(json?.ok),
        message: json?.message ?? "",
        data: json?.data ?? [],
        totalPage: json?.totalPage,
        totalItems: json?.totalItems,
        page: json?.page,
        hasNext: json?.hasNext,
      });
    } catch (error) {
      console.log(error);
      MyToast.error("Something went wrong.");
    } finally {
      setFetchingData(false);
    }
  }, [election.id, selectedPosition, selectedSortBy, searchQuery, currentPage]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPosition, selectedSortBy]);

  function handleSearch() {
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  }

  return (
    <div>
      <div className="flex flex-col gap-3  xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-brand-100 text-2xl font-medium">Candidate</h2>

        <div className="flex gap-3 justify-between flex-col-reverse md:flex-row ">
          <PaginateCandidate
            page={currentPage}
            totalPage={candidateApi.totalPage || 1}
            onChange={setCurrentPage}
          />
          <FilterCandidate
            positions={election.positions}
            value={selectedPosition}
            onChange={setSelectedPosition}
          />
          <SortByCandidate
            value={selectedSortBy}
            onChange={setSelectedSortBy}
          />

          <form
            className="flex gap-1 flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <Input
              type="search"
              placeholder="Search candidate..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="w-full focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 py-4 focus-visible:ring-1 focus-visible:ring-offset-0 border-brand-light-500"
            />
            <Button
              type="submit"
              size={"icon"}
              aria-label="Search"
              className="bg-brand-100 text-white"
            >
              <Search className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <Table className="w-full border border-slate-200 ">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                First Name
              </TableHead>

              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Last Name
              </TableHead>

              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gender
              </TableHead>

              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Partylist
              </TableHead>

              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Position
              </TableHead>

              <TableHead className="px-4 py-3 text-right whitespace-nowrap w-[1%]">
                <CandidateForm
                  election={election}
                  onCandidateAdded={fetchCandidates}
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <CandidateList
              candidates={candidateApi.data}
              isFetchingData={isFetchingData}
              election={election}
              onCandidateUpdated={fetchCandidates}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
