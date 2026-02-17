import { getSession } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getSession();
  const { electionId, partylistId } = (await req.json()) as {
    electionId: string;
    partylistId: string;
  };

  try {
    if (!session) {
      return Response.json(
        { ok: false, message: "Authentication Error" },
        { status: 400 },
      );
    }

    if (session.user.role !== "ADMIN") {
      return Response.json(
        { ok: false, message: "Unauthorize action!" },
        { status: 403 },
      );
    }

    if (!electionId || !partylistId) {
      return Response.json(
        { ok: false, message: "Election ID and Partylist ID are required." },
        { status: 400 },
      );
    }

    const partylist = await prisma.partylist.findFirst({
      where: {
        id: partylistId,
        electionId,
      },
      select: { id: true },
    });

    if (!partylist) {
      return Response.json(
        { ok: false, message: "Partylist not found in this election." },
        { status: 404 },
      );
    }

    const [members, unassigned] = await Promise.all([
      prisma.candidate.findMany({
        where: {
          partylistId,
          position: {
            is: {
              electionId,
            },
          },
        },
        select: {
          id: true,
          fullName: true,
        },
        orderBy: {
          fullName: "asc",
        },
      }),
      prisma.candidate.findMany({
        where: {
          partylistId: null,
          position: {
            is: {
              electionId,
            },
          },
        },
        select: {
          id: true,
          fullName: true,
        },
        orderBy: {
          fullName: "asc",
        },
      }),
    ]);

    return Response.json(
      {
        ok: true,
        message: "Partylist members loaded",
        data: {
          members,
          unassigned,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { ok: false, message: "Internal Sever Error" },
      { status: 500 },
    );
  }
}
