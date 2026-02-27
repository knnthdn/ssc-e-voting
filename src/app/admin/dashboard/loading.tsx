import { Skeleton } from "@/components/ui/skeleton";

const STAT_SKELETON_COUNT = 4;
const ROW_SKELETON_COUNT = 8;

export default function AdminDashboardLoading() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-8 p-4">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-44" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: STAT_SKELETON_COUNT }).map((_, index) => (
            <div
              key={`stat-skeleton-${index}`}
              className="rounded-xl border border-black/5 bg-white p-4 shadow-sm"
            >
              <Skeleton className="h-4 w-30" />
              <Skeleton className="mt-2 h-9 w-20" />
              <Skeleton className="mt-6 h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
        <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-30" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-5 gap-3 border-b bg-slate-50 px-4 py-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-26" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-12" />
          </div>

          <div>
            {Array.from({ length: ROW_SKELETON_COUNT }).map((_, index) => (
              <div
                key={`user-row-skeleton-${index}`}
                className="grid grid-cols-5 gap-3 border-b px-4 py-3"
              >
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
