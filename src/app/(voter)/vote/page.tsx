import ElectionCard from "@/features/admin/_components/ElectionCard";
import ElectionLoading from "@/features/admin/_components/manage/ElectionLoading";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Suspense } from "react";

export const revalidate = 0;

export default function VotersPage() {
  return (
    <Suspense fallback={<ElectionLoading />}>
      <FetchElections />
    </Suspense>
  );
}

async function FetchElections() {
  const activeElection = await prisma.election.findMany({
    where: { status: "ONGOING" },
  });

  if (activeElection.length === 0)
    return (
      <div className="h-full w-full grid place-content-center">
        <div className="flex flex-col justify-center items-center">
          <div className="relative h-37.5 w-75 xl:h-50 xl:w-87.5">
            <Image
              alt="No Election image"
              src={"/no-election.png"}
              fill
              className="absolute object-cover"
            />
          </div>

          <p className="text-lg xl:text-xl">
            There&apos;s no active election yet.
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-3 mt-5 px-2 sm:px-5 lg:mt-8 xl:px-10">
      {/* HEADER */}
      <h2 className="text-2xl text-brand-100 lg:text-3xl">
        Active Election List
      </h2>

      <div className="space-y-8 mx-auto md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 2xl:gap-x-8">
        {activeElection.map((items, index) => {
          return (
            <ElectionCard
              key={index}
              election={items}
              href={`/vote/${items.slug}`}
            />
          );
        })}
      </div>
    </div>
  );
}
