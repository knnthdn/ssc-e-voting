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
  const now = Date.now();
  const startTime = start ? new Date(start).getTime() : null;
  const endTime = end ? new Date(end).getTime() : null;

  if (status === "ONGOING" && endTime !== null && now > endTime) {
    return "COMPLETED";
  }

  if (status !== "SCHEDULED") return status;

  if (endTime !== null && now > endTime) {
    return "COMPLETED";
  }

  if (
    startTime !== null &&
    now >= startTime &&
    (endTime === null || now <= endTime)
  ) {
    return "ONGOING";
  }

  return status;
}
