"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function StatisticRefreshButton() {
  const router = useRouter();
  const [isRefreshing, startRefreshTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isRefreshing}
      onClick={() => {
        startRefreshTransition(() => {
          router.refresh();
        });
      }}
    >
      {isRefreshing ? "Refreshing ranking..." : "Refresh Ranking"}
    </Button>
  );
}
