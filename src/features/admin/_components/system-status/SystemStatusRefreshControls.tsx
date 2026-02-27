"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

export default function SystemStatusRefreshControls({
  checkedAtISO,
}: {
  checkedAtISO: string;
}) {
  const router = useRouter();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => clearInterval(timer);
  }, [autoRefresh, router]);

  const checkedAtLabel = useMemo(() => {
    const date = new Date(checkedAtISO);
    return Number.isNaN(date.getTime()) ? checkedAtISO : date.toLocaleString();
  }, [checkedAtISO]);

  return (
    <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-600 sm:text-sm">Last checked: {checkedAtLabel}</p>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(event) => setAutoRefresh(event.target.checked)}
          />
          Auto refresh (30s)
        </label>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            startTransition(() => {
              router.refresh();
            })
          }
          disabled={isPending}
        >
          {isPending ? "Refreshing..." : "Refresh now"}
        </Button>
      </div>
    </div>
  );
}

