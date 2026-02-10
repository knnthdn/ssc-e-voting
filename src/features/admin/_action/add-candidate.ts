"use server";

import { checkIfAdmin } from "@/features/admin/_action/manage-election";
import { Candidate } from "@/features/admin/_types";
import { Gender } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function addCandidate(data: Candidate, slug: string) {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    await prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        gender: data.gender as Gender,
        dateOfBirth: data.dateOfBirth,
        schoolId: data.schoolId,
        image: data.image,
        positionId: data.positionId ?? undefined,
        partylistId: data.partylistId ?? undefined,
      },
    });

    revalidatePath(`/admin/election/manage/${slug}`);

    return { ok: true, message: "Candidate added successfully" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "internal Server Error" };
  }
}
