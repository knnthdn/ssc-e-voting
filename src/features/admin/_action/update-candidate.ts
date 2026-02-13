"use server";

import { checkIfAdmin } from "@/features/admin/_action/manage-election";
import { Candidate } from "@/features/admin/_types";
import { Gender } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ReturnType = Promise<{ ok: boolean; message: string }>;

export default async function updateCandidate(
  candidateId: string,
  data: Candidate,
  slug: string,
): ReturnType {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    const election = await prisma.election.findUnique({
      where: { slug },
    });

    if (!election) {
      return { ok: false, message: `Election of ${slug} not found!` };
    }

    if (
      election.status === "COMPLETED" ||
      election.status === "ONGOING" ||
      election.status === "STOPPED"
    ) {
      return {
        ok: false,
        message: `You cant edit candidate while election is ${election.status}`,
      };
    }

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        position: {
          is: {
            electionId: election.id,
          },
        },
      },
      select: { id: true },
    });

    if (!candidate) {
      return { ok: false, message: "Candidate not found in this election." };
    }

    await prisma.candidate.update({
      where: { id: candidateId },
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
        partylistId: data.partylistId ?? null,
      },
    });

    revalidatePath(`/admin/election/manage/${slug}`);
    return { ok: true, message: "Candidate updated successfully" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "internal Server Error" };
  }
}
