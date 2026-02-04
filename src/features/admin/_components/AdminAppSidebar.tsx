import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import Image from "next/image";
import AdminSidebarLinksList from "@/features/admin/_components/AdminSidebarLinkList";
import AdminSidebarNavUser from "@/features/admin/_components/AdminSidebarNavUser";

export async function AdminAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="border-black/30">
      {/* NAVIGATION HEADER  */}
      <SidebarHeader className="bg-brand-100/5 h-16 flex-row  items-center ">
        <div className="relative h-full w-13.75">
          <Image
            src={"/olac-logo-no-bg.png"}
            alt="ShipPing logo"
            fill
            className="absolute "
          />
        </div>

        <h2 className="flex flex-col text-brand-800">
          <span className="text-xs">SSC E-VOTING</span>
          <span className="-mt-1.5 text-lg tracking-wide font-medium">
            Admin Panel
          </span>
        </h2>
      </SidebarHeader>

      {/* NAVIGATION LINKS */}
      <SidebarContent className="bg-brand-100/5   ">
        <AdminSidebarLinksList />
      </SidebarContent>

      {/* MANAGE ADMIN PROFILE AND LOGOUT */}
      <SidebarFooter className="h-16 border-t border-black/20">
        <AdminSidebarNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
