import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cookies } from "next/headers";

export const revalidate = 0;

type Position = {
  id: string;
  name: string;
  totalCandidates: number;
};

export default async function Position({ slug }: { slug: string }) {
  const cookieStore = await cookies();
  //   const position = await getPositions(slug);

  const res = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/admin/position?slug=${slug}`,
    {
      headers: { cookie: cookieStore.toString() },
    },
  );

  const position = await res.json();
  const positions: Position[] = position.data ?? [];
  const midpoint = Math.ceil(positions.length / 2);
  const firstGroup = positions.slice(0, midpoint);
  const secondGroup = positions.slice(midpoint);

  return (
    <div>
      <div>
        <h2 className="text-brand-100 text-2xl font-medium">Position</h2>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {[firstGroup, secondGroup].map((group, groupIndex) => (
          <div key={groupIndex} className="overflow-x-auto">
            <Table className="w-full border border-slate-200">
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

              <TableBody>
                {group.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-14 align-middle px-4 py-3 text-sm text-slate-500"
                    >
                      No more positions
                    </TableCell>
                  </TableRow>
                ) : (
                  group.map((items) => (
                    <TableRow
                      key={items.id}
                      className="odd:bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                    >
                      <TableCell className="h-12 align-middle px-4 py-3 text-sm text-slate-700 max-w-[160px] break-words whitespace-normal">
                        {items.name}
                      </TableCell>
                      <TableCell className="h-12 align-middle px-4 py-3 text-sm text-slate-700 max-w-[160px] break-words whitespace-normal">
                        {items.totalCandidates}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
