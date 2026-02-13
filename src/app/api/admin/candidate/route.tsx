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
  const position = searchParams.get("position")?.trim();

  const p = searchParams.get("page") as string;
  const q = searchParams.get("q")?.trim();

  let page = p ? +p : 1; //* Handle page query

  if (page < 1) page = 1;

  const skip = (page - 1) * pageSize;

  let orderBy: { fullName?: "asc"; createdAt?: "asc" | "desc" } = {
    createdAt: "desc",
  };

  //* SORTBY

  switch (sortBy) {
    case "name":
      orderBy = { fullName: "asc" };
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

    if (!electionId) {
      return Response.json(
        { ok: false, message: "Election ID is required." },
        { status: 400 },
      );
    }

    const where = {
      position: {
        is: {
          electionId,
        },
      },
      ...(position
        ? {
            position: {
              is: {
                electionId,
                name: {
                  equals: position,
                  mode: "insensitive" as const,
                },
              },
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              {
                firstName: {
                  contains: q,
                  mode: "insensitive" as const,
                },
              },
              {
                lastName: {
                  contains: q,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        position: true,
        partylist: true,
      },
      orderBy,
      take: pageSize,
      skip,
    });

    const totalItems = await prisma.candidate.count({ where });

    const totalPage = Math.max(1, Math.ceil(totalItems / pageSize));

    const hasNext: boolean = page !== totalPage;

    return Response.json(
      {
        ok: true,
        message: "Candidate list",
        data: candidates,
        totalPage,
        totalItems,
        page,
        hasNext,
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
