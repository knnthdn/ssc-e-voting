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
  const limitParam = searchParams.get("limit");

  let page = p ? +p : 1; //* Handle page query
  let limit = limitParam ? +limitParam : 26;

  if (page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 26;

  const filter: FilterTypes = {};

  const skip = (page - 1) * limit;

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

    const [election, totalItems] = await Promise.all([
      prisma.election.findMany({
        where: filter,
        orderBy,
        take: limit,
        skip,
      }),
      prisma.election.count({
        where: filter,
      }),
    ]);

    if (election.length === 0)
      return Response.json(
        { ok: false, message: "No election found" },
        { status: 404 },
      );

    const totalPage = Math.ceil((totalItems ? totalItems : 0) / limit);

    const hasNext: boolean = page !== totalPage;

    const electionIds = election.map((item) => item.id);

    const [partylistGroups, positionCounts] = await Promise.all([
      prisma.partylist.groupBy({
        by: ["electionId"],
        where: {
          electionId: {
            in: electionIds,
          },
        },
        _count: {
          _all: true,
        },
      }),
      prisma.position.findMany({
        where: {
          electionId: {
            in: electionIds,
          },
        },
        select: {
          electionId: true,
          _count: {
            select: {
              canditates: true,
            },
          },
        },
      }),
    ]);

    const partylistCountByElectionId = new Map(
      partylistGroups.map((group) => [group.electionId, group._count._all]),
    );

    const candidateCountByElectionId = positionCounts.reduce(
      (acc, position) => {
        acc.set(
          position.electionId,
          (acc.get(position.electionId) ?? 0) + position._count.canditates,
        );
        return acc;
      },
      new Map<string, number>(),
    );

    const electionWithCounts = election.map((item) => ({
      ...item,
      candidateCount: candidateCountByElectionId.get(item.id) ?? 0,
      partylistCount: partylistCountByElectionId.get(item.id) ?? 0,
    }));

    return Response.json(
      {
        ok: true,
        message: "Election list",
        data: electionWithCounts,
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
