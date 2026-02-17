import { getSession } from "@/actions/auth-actions";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

type SortBy = "name" | "latest" | "oldest";

export async function POST(req: NextRequest) {
  const pageSize = 12;
  const session = await getSession();
  const searchParams = req.nextUrl.searchParams;
  const { electionId } = (await req.json()) as { electionId: string };

  const sortBy = searchParams.get("sortBy") as SortBy;
  const p = searchParams.get("page") as string;

  let page = p ? +p : 1;
  if (page < 1) page = 1;

  const skip = (page - 1) * pageSize;

  let orderBy: { name?: "asc"; createdAt?: "asc" | "desc" } = {
    createdAt: "desc",
  };

  switch (sortBy) {
    case "name":
      orderBy = { name: "asc" };
      break;
    case "latest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

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

    if (!electionId) {
      return Response.json(
        { ok: false, message: "Election ID is required." },
        { status: 400 },
      );
    }

    const partylists = await prisma.partylist.findMany({
      where: { electionId },
      include: {
        _count: {
          select: {
            candidates: true,
          },
        },
      },
      orderBy,
      take: pageSize,
      skip,
    });

    const totalItems = await prisma.partylist.count({
      where: { electionId },
    });
    const unassignedCount = await prisma.candidate.count({
      where: {
        partylistId: null,
        position: {
          is: {
            electionId,
          },
        },
      },
    });
    const totalPage = Math.max(1, Math.ceil(totalItems / pageSize));
    const hasNext = page < totalPage;

    const data = partylists.map((item) => ({
      id: item.id,
      name: item.name,
      electionId: item.electionId,
      createdAt: item.createdAt,
      totalMembers: item._count.candidates,
    }));

    return Response.json(
      {
        ok: true,
        message: "Partylist list",
        data,
        totalPage,
        totalItems,
        page,
        hasNext,
        unassignedCount,
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
