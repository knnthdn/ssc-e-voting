"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  href: string;
};

interface SidebarAccordionLinkProps {
  icon: React.ReactNode;
  label: string;
  items: Item[];
}

export function SidebarAccordionLink({
  icon,
  label,
  items,
}: SidebarAccordionLinkProps) {
  const pathname = usePathname();

  const hasActiveChild = items.some((item) => pathname.startsWith(item.href));

  const [open, setOpen] = useState(hasActiveChild);

  return (
    <div>
      {/* Parent */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-2 text-base md:text-sm transition-colors cursor-pointer",
          hasActiveChild
            ? " text-brand-light-100"
            : "text-brand-700 hover:bg-brand-light-800",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center">
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Children */}
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-200 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  " flex items-center px-9 py-2 text-sm  transition-colors",
                  active
                    ? "bg-brand-light-100/80 text-white"
                    : "text-brand-700 hover:bg-brand-light-800",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
