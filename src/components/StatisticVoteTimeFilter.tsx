"use client";

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
  return (
    <form method="get" action={filterAction}>
      <input type="hidden" name="position" value={position} />
      <select
        name="voteTime"
        defaultValue={voteTime}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="bg-transparent text-sm text-slate-600 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
