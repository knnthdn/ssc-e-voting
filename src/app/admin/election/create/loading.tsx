export default function Loading() {
  return (
    <div className="p-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="space-y-6">
          <div className="h-10 w-40 rounded bg-slate-200 animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 rounded bg-slate-200 animate-pulse" />
            <div className="h-10 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="h-32 rounded bg-slate-200 animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 rounded bg-slate-200 animate-pulse" />
            <div className="h-10 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="h-56 rounded bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
