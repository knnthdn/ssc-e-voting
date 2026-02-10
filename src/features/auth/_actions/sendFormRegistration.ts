"use server";

import { getSession } from "@/actions/auth-actions";
import { FormRegistrationInput } from "@/features/auth/_schema/formRegistration.schema";
import { Gender } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";

export async function sendFormRegistration(
  data: FormRegistrationInput,
): Promise<{ ok: boolean; message: string }> {
  const session = await getSession();

  if (!session) return { ok: false, message: "Not Authorized!" };

  const gender = data.gender.toUpperCase() as Gender;

  try {
    await prisma.voter.create({
      data: {
        ...data,
        gender,
        voterId: session.user.id,
      },
    });

    return { ok: true, message: "Form submitted successfully!" };
  } catch (e) {
    console.log(e);
    return { ok: false, message: "Internal Server Error" };
  }
}
