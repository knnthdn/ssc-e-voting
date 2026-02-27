"use client";

import { Button } from "@/components/ui/button";
import { BriefcaseBusiness } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type StatisticPositionFilterProps = {
  filterAction: string;
  electionName: string;
  allPositionNames: string[];
  positionName: string;
  voteTime: string;
};

export default function StatisticPositionFilter({
  filterAction,
  electionName,
  allPositionNames,
  positionName,
  voteTime,
}: StatisticPositionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPosition, setSelectedPosition] = useState(positionName);

  const onApply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    params.set("position", selectedPosition);
    params.set("voteTime", voteTime);

    const query = params.toString();
    router.replace(query ? `${filterAction}?${query}` : filterAction);
  };

  return (
    <form onSubmit={onApply} className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 cursor-pointer">
        <BriefcaseBusiness className="h-4 w-4 " />
        {electionName}
      </div>

      <div className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2">
        <BriefcaseBusiness className="h-4 w-4 text-amber-700" />
        <select
          name="position"
          value={selectedPosition}
          onChange={(event) => setSelectedPosition(event.target.value)}
          className="bg-transparent text-sm font-medium text-amber-900 outline-none cursor-pointer"
        >
          <option value="all">All Positions</option>
          {allPositionNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="rounded-3xl">
        Apply
      </Button>
    </form>
  );
}
