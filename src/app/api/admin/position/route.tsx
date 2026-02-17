import { getSession } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const searchParams = req.nextUrl.searchParams;

  const slug = searchParams.get("slug") as string;

  if (!slug)
    return Response.json(
      { ok: false, message: "election slug is required" },
      { status: 400 },
    );

  try {
    //* WILL CHECK IF THERE'S AN SESSION
    if (!session) {
      return Response.json(
        { ok: false, message: "Authentication Error" },
        { status: 400 },
      );
    }

    //* WILL CHECK IF ADMIN
    if (session.user.role !== "ADMIN") {
      return Response.json(
        { ok: false, message: "Unauthorize action!" },
        { status: 403 },
      );
    }

    const position = await prisma.position.findMany({
      where: { election: { slug } },
      include: {
        _count: {
          select: {
            canditates: true,
          },
        },
      },
    });

    const data = position.map((item) => ({
      ...item,
      totalCandidates: item._count.canditates,
    }));

    return Response.json(
      { ok: true, message: "Success", data },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return Response.json(
      { ok: false, message: "Internal Sever Error" },
      { status: 500 },
    );
  }
}
