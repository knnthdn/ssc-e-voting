import { getSession } from "@/actions/auth-actions";
import { Skeleton } from "@/components/ui/skeleton";
import AuditLogsPanel from "@/features/admin/_components/settings/AuditLogsPanel";
import UserManagementPanel from "@/features/admin/_components/settings/UserManagementPanel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 0;

type SettingsQuery = Promise<Record<string, string | string[] | undefined>>;

async function assertAdmin() {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

function SettingsPanelFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col pt-4">
      <div className="mb-3 flex items-center justify-end gap-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm p-3">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`settings-panel-skeleton-${index}`} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function SettingsPanelContent({
  activeTab,
  searchParams,
}: {
  activeTab: "users" | "audit-logs";
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (activeTab === "users") return <UserManagementPanel searchParams={searchParams} />;

  return <AuditLogsPanel searchParams={searchParams} />;
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SettingsQuery;
}) {
  await assertAdmin();
  const sp = await searchParams;
  const tabParam = typeof sp.tab === "string" ? sp.tab : "users";
  const activeTab = tabParam === "audit-logs" ? "audit-logs" : "users";

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex w-full rounded-md bg-gray-100 p-1">
        <Link
          href="/admin/settings?tab=users"
          prefetch
          scroll={false}
          className={cn(
            "flex-1 rounded-sm px-3 py-2 text-center text-xs sm:text-sm",
            activeTab === "users"
              ? "bg-brand-light-200 text-white"
              : "text-slate-600 hover:bg-slate-200",
          )}
        >
          User Management
        </Link>
        <Link
          href="/admin/settings?tab=audit-logs"
          prefetch
          scroll={false}
          className={cn(
            "flex-1 rounded-sm px-3 py-2 text-center text-xs sm:text-sm",
            activeTab === "audit-logs"
              ? "bg-brand-light-200 text-white"
              : "text-slate-600 hover:bg-slate-200",
          )}
        >
          Audit Logs
        </Link>
      </div>

      <Suspense key={JSON.stringify(sp)} fallback={<SettingsPanelFallback />}>
        <SettingsPanelContent activeTab={activeTab} searchParams={sp} />
      </Suspense>
    </div>
  );
}
