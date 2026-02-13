"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { Candidate } from "@/features/admin/_components/manage/manage_election/_candidate/Candidate";
import EditCandidateForm from "@/features/admin/_components/manage/manage_election/_candidate/EditCandidateForm";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";

export default function CandidateList({
  candidates,
  isFetchingData,
  election,
  onCandidateUpdated,
}: {
  candidates: Candidate[];
  isFetchingData: boolean;
  election: ManageElectionProps;
  onCandidateUpdated?: () => Promise<void> | void;
}) {
  const textCellClass =
    "h-12 align-middle px-4 py-3 text-sm text-slate-700 max-w-[160px] break-words whitespace-normal";

  if (isFetchingData) {
    return (
      <>
        {Array.from({ length: 12 }).map((_, index) => (
          <TableRow key={`candidate-loading-${index}`}>
            <TableCell className={textCellClass}>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className={textCellClass}>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className={textCellClass}>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className={textCellClass}>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell className={textCellClass}>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell className="h-12 align-middle px-4 py-3 text-right">
              <Skeleton className="ml-auto h-9 w-[76px]" />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  }

  if (candidates.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={6}
          className="h-72 px-4 py-4 text-center align-middle text-sm text-slate-500"
        >
          No candidate found.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {candidates.map((candidate) => (
        <TableRow key={candidate.id}>
          <TableCell className={textCellClass}>{candidate.firstName}</TableCell>
          <TableCell className={textCellClass}>{candidate.lastName}</TableCell>
          <TableCell className={textCellClass}>{candidate.gender}</TableCell>
          <TableCell className={textCellClass}>
            {candidate.partylist?.name ?? "-"}
          </TableCell>
          <TableCell className={textCellClass}>
            {candidate.position?.name ?? "-"}
          </TableCell>
          <TableCell className="h-12 align-middle px-4 py-3 text-right">
            <EditCandidateForm
              election={election}
              candidate={candidate}
              onCandidateUpdated={onCandidateUpdated}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
