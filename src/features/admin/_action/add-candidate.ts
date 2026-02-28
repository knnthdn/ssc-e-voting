"use server";

import { getSession } from "@/actions/auth-actions";
import { checkIfAdmin } from "@/features/admin/_action/manage-election";
import { writeAuditLog } from "@/features/admin/_action/write-audit-log";
import { Candidate } from "@/features/admin/_types";
import { Gender } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ReturnType = Promise<{ ok: boolean; message: string }>;

export default async function addCandidate(
  data: Candidate,
  slug: string,
): ReturnType {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    const session = await getSession();

    const election = await prisma.election.findUnique({
      where: { slug },
    });

    if (!election) {
      return { ok: false, message: `Election of ${slug} not found!` };
    }

    if (
      election?.status === "COMPLETED" ||
      election?.status === "ONGOING" ||
      election?.status === "STOPPED"
    ) {
      return {
        ok: false,
        message: `You cant add candidate while election is ${election.status}`,
      };
    }

    if (election.status === "SCHEDULED") {
      if (!election.start) {
        return {
          ok: false,
          message: "Election start date is not set",
        };
      }

      const isStillValid = new Date() >= election.start;

      if (!isStillValid)
        return {
          ok: false,
          message:
            "Scheduled election is already started. Paused to add candidate.",
        };
    }

    const createdCandidate = await prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        bio: data.bio,
        gender: data.gender as Gender,
        dateOfBirth: data.dateOfBirth,
        schoolId: data.schoolId,
        image: data.image,
        positionId: data.positionId,
        partylistId: data.partylistId ?? undefined,
      },
      select: {
        id: true,
        fullName: true,
        schoolId: true,
        position: {
          select: {
            name: true,
          },
        },
        partylist: {
          select: {
            name: true,
          },
        },
      },
    });

    if (session?.user.role === "ADMIN") {
      try {
        await writeAuditLog({
          actorId: session.user.id,
          actorName: session.user.name,
          actorEmail: session.user.email,
          action: "CANDIDATE_ADDED",
          targetType: "CANDIDATE",
          targetId: createdCandidate.id,
          targetLabel: createdCandidate.fullName,
          details: `Added candidate in election ${election.name} (${slug}), position ${createdCandidate.position.name}, partylist ${createdCandidate.partylist?.name ?? "INDEPENDENT"}, school ID ${createdCandidate.schoolId}`,
        });
      } catch (auditError) {
        console.error("Failed to write audit log for candidate creation:", auditError);
      }
    }

    revalidatePath(`/admin/election/manage/${slug}`);

    return { ok: true, message: "Candidate added successfully" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "internal Server Error" };
  }
}
