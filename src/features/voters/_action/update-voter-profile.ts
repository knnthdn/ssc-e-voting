"use server";

import { getSession } from "@/actions/auth-actions";
import { FormRegistrationInput } from "@/features/auth/_schema/formRegistration.schema";
import { Gender } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";

export async function updateVoterProfile(
  data: FormRegistrationInput,
  imageUrl?: string,
): Promise<{ ok: boolean; message: string }> {
  const session = await getSession();

  if (!session) {
    return { ok: false, message: "Not Authorized!" };
  }

  try {
    const existingVoter = await prisma.voter.findUnique({
      where: { voterId: session.user.id },
      select: { schoolId: true },
    });

    if (!existingVoter) {
      return { ok: false, message: "Voter profile not found." };
    }

    const gender = data.gender.toUpperCase() as Gender;

    await prisma.voter.update({
      where: { voterId: session.user.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender,
        address: data.address,
        phoneNumber: data.phoneNumber,
        schoolId: existingVoter.schoolId,
      },
    });

    if (imageUrl) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: imageUrl },
      });
    }

    return { ok: true, message: "Profile updated successfully." };
  } catch {
    return { ok: false, message: "Internal Server Error" };
  }
}
