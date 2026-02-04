"use client";
import { SidebarLink } from "@/features/admin/_components/AdminSidebarLink";
import { SidebarAccordionLink } from "@/features/admin/_components/SidebarAccordionLink";

import { LayoutDashboard, Settings, VoteIcon } from "lucide-react";
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
          { label: "Statistic", href: "/admin/election/stats" },
          { label: "Create", href: "/admin/election/create" },
          { label: "Manage", href: "/admin/election/manage" },
        ]}
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
