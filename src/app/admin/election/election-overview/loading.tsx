function CardSkeleton() {
  return (
    <div className="rounded-xl min-h-37.5 lg:min-h-45 xl:min-h-50 2xl:min-h-0 2xl:aspect-video bg-slate-100 animate-pulse ring-1 ring-black/5" />
  );
}

export default function Loading() {
  return (
    <section className="flex flex-col flex-1 gap-8 p-4 h-full">
      <div>
        <div className="mb-3 h-7 w-56 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`election-overview-row-skeleton-${index}`}
              className="h-10 w-full animate-pulse rounded bg-slate-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
