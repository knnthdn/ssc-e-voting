"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import slugify from "slugify";

type Details = {
  name: string;
  description: string;
  status: "PENDING" | "SCHEDULED";
  start: Date;
  end: Date;
};

type Partylist = string[];

const POSITION_NAMES = [
  "PRESIDENT",
  "INTERNAL VICE-PRESIDENT",
  "EXTERNAL VICE-PRESIDENT",
  "SECRETARY",
  "PARLIAMENTARIAN",
  "FINANCE OFFICER",
  "HISTORIAN",
  "REPORTER",
  "BSBA SENATOR",
  "BSCA SENATOR",
  "BSCS SENATOR",
  "BSED SENATOR",
  "BSHM SENATOR",
  "BSCRIM SENATOR",
  "BSBA REPRESENTATIVE",
  "BSCA REPRESENTATIVE",
  "BSCS REPRESENTATIVE",
  "BSED REPRESENTATIVE",
  "BSHM REPRESENTATIVE",
  "BSCRIM REPRESENTATIVE",
];

type ReturnType = Promise<{
  ok: boolean;
  message: string;
  id?: string;
}>;

export async function createElection(
  details: Details,
  partylist: Partylist,
): ReturnType {
  const normalizedDetails = {
    ...details,
    slug: slugify(details.name, {
      replacement: "-",
      lower: true,
    }),
    start: details.status === "PENDING" ? undefined : details.start,
    end: new Date(details.end),
  };

  //* WILL ALWAYS SET END DATE TIME TO 00:00 OR 12:00
  normalizedDetails.end.setHours(0, 0, 0, 0);

  const trimmedPartylists = partylist
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  try {
    if (
      normalizedDetails.status === "SCHEDULED" &&
      normalizedDetails.start?.getDate() === new Date().getDate()
    ) {
      return {
        ok: false,
        message:
          "You cant schedule election to todays date, set it to Pending and manualy start it instead.",
      };
    }

    if (
      normalizedDetails?.start &&
      normalizedDetails.start?.getDate() >= normalizedDetails.end?.getDate()
    ) {
      return {
        ok: false,
        message: "Start date must be greater than end date",
      };
    }

    const res = await prisma.election.create({
      data: {
        ...normalizedDetails,
        positions: {
          createMany: {
            data: POSITION_NAMES.map((name) => ({ name })),
            skipDuplicates: true,
          },
        },
        partylists:
          trimmedPartylists.length > 0
            ? {
                createMany: {
                  data: trimmedPartylists.map((name) => ({ name })),
                  skipDuplicates: true,
                },
              }
            : undefined,
      },
    });

    return {
      ok: true,
      id: res.slug,
      message: "Election created successfully!",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          ok: false,
          message: "Duplicate Election name. Please use a unique name.",
        };
      }
    }
    console.log(error);

    return { ok: false, message: "Failed to create election." };
  }
}
