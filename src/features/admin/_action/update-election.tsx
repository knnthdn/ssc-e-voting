"use server";

import { checkIfAdmin } from "@/features/admin/_action/manage-election";
import { Election } from "@/features/admin/_types";
import { Prisma } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

type EditElectionType = Pick<
  Election,
  "id" | "description" | "end" | "name" | "slug" | "start"
>;

export async function updateElection(data: EditElectionType) {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    const requestedEndDate = new Date(data.end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedEndDate <= today) {
      return {
        ok: false,
        message: "End date must be at least tomorrow.",
      };
    }

    const existingElection = await prisma.election.findUnique({
      where: { id: data.id },
      select: {
        end: true,
      },
    });

    if (!existingElection) {
      return { ok: false, message: "Election not found." };
    }

    const newSlug = slugify(data.name, {
      replacement: "-",
      lower: true,
    });

    const updatedElection = await prisma.election.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        start: data.start,
        end: data.end,
        slug: newSlug,
      },
    });

    revalidatePath(`/admin/election/manage/${data.slug}`);
    if (newSlug !== data.slug) {
      revalidatePath(`/admin/election/manage/${newSlug}`);
    }

    return {
      ok: true,
      message: "Election updated successfully",
      slug: updatedElection.slug,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        message:
          "An election with the same name already exists. Please choose a different election name.",
      };
    }

    console.log(error);
    return {
      ok: false,
      message: "Something went wrong while updating election",
    };
  }
}

export async function deleteElection(id: string) {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    await prisma.election.delete({ where: { id } });

    return {
      ok: true,
      message: "Election Deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Something went wrong while updating election",
    };
  }
}

export async function resetElection(id: string, slug: string) {
  try {
    if (await checkIfAdmin()) {
      return { ok: false, message: "Unauthorized action!" };
    }

    await prisma.$transaction([
      prisma.candidate.deleteMany({
        where: {
          position: {
            electionId: id,
          },
        },
      }),
      prisma.partylist.deleteMany({
        where: {
          electionId: id,
        },
      }),
      prisma.election.update({
        where: { id },
        data: {
          status: "PENDING",
        },
      }),
    ]);

    revalidatePath(`/admin/election/manage/${slug}`);

    return {
      ok: true,
      message: "Election reset successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Something went wrong while resetting election",
    };
  }
}
