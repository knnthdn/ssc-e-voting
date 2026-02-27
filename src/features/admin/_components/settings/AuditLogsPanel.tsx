import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";

type AuditLogItem = {
  id: string;
  at: Date;
  type: string;
  actor: string;
  target: string;
  details: string;
};
type SettingsQuery = Record<string, string | string[] | undefined>;

function getEventBadgeClass(type: AuditLogItem["type"]) {
  const normalized = type.toUpperCase();

  return cn(
    "text-xs",
    normalized.startsWith("VOTE_") && "border-blue-300 bg-blue-50 text-blue-700",
    normalized.startsWith("SESSION_") &&
      "border-purple-300 bg-purple-50 text-purple-700",
    normalized.startsWith("USER_") &&
      "border-amber-300 bg-amber-50 text-amber-700",
    normalized.startsWith("ELECTION_") &&
      "border-emerald-300 bg-emerald-50 text-emerald-700",
  );
}

export default async function AuditLogsPanel({
  searchParams,
}: {
  searchParams: SettingsQuery;
}) {
  const pageSize = 25;
  const pageParam =
    typeof searchParams.auditPage === "string"
      ? Number.parseInt(searchParams.auditPage, 10)
      : 1;
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const safeInputPage = Math.max(1, currentPage);
  const totalLogs = await prisma.auditLog.count();
  const totalPagesForQuery = Math.max(1, Math.ceil(totalLogs / pageSize));
  const pageForQuery = Math.min(safeInputPage, totalPagesForQuery);
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    skip: (pageForQuery - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      createdAt: true,
      action: true,
      actorName: true,
      actorEmail: true,
      targetType: true,
      targetLabel: true,
      details: true,
    },
  });
  const pagedLogs: AuditLogItem[] = rows.map((row) => ({
    id: row.id,
    at: row.createdAt,
    type: row.action,
    actor: row.actorEmail ? `${row.actorName} (${row.actorEmail})` : row.actorName,
    target: row.targetLabel ?? row.targetType,
    details: row.details ?? "No details",
  }));

  const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize));
  const safePage = Math.min(safeInputPage, totalPages);
  const rangeStart = totalLogs === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalLogs);
  const prevPage = Math.max(1, safePage - 1);
  const nextPage = Math.min(totalPages, safePage + 1);
  const prevHref = `/admin/settings?tab=audit-logs&auditPage=${prevPage}`;
  const nextHref = `/admin/settings?tab=audit-logs&auditPage=${nextPage}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        <div className="border-b bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
            Audit Logs
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Recent system activity from users, sessions, votes, and elections.
          </p>
        </div>

        {pagedLogs.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8 text-center text-slate-500">
            No audit logs available.
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3 xl:hidden">
              {pagedLogs.map((log) => (
                <div key={log.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={getEventBadgeClass(log.type)}>
                      {log.type}
                    </Badge>
                    <p className="text-xs text-slate-500">{log.at.toLocaleString()}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Actor:</span>{" "}
                    {log.actor}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Target:</span>{" "}
                    {log.target}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Details:</span>{" "}
                    {log.details}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden min-h-0 flex-1 overflow-auto xl:block">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-4 py-3">Timestamp</TableHead>
                    <TableHead className="px-4 py-3">Event</TableHead>
                    <TableHead className="px-4 py-3">Actor</TableHead>
                    <TableHead className="px-4 py-3">Target</TableHead>
                    <TableHead className="px-4 py-3">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {log.at.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="outline" className={getEventBadgeClass(log.type)}>
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-72 truncate px-4 py-3">
                        {log.actor}
                      </TableCell>
                      <TableCell className="max-w-72 truncate px-4 py-3">
                        {log.target}
                      </TableCell>
                      <TableCell className="max-w-[480px] truncate px-4 py-3 text-slate-700">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t bg-slate-50/60 px-3 py-2 text-sm text-slate-600">
        <p>
          Showing {rangeStart}-{rangeEnd} of {totalLogs}
        </p>
        <div className="flex items-center gap-2">
          {safePage <= 1 ? (
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href={prevHref}>Previous</Link>
            </Button>
          )}
          <span className="text-xs sm:text-sm">
            Page {safePage} of {totalPages}
          </span>
          {safePage >= totalPages ? (
            <Button size="sm" variant="outline" disabled>
              Next
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href={nextHref}>Next</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
