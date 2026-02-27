import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import SystemStatusRefreshControls from "@/features/admin/_components/system-status/SystemStatusRefreshControls";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Activity, AlertTriangle, Database, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

type HealthStatus = "healthy" | "warning" | "critical";

function statusBadgeClass(status: HealthStatus) {
  return cn(
    "border",
    status === "healthy" && "border-green-300 bg-green-50 text-green-700",
    status === "warning" && "border-amber-300 bg-amber-50 text-amber-700",
    status === "critical" && "border-red-300 bg-red-50 text-red-700",
  );
}

export default async function SystemStatusPage() {
  const now = new Date();
  const checkedAtISO = now.toISOString();
  const soonThreshold = new Date(now.getTime() + 1000 * 60 * 60 * 48);
  let dbConnected = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbConnected = false;
  }

  const [
    activeSessions,
    expiredSessions,
    ongoingElectionsCount,
    electionsEndingSoon,
    ongoingWithNoVotes,
    unverifiedVoterUsers,
    votersWithoutProfileUsers,
    adminWithVoterProfile,
    registeredUsers,
    verifiedUsers,
    totalAuditLogs,
    latestAuditLog,
  ] = dbConnected
    ? await Promise.all([
        prisma.session.count({
          where: { expiresAt: { gt: now } },
        }),
        prisma.session.count({
          where: { expiresAt: { lte: now } },
        }),
        prisma.election.count({
          where: { status: "ONGOING" },
        }),
        prisma.election.count({
          where: { status: "ONGOING", end: { lte: soonThreshold } },
        }),
        prisma.election.count({
          where: { status: "ONGOING", votes: { none: {} } },
        }),
        prisma.user.count({
          where: {
            role: "VOTER",
            emailVerified: false,
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
            role: "ADMIN",
            voter: { isNot: null },
          },
        }),
        prisma.user.count(),
        prisma.user.count({ where: { emailVerified: true } }),
        prisma.auditLog.count(),
        prisma.auditLog.findFirst({
          orderBy: { createdAt: "desc" },
          select: { action: true, createdAt: true },
        }),
      ])
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null];

  const dbStatus: HealthStatus = !dbConnected
    ? "critical"
    : "healthy";
  const authStatus: HealthStatus =
    activeSessions > 0 ? "healthy" : "warning";
  const electionStatus: HealthStatus =
    ongoingWithNoVotes > 0 || electionsEndingSoon > 0 ? "warning" : "healthy";
  const appStatus: HealthStatus = !dbConnected
    ? "critical"
    : electionsEndingSoon > 0 || activeSessions === 0
      ? "warning"
      : "healthy";
  const actionableAlerts: Array<{
    level: "warning" | "critical";
    title: string;
    description: string;
    href: string;
    cta: string;
  }> = [];

  if (unverifiedVoterUsers > 0) {
    actionableAlerts.push({
      level: "warning",
      title: "Unverified voter accounts",
      description: `${unverifiedVoterUsers} voter account(s) are unverified.`,
      href: "/admin/settings?tab=users&filterBy=voter-email-not-verified",
      cta: "Review users",
    });
  }

  if (votersWithoutProfileUsers > 0) {
    actionableAlerts.push({
      level: "critical",
      title: "Missing voter profiles",
      description: `${votersWithoutProfileUsers} voter user(s) have no voter profile record.`,
      href: "/admin/settings?tab=users&filterBy=voter-no-data",
      cta: "Fix voter data",
    });
  }

  if (ongoingWithNoVotes > 0) {
    actionableAlerts.push({
      level: "warning",
      title: "Ongoing elections with no votes",
      description: `${ongoingWithNoVotes} ongoing election(s) currently have zero votes.`,
      href: "/admin/election/manage",
      cta: "Check elections",
    });
  }

  if (electionsEndingSoon > 0) {
    actionableAlerts.push({
      level: "warning",
      title: "Elections ending soon",
      description: `${electionsEndingSoon} ongoing election(s) end within 48 hours.`,
      href: "/admin/election/manage",
      cta: "Open manage",
    });
  }

  const integrityChecks = [
    {
      label: "Voter users without voter profile",
      value: votersWithoutProfileUsers,
      href: "/admin/settings?tab=users&filterBy=voter-no-data",
    },
    {
      label: "Admin users with voter profile",
      value: adminWithVoterProfile,
      href: "/admin/settings?tab=users&filterBy=admin",
    },
    {
      label: "Ongoing elections with no votes",
      value: ongoingWithNoVotes,
      href: "/admin/election/manage",
    },
  ] as const;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4">
      <h2 className="flex items-center gap-2 text-lg text-brand-100">
        <TrendingUp size={20} />
        System Status
      </h2>
      <SystemStatusRefreshControls checkedAtISO={checkedAtISO} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 font-medium text-brand-100">
              <Database size={16} />
              Database
            </p>
            <Badge variant="outline" className={statusBadgeClass(dbStatus)}>
              {dbStatus.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-700">
            Connection: {dbConnected ? "Connected" : "Disconnected"}
          </p>
          <p className="text-sm text-slate-700">
            Ping: {dbConnected ? "OK" : "Unavailable"}
          </p>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 font-medium text-brand-100">
              <ShieldCheck size={16} />
              Authentication
            </p>
            <Badge variant="outline" className={statusBadgeClass(authStatus)}>
              {authStatus.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-700">Active sessions: {activeSessions}</p>
          <p className="text-sm text-slate-700">Expired sessions: {expiredSessions}</p>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 font-medium text-brand-100">
              <Activity size={16} />
              Elections
            </p>
            <Badge variant="outline" className={statusBadgeClass(electionStatus)}>
              {electionStatus.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-700">Ongoing: {ongoingElectionsCount}</p>
          <p className="text-sm text-slate-700">Ending in 48h: {electionsEndingSoon}</p>
          <p className="text-sm text-slate-700">Ongoing with no votes: {ongoingWithNoVotes}</p>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-medium text-brand-100">Application</p>
            <Badge variant="outline" className={statusBadgeClass(appStatus)}>
              {appStatus.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-700">Environment: {process.env.NODE_ENV}</p>
          <p className="text-sm text-slate-700">
            Verified users: {verifiedUsers}/{registeredUsers}
          </p>
          <p className="text-sm text-slate-700">Audit logs: {totalAuditLogs}</p>
          <p className="text-sm text-slate-700">
            Latest activity:{" "}
            {latestAuditLog
              ? `${latestAuditLog.action} (${latestAuditLog.createdAt.toLocaleString()})`
              : "No logs yet"}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-2">
        <div className="flex min-h-0 flex-col rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-medium text-brand-100">
            <AlertTriangle size={16} />
            Actionable Alerts
          </h3>
          {actionableAlerts.length === 0 ? (
            <p className="text-sm text-slate-600">No alerts needing action right now.</p>
          ) : (
            <div className="min-h-0 space-y-3 overflow-auto pr-1">
              {actionableAlerts.map((alert, index) => (
                <div
                  key={`system-alert-${index}`}
                  className={cn(
                    "rounded-md border px-3 py-2",
                    alert.level === "critical"
                      ? "border-red-200 bg-red-50"
                      : "border-amber-200 bg-amber-50",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      alert.level === "critical" ? "text-red-800" : "text-amber-800",
                    )}
                  >
                    {alert.title}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      alert.level === "critical" ? "text-red-700" : "text-amber-700",
                    )}
                  >
                    {alert.description}
                  </p>
                  <Link
                    href={alert.href}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "mt-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
                    )}
                  >
                    {alert.cta}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-col rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-brand-100">Data Integrity Checks</h3>
          <div className="min-h-0 space-y-2 overflow-auto pr-1">
            {integrityChecks.map((check) => {
              const isHealthy = check.value === 0;

              return (
                <div
                  key={check.label}
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{check.label}</p>
                    <p className="text-xs text-slate-500">Count: {check.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={statusBadgeClass(isHealthy ? "healthy" : "warning")}
                    >
                      {isHealthy ? "OK" : "ISSUE"}
                    </Badge>
                    {!isHealthy && (
                      <Link
                        href={check.href}
                        className={cn(
                          buttonVariants({ size: "sm", variant: "outline" }),
                          "border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
                        )}
                      >
                        Open
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
