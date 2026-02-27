import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatsCard from "@/features/admin/_components/stats/StatsCard";
import { cn } from "@/lib/utils";
import { Activity, AlertTriangle, LayoutDashboard } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const pageParam = typeof sp.page === "string" ? sp.page : "1";
  const currentPage = Math.max(1, Number.parseInt(pageParam, 10) || 1);
  const pageSize = 12;
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + 1000 * 60 * 60 * 48);

  const [
    registeredUsers,
    verifiedEmailUsers,
    votersCount,
    activeSessionCount,
    voterNoProfileCount,
    unverifiedVoterUsersCount,
    ongoingElections,
    recentActivity,
    turnoutRows,
  ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          emailVerified: true,
        },
      }),
      prisma.voter.count(),
      prisma.session.count({
        where: {
          expiresAt: {
            gt: now,
          },
        },
      }),
      prisma.user.count({
        where: {
          role: "VOTER",
          voter: { is: null },
        },
      }),
      prisma.user.count({
        where: {
          role: "VOTER",
          emailVerified: false,
        },
      }),
      prisma.election.findMany({
        where: {
          status: "ONGOING",
        },
        select: {
          id: true,
          name: true,
          end: true,
        },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          action: true,
          actorName: true,
          actorEmail: true,
          targetType: true,
          targetLabel: true,
          details: true,
          createdAt: true,
        },
      }),
      prisma.$queryRaw<Array<{ electionId: string; uniqueVoters: number }>>`
        SELECT
          "electionId",
          COUNT(DISTINCT "voterId")::int AS "uniqueVoters"
        FROM "vote"
        GROUP BY "electionId"
      `,
    ]);

  const turnoutMap = new Map(
    turnoutRows.map((row) => [row.electionId, Number(row.uniqueVoters ?? 0)]),
  );
  const alerts: Array<{ level: "high" | "medium"; title: string; description: string }> = [];

  if (unverifiedVoterUsersCount > 0) {
    alerts.push({
      level: "high",
      title: "Unverified voter accounts",
      description: `${unverifiedVoterUsersCount} voter account(s) have unverified email.`,
    });
  }

  if (voterNoProfileCount > 0) {
    alerts.push({
      level: "medium",
      title: "Voter profile mismatch",
      description: `${voterNoProfileCount} voter user(s) have no voter profile data.`,
    });
  }

  for (const election of ongoingElections) {
    const uniqueVoters = turnoutMap.get(election.id) ?? 0;
    const turnoutPct = votersCount > 0 ? Math.round((uniqueVoters / votersCount) * 100) : 0;
    const endsSoon = election.end <= soonThreshold;
    const lowTurnout = turnoutPct < 30;
    const riskyEndingSoon = endsSoon && turnoutPct < 60;

    if (lowTurnout || riskyEndingSoon) {
      alerts.push({
        level: lowTurnout ? "high" : "medium",
        title: `Turnout risk: ${election.name}`,
        description: `${turnoutPct}% turnout (${uniqueVoters}/${votersCount})${endsSoon ? ", election ends within 48 hours." : "."}`,
      });
    }
  }

  const totalUsers = registeredUsers;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const skip = (safePage - 1) * pageSize;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      voter: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: pageSize,
  });

  function pageHref(page: number) {
    return `/admin/dashboard?page=${page}`;
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-8 p-4">
      <div>
        <h2 className="mb-3 flex items-center gap-1 text-lg text-brand-100">
          <LayoutDashboard size={20} />
          Dashboard Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatsCard
            label="Registered Users"
            value={registeredUsers}
            info="Total users currently registered"
            accent="bg-brand-100"
          />
          <StatsCard
            label="Verified Emails"
            value={verifiedEmailUsers}
            info="Users with verified email addresses"
            accent="bg-cyan-500"
          />
          <StatsCard
            label="Voters"
            value={votersCount}
            info="Users with voter profile records"
            accent="bg-green-500"
          />
          <StatsCard
            label="Active Sessions"
            value={activeSessionCount}
            info="Unexpired user sessions"
            accent="bg-orange-400"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-medium text-brand-100">
            <AlertTriangle size={18} />
            At-Risk Alerts
          </h3>
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-600">No risk alerts right now.</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 6).map((alert, index) => (
                <div
                  key={`risk-alert-${index}`}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm",
                    alert.level === "high"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-amber-200 bg-amber-50 text-amber-800",
                  )}
                >
                  <p className="font-medium">{alert.title}</p>
                  <p>{alert.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-col rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-medium text-brand-100">
              <Activity size={18} />
              Recent Activity
            </h3>
            <Link
              href="/admin/settings?tab=audit-logs"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-600">No activity logs yet.</p>
          ) : (
            <div className="min-h-0 max-h-96 space-y-2 overflow-auto pr-1">
              {recentActivity.map((log) => (
                <div key={log.id} className="rounded-md border border-slate-200 px-3 py-2">
                  <p className="text-sm font-medium text-slate-800">
                    {log.action}
                  </p>
                  <p className="text-xs text-slate-600">
                    {log.actorEmail
                      ? `${log.actorName} (${log.actorEmail})`
                      : log.actorName}{" "}
                    • {log.targetLabel ?? log.targetType}
                  </p>
                  {log.details && (
                    <p className="text-xs text-slate-500">{log.details}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {log.createdAt.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h3 className="font-medium text-brand-100">All Users</h3>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {users.length === 0 ? (
            <div className="grid h-full place-content-center px-4 py-8">
              <p className="text-center text-slate-500">No users found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-4 py-3">Fullname</TableHead>
                  <TableHead className="px-4 py-3">Email</TableHead>
                  <TableHead className="px-4 py-3">Email Verified</TableHead>
                  <TableHead className="px-4 py-3">Role</TableHead>
                  <TableHead className="px-4 py-3">Voters</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const hasVoterData = Boolean(user.voter);

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="px-4 py-3 font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-slate-700">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            user.emailVerified
                              ? "border-green-300 bg-green-50 text-green-700"
                              : "border-red-300 bg-red-50 text-red-700"
                          }
                        >
                          {String(user.emailVerified)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            user.role === "ADMIN"
                              ? "border-purple-300 bg-purple-50 text-purple-700"
                              : "border-blue-300 bg-blue-50 text-blue-700"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            hasVoterData
                              ? "border-green-300 bg-green-50 text-green-700"
                              : "border-slate-300 bg-slate-50 text-slate-700"
                          }
                        >
                          {String(hasVoterData)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-slate-600">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={pageHref(Math.max(1, safePage - 1))}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                safePage <= 1 && "pointer-events-none opacity-50",
              )}
            >
              Previous
            </Link>
            <Link
              href={pageHref(Math.min(totalPages, safePage + 1))}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                safePage >= totalPages && "pointer-events-none opacity-50",
              )}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
