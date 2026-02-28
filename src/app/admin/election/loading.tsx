function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-8 w-20 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-3 w-44 animate-pulse rounded bg-slate-200" />
    </div>
  );
}

export default function ElectionLoading() {
  return (
    <section className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`election-row-skeleton-${index}`}
              className="h-10 w-full animate-pulse rounded bg-slate-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
