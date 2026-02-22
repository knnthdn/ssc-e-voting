"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import VotersLoading from "@/features/voters/_component/VotersLoading";

type CandidateTypes = {
  fullName: string;
  bio: string;
  image: string;
  partylist: {
    name: string;
  } | null;
};

type CandidateResponse = {
  data?: CandidateTypes[];
};

export default function VotersCard({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const [candidates, setCandidates] = useState<CandidateTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCandidates() {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/admin/voter/candidates?slug=${slug}&position=${name}`,
          {
            signal: controller.signal,
          },
        );

        const payload: CandidateResponse = await response.json();
        setCandidates(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setCandidates([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchCandidates();

    return () => {
      controller.abort();
    };
  }, [name, slug]);

  if (isLoading) return <VotersLoading />;

  return (
    <div className="space-y-3 mb-5">
      <h2 className="text-brand-500 text-2xl">
        <span className="text-3xl text-orange-600">|</span> {name}
      </h2>

      <div className={cn("grid lg:grid-cols-2 gap-5 xl:grid-cols-3 2xl:gap-8")}>
        {candidates.map((item: CandidateTypes, i: number) => {
          return (
            <div
              className={cn(
                "shadow-2xl w-full flex hover:shadow-xl min-h-50 max-[400px]:flex-col max-[400px]:min-h-0",
              )}
              key={i}
            >
              {/* CANDIDATE PROFILE */}
              <div className="relative h-full w-[180px] shrink-0 max-[400px]:h-60 max-[400px]:w-full">
                <Image
                  //   src={
                  //     item.image ? `/${item.image}` : "/portrait_placeholder.png"
                  //   }
                  src={"/portrait_placeholder.png"}
                  alt={`${item.fullName} profile`}
                  fill
                  className="absolute object-cover"
                />
              </div>

              <div className="py-2 w-full px-3 max-[400px]:pb-4">
                <span className="text-xl text-brand-500">{item.fullName}</span>

                <p className="line-clamp-4 max-h-[100px] min-h-[100px] overflow-auto max-[400px]:min-h-0">
                  {item.bio}
                </p>

                <div className="h-px w-full bg-brand-100/20 my-2" />

                <p className="flex gap-1 mt-3 items-center">
                  <span className="inline-block size-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-brand-500" />
                  <span className="font-semibold text-brand-800">Party:</span>
                  <span className="font-medium text-brand-500 uppercase">
                    {item.partylist ? item.partylist.name : "INDEPENDENT"}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
