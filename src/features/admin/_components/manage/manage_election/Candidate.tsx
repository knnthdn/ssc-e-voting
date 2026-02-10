import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CandidateForm from "@/features/admin/_components/manage/manage_election/CandidateForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";
import { Search } from "lucide-react";

export default function Candidate({
  election,
}: {
  election: ManageElectionProps;
}) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-brand-100 text-2xl font-medium">Candidate</h2>

        <div className="flex w-full items-center gap-1.5 sm:max-w-xs">
          <Input
            type="search"
            placeholder="Search candidate..."
            className="w-full focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 py-4 focus-visible:ring-1 focus-visible:ring-offset-0 border-brand-light-500"
          />
          <Button
            size={"icon"}
            aria-label="Search"
            className="bg-brand-100 text-white"
          >
            <Search className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <Table className="lg:table-fixed w-full">
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

              {/* CANDIDATE FORM */}
              <CandidateForm election={election} />
            </TableRow>
          </TableHeader>

          <TableBody></TableBody>
        </Table>
      </div>
    </div>
  );
}
