import { ElectionStatus } from "@/lib/generated/prisma/enums";

export function getEffectiveElectionStatus({
  status,
  start,
  end,
}: {
  status: ElectionStatus;
  start?: Date | string | null;
  end?: Date | string | null;
}): ElectionStatus {
  if (status !== "SCHEDULED") return status;

  const now = Date.now();
  const startTime = start ? new Date(start).getTime() : null;
  const endTime = end ? new Date(end).getTime() : null;

  if (endTime !== null && now > endTime) {
    return "COMPLETED";
  }

  if (startTime !== null && startTime >= now) {
    return "ONGOING";
  }

  return status;
}
