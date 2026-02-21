import { getSession } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();

  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get("slug") as string;
  const position = searchParams.get("position") as string;

  if (!slug)
    return Response.json(
      { ok: false, message: "Election slug is required" },
      { status: 400 },
    );

  if (!position)
    return Response.json(
      { ok: false, message: "Position is required" },
      { status: 400 },
    );

  if (!session) {
    return Response.json(
      { ok: false, message: "Authentication Error" },
      { status: 400 },
    );
  }

  try {
    const candidates = await prisma.candidate.findMany({
      where: {
        position: {
          name: position,
          election: {
            slug,
          },
        },
      },

      include: {
        partylist: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        lastName: "asc",
      },
    });

    return Response.json(
      { ok: true, message: "Success", data: candidates },
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
