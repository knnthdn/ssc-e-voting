import { ReactNode } from "react";
import { getSession } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "@/features/admin/_components/AdminBreadcrumbs";
import { AdminAppSidebar } from "@/features/admin/_components/AdminAppSidebar";

export default async function layout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (session && session.user.role !== "ADMIN") {
    redirect("/vote");
  }

  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-black/30 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          <AdminBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
