import { Skeleton } from "@/components/ui/skeleton";

const ROW_SKELETON_COUNT = 6;

export default function AdminSettingsLoading() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="h-10 w-full rounded-md bg-gray-100 p-1">
        <div className="grid h-full grid-cols-2 gap-1">
          <Skeleton className="h-full rounded-sm" />
          <Skeleton className="h-full rounded-sm" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col pt-4">
        <div className="mb-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
          <Skeleton className="h-4 w-14 sm:w-14" />
          <Skeleton className="h-9 w-full sm:w-44" />
          <Skeleton className="h-9 w-full sm:w-64" />
          <Skeleton className="h-9 w-full sm:w-14" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
          <div className="min-h-0 flex-1 overflow-auto p-3 xl:hidden">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`settings-card-skeleton-${index}`}
                  className="space-y-3 rounded-lg border border-slate-200 p-3"
                >
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-5 w-64" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden min-h-0 flex-1 overflow-auto xl:block">
            <div className="grid grid-cols-6 gap-3 border-b bg-slate-50 px-4 py-3">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-22" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {Array.from({ length: ROW_SKELETON_COUNT }).map((_, index) => (
                <div
                  key={`settings-row-skeleton-${index}`}
                  className="grid grid-cols-6 gap-3 border-b px-4 py-3"
                >
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-5 w-22" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
