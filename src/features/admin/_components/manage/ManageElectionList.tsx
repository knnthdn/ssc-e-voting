import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ElectionCard from "@/features/admin/_components/ElectionCard";
import { cookies } from "next/headers";
import { ElectionApi } from "@/features/admin/_types";
import FilterElection from "@/features/admin/_components/manage/FilterElection";
import SortByElection from "@/features/admin/_components/manage/SortByElection";
import PaginateSelect from "@/components/PaginateSelect";

export const revalidate = 0;

export default async function ManageElectionList({ url }: { url: string }) {
  const cookieStore = await cookies();
  const electionCount = await prisma.election.count();

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

  const res = await fetch(url, {
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  const data: ElectionApi = await res.json();

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

      {!data.data ? (
        <div>No Items</div>
      ) : (
        <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
          {data.data.map((items, index) => {
            return <ElectionCard key={index} election={items} />;
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
