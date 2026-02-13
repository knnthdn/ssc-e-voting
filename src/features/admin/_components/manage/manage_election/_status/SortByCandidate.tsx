"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

export type CandidateSortBy = "latest" | "oldest" | "name";

const SORT_OPTIONS: { value: CandidateSortBy; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "name", label: "Name" },
];

export default function SortByCandidate({
  value,
  onChange,
}: {
  value: CandidateSortBy;
  onChange: (value: CandidateSortBy) => void;
}) {
  const [open, setOpen] = useState(false);

  const currentLabel = useMemo(
    () =>
      SORT_OPTIONS.find((option) => option.value === value)?.label ?? "Latest",
    [value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex cursor-pointer items-center space-x-2">
        <span className="text-sm">Sort by:</span>
        <span className="text-sm">{currentLabel}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="z-50 flex w-40 flex-col gap-1 border border-gray-200 p-1"
      >
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              "cursor-pointer px-3 py-1 text-left",
              option.value === value && "text-brand-100",
            )}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
