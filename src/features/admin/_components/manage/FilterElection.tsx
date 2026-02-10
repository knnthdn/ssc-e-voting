"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export default function FilterElection() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentStatus = searchParams.get("status") ?? "";
  const currentLabel =
    STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label || "All";

  function updateStatus(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer space-x-2 inline-flex items-center">
        <span>Status:</span>
        <span>{currentLabel}</span>

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
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
              `text-start cursor-pointer px-3 capitalize py-1,`,
              option.value === currentStatus && "text-brand-100",
            )}
            //  option.value === currentStatus
            onClick={() => updateStatus(option.value)}
          >
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
