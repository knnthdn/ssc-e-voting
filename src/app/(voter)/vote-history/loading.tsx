import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function VoteHistoryLoading() {
  return (
    <section className="space-y-5 mt-5 px-2 sm:px-5 lg:mt-8 xl:px-10">
      <div className="rounded-2xl border bg-white p-6 text-center">
        <Skeleton className="mx-auto h-8 w-44" />
        <Skeleton className="mx-auto mt-3 h-4 w-[420px] max-w-full" />
        <Skeleton className="mx-auto mt-2 h-4 w-[360px] max-w-full" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-4 py-3 text-right">
                <Skeleton className="ml-auto h-4 w-14" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={`vote-history-loading-${index}`}>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-5 w-44 max-w-full" />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Skeleton className="ml-auto h-5 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
