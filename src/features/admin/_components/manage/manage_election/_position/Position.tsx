import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Position() {
  return (
    <div>
      <div>
        <h2 className="text-brand-100 text-2xl font-medium">Position</h2>
      </div>

      <div className="mt-3 overflow-x-auto w-fit">
        <Table className="w-full border border-slate-200 ">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Position Name
              </TableHead>

              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Candidate
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody></TableBody>
        </Table>
      </div>
    </div>
  );
}
