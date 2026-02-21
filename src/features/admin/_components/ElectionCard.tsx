import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Election } from "@/features/admin/_types";
import { getEffectiveElectionStatus } from "@/lib/election-status";
import { cn, parseDate } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ElectionCard({
  election,
  href,
}: {
  election: Election;
  href: string;
}) {
  const {
    name,
    start,
    end,
    status,
    description,
    slug,
    candidateCount,
    partylistCount,
    createdAt,
  } = election;
  const effectiveStatus = getEffectiveElectionStatus({
    status,
    start,
    end,
  });

  return (
    <Card
      className={cn(
        "w-full md:h-fit max-w-3xl 2xl:max-w-5xl rounded-2xl shadow-md border p-0 border-t-5 border-t-blue-600",
        effectiveStatus === "ONGOING" && "border-t-orange-600",
        effectiveStatus === "COMPLETED" && "border-t-green-600",
        effectiveStatus === "PENDING" && "border-t-blue-600",
        effectiveStatus === "STOPPED" && "border-t-red-600",
        effectiveStatus === "PAUSED" && "border-t-yellow-600",
        effectiveStatus === "SCHEDULED" && "border-t-purple-600",
      )}
    >
      {/* Top Blue Accent */}

      <CardContent className="p-6 xl:py-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold tracking-wide line-clamp-1 overflow-hidden">
              {name}
            </h2>

            <p className="mt-1 h-10 text-sm text-muted-foreground line-clamp-2 overflow-auto">
              {description}
            </p>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ",
              effectiveStatus === "ONGOING" &&
                "bg-orange-50 text-orange-600 ring-orange-200",
              effectiveStatus === "COMPLETED" &&
                "bg-green-50 text-green-600 ring-green-200",
              effectiveStatus === "PENDING" &&
                "bg-blue-50 text-blue-600 ring-blue-200",
              effectiveStatus === "STOPPED" &&
                "bg-red-50 text-red-600 ring-red-200",
              effectiveStatus === "PAUSED" &&
                "bg-yellow-50 text-yellow-600 ring-yellow-200",
              effectiveStatus === "SCHEDULED" &&
                "bg-purple-50 text-purple-600 ring-purple-200",
            )}
          >
            {effectiveStatus}
          </Badge>
        </div>

        {/* Divider */}
        <div className="my-5 border-t" />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-6 text-sm">
          {/* Left Column */}
          <div className="flex justify-between pr-6">
            <span className="text-muted-foreground">Start date</span>

            {start ? (
              parseDate(new Date(start))
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </div>

          <div className="flex justify-between pl-6 border-l">
            <span className="text-muted-foreground">End date</span>

            {end ? (
              parseDate(new Date(end))
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </div>

          <div className="flex justify-between pr-6">
            <span className="text-muted-foreground">Candidate</span>
            <span>{candidateCount ?? 0}</span>
          </div>

          <div className="flex justify-between pl-6 border-l">
            <span className="text-muted-foreground">Partylist</span>
            <span>{partylistCount ?? 0}</span>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="my-5 border-t" />

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Created {parseDate(new Date(createdAt))}
          </span>

          <Link href={href} className={buttonVariants()}>
            View
            <ChevronRight />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
