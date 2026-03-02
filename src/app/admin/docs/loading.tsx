import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDocsLoading() {
  return (
    <section className="mx-auto mt-5 max-w-7xl px-2 pb-8 sm:px-5 lg:mt-8 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border bg-white p-4 lg:sticky lg:top-4">
          <Skeleton className="h-6 w-28" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={`docs-nav-skeleton-${index}`} className="h-9 w-full" />
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          </div>

          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`docs-section-skeleton-${index}`}
              className="rounded-2xl border bg-white p-6"
            >
              <Skeleton className="h-7 w-64 max-w-full" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[84%]" />
                <Skeleton className="h-4 w-[76%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
