"use server";

import { checkIfAdmin } from "@/features/admin/_action/manage-election";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ReturnType = Promise<{ ok: boolean; message: string }>;

export default async function addPartylist(
  slug: string,
  name: string,
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
        message: `You cant add partylist while election is ${election.status}`,
      };
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return { ok: false, message: "Partylist name is required." };
    }

    await prisma.partylist.create({
      data: {
        name: trimmedName,
        electionId: election.id,
      },
    });

    revalidatePath(`/admin/election/manage/${slug}`);
    return { ok: true, message: "Partylist added successfully" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Failed to add partylist." };
  }
}
