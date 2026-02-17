"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MyToast } from "@/components/MyToast";
import addPartylist from "@/features/admin/_action/add-partylist";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";
import PaginateCandidate from "@/features/admin/_components/manage/manage_election/_candidate/PaginateCandidate";
import PartylistList, {
  PartylistRow,
} from "@/features/admin/_components/manage/manage_election/_partylist/PartylistList";
import SortByPartylist, {
  PartylistSortBy,
} from "@/features/admin/_components/manage/manage_election/_partylist/SortByPartylist";
import { getEffectiveElectionStatus } from "@/lib/election-status";
import { CirclePlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type PartylistApiState = {
  ok: boolean;
  message: string;
  data: PartylistRow[];
  totalPage?: number;
  totalItems?: number;
  page?: number;
  hasNext?: boolean;
  unassignedCount?: number;
};

export default function Partylist({ election }: { election: ManageElectionProps }) {
  const effectiveStatus = getEffectiveElectionStatus({
    status: election.status,
    start: election.start,
    end: election.end,
  });
  const isPartylistLocked =
    effectiveStatus === "ONGOING" ||
    effectiveStatus === "COMPLETED" ||
    effectiveStatus === "STOPPED";
  const [partylistApi, setPartylistApi] = useState<PartylistApiState>({
    ok: false,
    message: "",
    data: [],
  });
  const [isFetchingData, setFetchingData] = useState(false);
  const [selectedSortBy, setSelectedSortBy] =
    useState<PartylistSortBy>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPartylistName, setNewPartylistName] = useState("");
  const [isAddingPartylist, setIsAddingPartylist] = useState(false);

  const fetchPartylists = useCallback(async () => {
    setFetchingData(true);
    try {
      const params = new URLSearchParams();
      params.set("sortBy", selectedSortBy);
      params.set("page", String(currentPage));

      const query = params.toString();
      const res = await fetch(`/api/admin/partylist?${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ electionId: election.id }),
      });

      const json = await res.json();
      setPartylistApi({
        ok: Boolean(json?.ok),
        message: json?.message ?? "",
        data: [
          {
            id: "UNASSIGNED",
            name: "No Partylist",
            totalMembers: json?.unassignedCount ?? 0,
            isSystemRow: true,
          },
          ...(json?.data ?? []),
        ],
        totalPage: json?.totalPage,
        totalItems: json?.totalItems,
        page: json?.page,
        hasNext: json?.hasNext,
        unassignedCount: json?.unassignedCount,
      });
    } catch (error) {
      console.log(error);
      MyToast.error("Something went wrong.");
    } finally {
      setFetchingData(false);
    }
  }, [currentPage, election.id, selectedSortBy]);

  useEffect(() => {
    fetchPartylists();
  }, [fetchPartylists]);

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<{ electionId?: string }>;
      if (!customEvent.detail?.electionId || customEvent.detail.electionId === election.id) {
        fetchPartylists();
      }
    };

    window.addEventListener("election:partylist-refresh", handleRefresh);
    return () =>
      window.removeEventListener("election:partylist-refresh", handleRefresh);
  }, [election.id, fetchPartylists]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSortBy]);

  async function handleAddPartylist() {
    setIsAddingPartylist(true);
    try {
      const res = await addPartylist(election.slug, newPartylistName);
      if (!res.ok) {
        MyToast.error(res.message);
        return;
      }

      setAddDialogOpen(false);
      setNewPartylistName("");
      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      await fetchPartylists();
    } catch {
      MyToast.error("Failed to add partylist.");
    } finally {
      setIsAddingPartylist(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-brand-100 text-2xl font-medium">Partylist</h2>

        <div className="flex gap-3 justify-between flex-col-reverse md:flex-row">
          <PaginateCandidate
            page={currentPage}
            totalPage={partylistApi.totalPage || 1}
            onChange={setCurrentPage}
          />
          <SortByPartylist value={selectedSortBy} onChange={setSelectedSortBy} />
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <Table className="w-full border border-slate-200">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Partylist Name
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Member
              </TableHead>
              <TableHead className="px-4 py-3 text-right whitespace-nowrap w-[1%]">
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-fit"
                      disabled={isPartylistLocked}
                    >
                      Add Partylist
                      <CirclePlus />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-brand-100">
                        Add Partylist
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newPartylistName}
                        onChange={(e) => setNewPartylistName(e.target.value)}
                        placeholder="Partylist name"
                        className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
                        disabled={isAddingPartylist}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setAddDialogOpen(false)}
                          disabled={isAddingPartylist}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddPartylist}
                          disabled={isAddingPartylist || !newPartylistName.trim()}
                        >
                          {isAddingPartylist ? "Adding..." : "Add"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <PartylistList
              partylists={partylistApi.data}
              isFetchingData={isFetchingData}
              election={election}
              onUpdated={fetchPartylists}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
