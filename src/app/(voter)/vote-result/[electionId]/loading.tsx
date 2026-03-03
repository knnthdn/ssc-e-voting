import { Skeleton } from "@/components/ui/skeleton";

function PositionCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`winner-skeleton-${index}`}
            className="rounded-xl border border-amber-100 bg-amber-50 p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`candidate-row-skeleton-${index}`}
            className="grid gap-3 border-b px-4 py-3 last:border-b-0 md:grid-cols-[auto_1fr_auto]"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-5 w-48" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>

            <Skeleton className="ml-auto h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VoteResultByElectionLoading() {
  return (
    <section className="space-y-5 mt-5 px-2 sm:px-5 lg:mt-8 lg:px-10 xl:px-12">
      <div className="rounded-2xl border bg-white p-5">
        <Skeleton className="h-9 w-60" />
        <Skeleton className="mt-2 h-5 w-96 max-w-full" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <PositionCardSkeleton key={`position-card-skeleton-${index}`} />
      ))}
    </section>
  );
}
