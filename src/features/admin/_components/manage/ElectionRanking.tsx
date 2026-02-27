import Statistic from "@/components/Statistic";
import StatisticLoading from "@/components/StatisticLoading";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export default function ElectionRanking({
  slug,
  status,
  positionName,
  voteTime,
}: {
  slug: string;
  status: string;
  positionName?: string;
  voteTime?: string;
}) {
  const suspenseKey = `${slug}:${positionName ?? "all"}:${voteTime ?? "all"}`;

  return (
    <div className="space-y-2">
      {status !== "ONGOING" && (
        <div className="space-y-2 px-8 pt-4">
          <p className="text-sm text-slate-600">
            Election is currently <span className="font-medium">{status}</span>.
          </p>

          <div className="space-x-2">
            <span>Status:</span>

            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                status === "ONGOING" &&
                  "bg-orange-50 text-orange-600 ring-orange-200",
                status === "COMPLETED" &&
                  "bg-green-50 text-green-600 ring-green-200",
                status === "PENDING" &&
                  "bg-blue-50 text-blue-600 ring-blue-200",
                status === "STOPPED" && "bg-red-50 text-red-600 ring-red-200",
                status === "PAUSED" &&
                  "bg-yellow-50 text-yellow-600 ring-yellow-200",
                status === "SCHEDULED" &&
                  "bg-purple-50 text-purple-600 ring-purple-200",
              )}
            >
              {status}
            </span>
          </div>
        </div>
      )}

      <Suspense key={suspenseKey} fallback={<StatisticLoading />}>
        <Statistic
          electionSlug={slug}
          positionName={positionName}
          voteTime={voteTime}
          filterAction={`/admin/election/manage/${slug}`}
        />
      </Suspense>
    </div>
  );
}
