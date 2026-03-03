import { buttonVariants } from "@/components/ui/button";
import PaginateSelect from "@/components/PaginateSelect";
import ElectionCard from "@/features/admin/_components/ElectionCard";
import FilterElection from "@/features/admin/_components/manage/FilterElection";
import SortByElection from "@/features/admin/_components/manage/SortByElection";
import { ElectionStatus } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

type SortBy = "name" | "latest" | "oldest";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ManageElectionList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const statusValue =
    typeof searchParams.status === "string"
      ? (searchParams.status as ElectionStatus)
      : undefined;
  const sortByValue =
    typeof searchParams.sortBy === "string"
      ? (searchParams.sortBy as SortBy)
      : undefined;
  const pageParam =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limitParam =
    typeof searchParams.limit === "string" ? Number(searchParams.limit) : 26;

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 26;
  const skip = (page - 1) * limit;

  const filter: { status?: ElectionStatus } = {};
  if (statusValue) {
    filter.status = statusValue;
  }

  let orderBy: { name?: "asc"; createdAt?: "asc" | "desc" } = {
    createdAt: "desc",
  };

  switch (sortByValue) {
    case "name":
      orderBy = { name: "asc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "latest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const [electionCount, elections, totalItems] = await Promise.all([
    prisma.election.count(),
    prisma.election.findMany({
      where: filter,
      orderBy,
      take: limit,
      skip,
    }),
    prisma.election.count({ where: filter }),
  ]);

  if (electionCount === 0)
    return (
      <div className="h-full flex flex-col items-center justify-center gap-1">
        <div className="relative h-37.5 w-75 xl:h-50 xl:w-87.5">
          <Image
            alt="No Election image"
            src={"/no-election.png"}
            fill
            className="absolute object-cover"
          />
        </div>

        <p className="text-lg xl:text-xl">No election found</p>

        <Link
          href={"/admin/election/create"}
          className={buttonVariants({ className: "mt-3" })}
        >
          Create election
          <CirclePlus />
        </Link>
      </div>
    );

  const electionIds = elections.map((item) => item.id);

  const [partylistGroups, positionCounts] =
    electionIds.length === 0
      ? [[], []]
      : await Promise.all([
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

  const totalPage = Math.ceil((totalItems || 0) / limit);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="pb-4 s flex flex-col gap-1 sm:flex-row sm:item-center sm:justify-between">
        <h2 className="text-2xl text-brand-100 lg:text-3xl">Election list</h2>

        <div className="flex flex-wrap gap-5 items-center">
          <FilterElection />
          <SortByElection />

          <Link
            href={"/admin/election/create"}
            className={`${buttonVariants()} w-fit sm:w-auto`}
          >
            Create election
            <CirclePlus />
          </Link>
        </div>
      </div>

      {elections.length === 0 ? (
        <div>No Items</div>
      ) : (
        <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
          {elections.map((items, index) => {
            return (
              <ElectionCard
                key={index}
                election={{
                  ...items,
                  candidateCount: candidateCountByElectionId.get(items.id) ?? 0,
                  partylistCount: partylistCountByElectionId.get(items.id) ?? 0,
                }}
                href={`/admin/election/manage/${items.slug}`}
              />
            );
          })}
        </div>
      )}

      <div>
        {totalPage > 1 && <PaginateSelect totalPage={totalPage} />}
      </div>
    </div>
  );
}
