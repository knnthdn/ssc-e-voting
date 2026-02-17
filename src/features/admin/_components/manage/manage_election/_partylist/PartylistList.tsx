"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import EditPartylistMembersForm from "@/features/admin/_components/manage/manage_election/_partylist/EditPartylistMembersForm";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";

export type PartylistRow = {
  id: string;
  name: string;
  totalMembers: number;
  isSystemRow?: boolean;
};

export default function PartylistList({
  partylists,
  isFetchingData,
  election,
  onUpdated,
}: {
  partylists: PartylistRow[];
  isFetchingData: boolean;
  election: ManageElectionProps;
  onUpdated?: () => Promise<void> | void;
}) {
  const textCellClass =
    "h-12 align-middle px-4 py-3 text-sm text-slate-700 max-w-[160px] break-words whitespace-normal";

  if (isFetchingData) {
    return (
      <>
        {Array.from({ length: 12 }).map((_, index) => (
          <TableRow key={`partylist-loading-${index}`}>
            <TableCell className={textCellClass}>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className={textCellClass}>
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell className="h-12 align-middle px-4 py-3 text-right">
              <Skeleton className="ml-auto h-9 w-[76px]" />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  }

  if (partylists.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={3}
          className="h-72 px-4 py-4 text-center align-middle text-sm text-slate-500"
        >
          No partylist found.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {partylists.map((partylist) => (
        <TableRow key={partylist.id}>
          <TableCell className={textCellClass}>{partylist.name}</TableCell>
          <TableCell className={textCellClass}>{partylist.totalMembers}</TableCell>
          <TableCell className="h-12 align-middle px-4 py-3 text-right">
            {partylist.isSystemRow ? (
              <span className="text-xs text-slate-400">No action</span>
            ) : (
              <EditPartylistMembersForm
                election={election}
                partylist={partylist}
                onUpdated={onUpdated}
              />
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
