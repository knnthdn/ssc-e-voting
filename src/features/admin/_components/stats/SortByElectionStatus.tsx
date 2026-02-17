"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "STOPPED", label: "Stopped" },
  { value: "PAUSED", label: "Paused" },
];

export default function SortByElectionStatus({
  value,
  onChange,
}: {
  value: string;
  onChange: (status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const currentLabel =
    STATUS_OPTIONS.find((option) => option.value === value)?.label ?? "All";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer space-x-2 inline-flex items-center">
        <span>Status:</span>
        <span>{currentLabel}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-40 p-1 flex flex-col gap-1 z-50 border border-gray-200 px-0 max-h-96 overflow-y-auto"
      >
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.label}
            className={cn(
              "text-start cursor-pointer px-3 py-1",
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
