import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

export function SidebarLink({
  href,
  label,
  icon,
  active = false,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 text-base md:text-sm transition-colors",
        active
          ? "bg-brand-light-100 text-white"
          : "text-brand-700 hover:bg-brand-light-800",
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>

      <span className="truncate">{label}</span>
    </Link>
  );
}
