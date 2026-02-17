"use server";

import { checkIfAdmin } from "@/features/admin/_action/manage-election";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ReturnType = Promise<{ ok: boolean; message: string }>;

export default async function deletePartylist(
  slug: string,
  partylistId: string,
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
        message: `You cant delete partylist while election is ${election.status}`,
      };
    }

    const partylist = await prisma.partylist.findFirst({
      where: {
        id: partylistId,
        electionId: election.id,
      },
      select: { id: true },
    });

    if (!partylist) {
      return { ok: false, message: "Partylist not found in this election." };
    }

    await prisma.partylist.delete({
      where: { id: partylistId },
    });

    revalidatePath(`/admin/election/manage/${slug}`);
    return { ok: true, message: "Partylist deleted successfully" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Failed to delete partylist." };
  }
}
