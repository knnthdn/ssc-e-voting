"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

type PositionOption = {
  id: string;
  name: string;
};

export default function FilterCandidate({
  positions,
  value,
  onChange,
}: {
  positions: PositionOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const POSITION_OPTIONS = useMemo(
    () => [
      { value: "", label: "All" },
      ...positions.map((p) => ({
        value: p.name,
        label: p.name,
      })),
    ],
    [positions],
  );

  const currentLabel =
    POSITION_OPTIONS.find((option) => option.value === value)?.label || "All";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex cursor-pointer items-center space-x-2">
        <span className="text-sm">Position:</span>
        <span className="text-sm">{currentLabel}</span>

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="z-50 flex max-h-96 w-56 flex-col gap-1 overflow-y-auto border border-gray-200 px-0 p-1"
      >
        {POSITION_OPTIONS.map((option) => (
          <button
            key={option.label}
            className={cn(
              "cursor-pointer px-3 py-1 text-start ",
              option.value === value && "text-brand-100",
            )}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
