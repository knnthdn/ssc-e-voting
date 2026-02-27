"use server";

import prisma from "@/lib/prisma";

type AuditLogInput = {
  actorId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  targetLabel?: string | null;
  details?: string | null;
};

export async function writeAuditLog(input: AuditLogInput) {
  await prisma.auditLog.create({
    data: {
      id: crypto.randomUUID(),
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? "System",
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      targetLabel: input.targetLabel ?? null,
      details: input.details ?? null,
    },
  });
}
