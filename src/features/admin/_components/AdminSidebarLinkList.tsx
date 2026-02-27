"use client";
import { SidebarLink } from "@/features/admin/_components/AdminSidebarLink";
import { SidebarAccordionLink } from "@/features/admin/_components/SidebarAccordionLink";

import {
  BookOpen,
  LayoutDashboard,
  Settings,
  TrendingUp,
  VoteIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { JSX } from "react";

export type SidebarLinkItemProps = {
  path: string;
  label: string;
  icon: JSX.Element;
};

const pathPrefix = "/admin/";

export default function AdminSidebarLinksList() {
  const pathname = usePathname();
  const relativePath = pathname.split("/")[2];

  return (
    <div>
      <SidebarLink
        href={pathPrefix + "dashboard"}
        label={"Dashboard"}
        icon={<LayoutDashboard />}
        active={
          pathname === pathPrefix + "dashboard" || relativePath === "dashboard"
        }
      />

      <SidebarAccordionLink
        icon={<VoteIcon />}
        label="Election"
        items={[
          {
            label: "Overview",
            href: "/admin/election/election-overview",
          },
          { label: "Create", href: "/admin/election/create" },
          { label: "Manage", href: "/admin/election/manage" },
        ]}
      />

      <SidebarLink
        href={pathPrefix + "system-status"}
        label={"System Status"}
        icon={<TrendingUp />}
        active={
          pathname === pathPrefix + "system-status" ||
          relativePath === "system-status"
        }
      />

      <SidebarLink
        href={pathPrefix + "docs"}
        label={"Documentation"}
        icon={<BookOpen />}
        active={
          pathname === pathPrefix + "docs" || relativePath === "docs"
        }
      />

      <SidebarLink
        href={pathPrefix + "settings"}
        label={"Settings"}
        icon={<Settings />}
        active={
          pathname === pathPrefix + "settings" || relativePath === "settings"
        }
      />
    </div>
  );
}
