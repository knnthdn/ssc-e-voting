"use server";

import { getSession } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkIfAdmin() {
  const session = await getSession();

  return !session || session.user.role !== "ADMIN";
}

export async function startElection(slug: string) {
  if (await checkIfAdmin()) {
    console.log("Unauthorize action!");
    return { ok: false, message: "Unauthorize action!" };
  }

  const election = await prisma.election.findUnique({
    where: {
      slug,
    },
    include: {
      positions: {
        select: {
          id: true,
          _count: {
            select: {
              canditates: true,
            },
          },
        },
      },
    },
  });

  if (!election) {
    return { ok: false, message: "Election not found." };
  }

  const positions = election.positions;

  const hasEmptyPosition = positions.some(
    (position) => position._count.canditates === 0,
  );

  if (positions.length === 0 || hasEmptyPosition) {
    return {
      ok: false,
      message: "All positions must have at least one candidate.",
    };
  }

  await prisma.election.update({
    where: {
      slug: slug,
    },
    data: {
      status: "ONGOING",
      //*  UPDATE DATE WHEN STATUS IS PENDING || SCHEDULED
      ...(election.status === "SCHEDULED" || election.status === "PENDING"
        ? { start: new Date() }
        : {}),
    },
  });

  revalidatePath(`/admin/election/manage/${slug}`);

  return { ok: true, message: "Success" };
}

export type toggleElectionStatus = "PAUSED" | "COMPLETED" | "STOPPED";

export async function toggleElection(
  slug: string,
  status: toggleElectionStatus,
) {
  if (await checkIfAdmin()) {
    console.log("Unauthorize action!");
    return { ok: false, message: "Unauthorize action!" };
  }

  await prisma.election.update({
    where: {
      slug: slug,
    },
    data: {
      status,
    },
  });

  revalidatePath(`/admin/election/manage/${slug}`);

  return { ok: true, message: "Success" };
}
