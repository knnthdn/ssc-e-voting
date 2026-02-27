"use client";

import { useRouter, useSearchParams } from "next/navigation";

type VoteTimeFilter = "all" | "15m" | "1h" | "6h" | "24h" | "7d";

type VoteTimeOption = {
  value: VoteTimeFilter;
  label: string;
};

type StatisticVoteTimeFilterProps = {
  filterAction: string;
  voteTime: VoteTimeFilter;
  position: string;
  options: VoteTimeOption[];
};

export default function StatisticVoteTimeFilter({
  filterAction,
  voteTime,
  position,
  options,
}: StatisticVoteTimeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (nextVoteTime: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("position", position);
    params.set("voteTime", nextVoteTime);

    const query = params.toString();
    router.replace(query ? `${filterAction}?${query}` : filterAction);
  };

  return (
    <select
      name="voteTime"
      value={voteTime}
      onChange={(event) => onChange(event.target.value)}
      className="bg-transparent text-sm text-slate-600 outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
