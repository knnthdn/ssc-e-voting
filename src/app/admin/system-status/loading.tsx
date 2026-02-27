import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSystemStatusLoading() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-44" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`system-status-skeleton-${index}`}
            className="rounded-xl border border-black/5 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-2">
        <div className="flex min-h-0 flex-col rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <Skeleton className="mb-3 h-5 w-36" />
          <div className="min-h-0 space-y-3 overflow-auto pr-1">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="flex min-h-0 flex-col rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <Skeleton className="mb-3 h-5 w-40" />
          <div className="min-h-0 space-y-2 overflow-auto pr-1">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
