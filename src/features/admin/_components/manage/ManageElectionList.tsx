import { buttonVariants } from "@/components/ui/button";
import PaginateSelect from "@/components/PaginateSelect";
import ElectionCard from "@/features/admin/_components/ElectionCard";
import FilterElection from "@/features/admin/_components/manage/FilterElection";
import SortByElection from "@/features/admin/_components/manage/SortByElection";
import { ElectionApi } from "@/features/admin/_types";
import { ElectionStatus } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SortBy = "name" | "latest" | "oldest";

const ELECTION_LIST_REVALIDATE_SECONDS = 1800;
const ELECTION_LIST_TAG = "admin-election-list";

const getCachedManageElectionData = unstable_cache(
  async (
    status: ElectionStatus | undefined,
    sortBy: SortBy | undefined,
    page: number,
    limit: number,
  ) => {
    const filter: { status?: ElectionStatus } = {};
    if (status) {
      filter.status = status;
    }

    const orderBy: { name?: "asc"; createdAt?: "asc" | "desc" } =
      sortBy === "name"
        ? { name: "asc" }
        : sortBy === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" };

    const electionCount = await prisma.election.count();

    if (electionCount === 0) {
      return {
        electionCount,
        data: {
          ok: true,
          message: "No election found",
          data: [],
          totalPage: 0,
          totalItems: 0,
          page: 1,
          hasNext: false,
        } satisfies ElectionApi,
      };
    }

    const skip = (page - 1) * limit;

    const election = await prisma.election.findMany({
      where: filter,
      orderBy,
      take: limit,
      skip,
    });

    if (election.length === 0) {
      const totalItems = await prisma.election.count({ where: filter });
      const totalPage = Math.ceil((totalItems || 0) / limit);

      return {
        electionCount,
        data: {
          ok: false,
          message: "No election found",
          data: [],
          totalPage,
          totalItems,
          page,
          hasNext: page < totalPage,
        } satisfies ElectionApi,
      };
    }

    const totalItems = await prisma.election.count({ where: filter });
    const totalPage = Math.ceil((totalItems || 0) / limit);
    const hasNext = page < totalPage;

    const electionWithCounts = await Promise.all(
      election.map(async (item) => {
        const [candidateCount, partylistCount] = await Promise.all([
          prisma.candidate.count({
            where: {
              position: {
                is: {
                  electionId: item.id,
                },
              },
            },
          }),
          prisma.partylist.count({
            where: {
              electionId: item.id,
            },
          }),
        ]);

        return {
          ...item,
          candidateCount,
          partylistCount,
        };
      }),
    );

    return {
      electionCount,
      data: {
        ok: true,
        message: "Election list",
        data: electionWithCounts,
        totalPage,
        totalItems,
        page,
        hasNext,
      } satisfies ElectionApi,
    };
  },
  ["manage-election-list"],
  {
    revalidate: ELECTION_LIST_REVALIDATE_SECONDS,
    tags: [ELECTION_LIST_TAG],
  },
);

export default async function ManageElectionList({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const status = searchParams.status as ElectionStatus | undefined;
  const sortBy = searchParams.sortBy as SortBy | undefined;
  const rawPage = Number(searchParams.page ?? "1");
  const rawLimit = Number(searchParams.limit ?? "26");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 26;

  const { electionCount, data } = await getCachedManageElectionData(
    status,
    sortBy,
    page,
    limit,
  );

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

  return (
    <div className="space-y-5">
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

      {!data.data || data.data.length === 0 ? (
        <div>No Items</div>
      ) : (
        <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
          {data.data.map((items, index) => {
            return (
              <ElectionCard
                key={index}
                election={items}
                href={`/admin/election/manage/${items.slug}`}
              />
            );
          })}
        </div>
      )}

      <div>
        {"totalPage" in data && data.totalPage! > 1 && (
          <PaginateSelect totalPage={data.totalPage!} />
        )}
      </div>
    </div>
  );
}
