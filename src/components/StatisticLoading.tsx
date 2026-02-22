import { Skeleton } from "@/components/ui/skeleton";

function CandidateRowsSkeleton() {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center gap-4 border-b bg-white p-4 last:border-b-0"
        >
          <div className="flex min-w-[280px] flex-1 items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-52" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <div className="flex min-w-[220px] flex-1 items-center gap-3">
            <Skeleton className="h-4 w-full rounded-full" />
          </div>

          <div className="w-[110px] text-right space-y-2">
            <Skeleton className="ml-auto h-8 w-12" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StatisticLoading() {
  return (
    <section className="space-y-4 p-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-6 w-80" />
      </div>

      <div className="rounded-2xl border bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-10 w-52 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-3xl" />
          </div>
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="rounded-2xl border bg-white p-5 space-y-4">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-6 w-72" />
          <CandidateRowsSkeleton />
        </div>
      ))}
    </section>
  );
}
