"use server";

import { checkIfAdmin } from "@/features/admin/_action/manage-election";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ReturnType = Promise<{ ok: boolean; message: string }>;

type Input = {
  slug: string;
  candidateId: string;
  partylistId: string;
};

async function validateEditableElection(slug: string) {
  const election = await prisma.election.findUnique({
    where: { slug },
  });

  if (!election) {
    return { ok: false as const, message: `Election of ${slug} not found!` };
  }

  if (
    election.status === "COMPLETED" ||
    election.status === "ONGOING" ||
    election.status === "STOPPED"
  ) {
    return {
      ok: false as const,
      message: `You cant edit partylist members while election is ${election.status}`,
    };
  }

  return { ok: true as const, election };
}

export async function addMemberToPartylist(data: Input): ReturnType {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    const validation = await validateEditableElection(data.slug);
    if (!validation.ok) return validation;
    const election = validation.election;

    const partylist = await prisma.partylist.findFirst({
      where: {
        id: data.partylistId,
        electionId: election.id,
      },
      select: { id: true },
    });

    if (!partylist) {
      return { ok: false, message: "Partylist not found in this election." };
    }

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: data.candidateId,
        partylistId: null,
        position: {
          is: {
            electionId: election.id,
          },
        },
      },
      select: { id: true },
    });

    if (!candidate) {
      return { ok: false, message: "Candidate is not available for assignment." };
    }

    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { partylistId: data.partylistId },
    });

    revalidatePath(`/admin/election/manage/${data.slug}`);
    return { ok: true, message: "Member added to partylist." };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "internal Server Error" };
  }
}

export async function removeMemberFromPartylist(data: Input): ReturnType {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    const validation = await validateEditableElection(data.slug);
    if (!validation.ok) return validation;
    const election = validation.election;

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: data.candidateId,
        partylistId: data.partylistId,
        position: {
          is: {
            electionId: election.id,
          },
        },
      },
      select: { id: true },
    });

    if (!candidate) {
      return { ok: false, message: "Candidate is not a member of this partylist." };
    }

    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { partylistId: null },
    });

    revalidatePath(`/admin/election/manage/${data.slug}`);
    return { ok: true, message: "Member removed from partylist." };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "internal Server Error" };
  }
}
