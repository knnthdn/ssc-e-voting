import { getSession } from "@/actions/auth-actions";
import { ElectionStatus } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";

import { NextRequest } from "next/server";

type SortBy = "name" | "latest" | "oldest";

type FilterTypes = {
  status?: ElectionStatus;
};

export async function GET(req: NextRequest) {
  const session = await getSession();
  const searchParams = req.nextUrl.searchParams;

  const status = searchParams.get("status") as ElectionStatus;
  const sortBy = searchParams.get("sortBy") as SortBy;
  const p = searchParams.get("page") as string;

  let page = p ? +p : 1; //* Handle page query

  if (page < 1) page = 1;

  const filter: FilterTypes = {};

  const skip = (page - 1) * 26;

  //* FILTER BY STATUS
  if (status) {
    filter.status = status;
  }

  let orderBy: { name?: "asc"; createdAt?: "asc" | "desc" } = {
    createdAt: "desc",
  };

  //* SORTBY

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

    const election = await prisma.election.findMany({
      where: filter,
      orderBy,
      take: 26,
      skip,
    });

    if (election.length === 0)
      return Response.json(
        { ok: false, message: "No election found" },
        { status: 404 },
      );

    const totalItems = await prisma.election.count({
      where: filter,
    });

    const totalPage = Math.ceil((totalItems ? totalItems : 0) / 26);

    const hasNext: boolean = page !== totalPage;

    return Response.json(
      {
        ok: true,
        message: "Election list",
        data: [...election],
        totalPage,
        totalItems,
        page,
        hasNext,
      },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { ok: false, message: "Internal Sever Error" },
      { status: 500 },
    );
  }
}
