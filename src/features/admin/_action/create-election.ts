"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

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
  const normalizedDetails: Details = {
    ...details,
    end: new Date(details.end),
  };

  //* WILL ALWAYS SET END DATE TIME TO 00:00 OR 12:00
  normalizedDetails.end.setHours(0, 0, 0, 0);

  const trimmedPartylists = partylist
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  try {
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

    return { ok: true, id: res.id, message: "Election created successfully!" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          ok: false,
          message: "Duplicate Election name. Please use a unique name.",
        };
      }
    }

    return { ok: false, message: "Failed to create election." };
  }
}
