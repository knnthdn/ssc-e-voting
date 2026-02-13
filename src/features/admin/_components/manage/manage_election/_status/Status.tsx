import {
  StartElection,
  ToggleElection,
} from "@/features/admin/_components/manage/manage_election/_status/StartAndToggleElection";
import StatusNote from "@/features/admin/_components/manage/manage_election/_status/StatusNote";
import { Election } from "@/features/admin/_types";
import { cn } from "@/lib/utils";

export default function Status({ election }: { election: Election }) {
  const status =
    election.status === "SCHEDULED" &&
    election.start !== null &&
    election.start &&
    election.start >= election.end
      ? "ONGOING"
      : election.status;

  return (
    <div className="border-b border-gray-300 pb-5">
      <h2 className="text-brand-100 text-2xl font-medium">Election Status</h2>

      <div className="mt-3 space-y-3">
        {/* STATUS */}
        <div className="space-x-2">
          <span>Status:</span>

          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
              status === "ONGOING" &&
                "bg-orange-50 text-orange-600 ring-orange-200",
              status === "COMPLETED" &&
                "bg-green-50 text-green-600 ring-green-200",
              status === "PENDING" && "bg-blue-50 text-blue-600 ring-blue-200",
              status === "STOPPED" && "bg-red-50 text-red-600 ring-red-200",
              status === "PAUSED" &&
                "bg-yellow-50 text-yellow-600 ring-yellow-200",
              status === "SCHEDULED" &&
                "bg-purple-50 text-purple-600 ring-purple-200",
            )}
          >
            {election.status}
          </span>
        </div>

        {/* STATUS NOTE */}
        <StatusNote status={status} />

        {/* START BUTTON  */}
        {(election.status === "PENDING" ||
          election.status === "PAUSED" ||
          election.status === "SCHEDULED") && (
          <StartElection slug={election.slug} />
        )}

        {/* TOGGLE ELECTION */}
        {election.status === "ONGOING" && (
          <ToggleElection slug={election.slug} />
        )}
      </div>
    </div>
  );
}
