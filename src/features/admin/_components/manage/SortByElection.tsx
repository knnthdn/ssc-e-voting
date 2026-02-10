"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SortBy = "name" | "latest" | "oldest";

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "name", label: "Name (A-Z)" },
];

export default function SortByElection() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSort = (searchParams.get("sortBy") ?? "latest") as SortBy;
  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label ?? "Latest";

  function updateSort(value: SortBy) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer space-x-2 inline-flex items-center">
        <span>Sort:</span>
        <span>{currentLabel}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-40 p-1 flex flex-col gap-1 z-50 border border-gray-200 px-0"
      >
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`text-start cursor-pointer px-3 py-1 ${
              option.value === currentSort ? "font-semibold" : ""
            }`}
            onClick={() => updateSort(option.value)}
          >
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
