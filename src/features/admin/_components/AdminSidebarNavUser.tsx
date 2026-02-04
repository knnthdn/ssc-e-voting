"use client";

import { ChevronsUpDown, LogOut, SquareAsterisk } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MyToast } from "@/components/MyToast";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSidebarNavUser() {
  const { data: session, isPending } = authClient.useSession();
  const { isMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
          },
        },
      });
    } catch {
      MyToast.error("Something went wrong while logging out");
    } finally {
      setIsLoggingOut(true);
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full bg-brand-800/50" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-25 bg-brand-800/50" />
          <Skeleton className="h-4 w-37.5 bg-brand-800/50" />
        </div>
      </div>
    );
  }

  if (isLoggingOut) {
    return <LoadingState text="Logging out" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={"/admin.png"} alt="admin image" />
                <AvatarFallback className="rounded-lg">admin</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium ">
                  {session?.user.name}
                </span>
                <span className="truncate text-xs">{session?.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={"/admin.png"} alt="admin image" />
                  <AvatarFallback className="rounded-lg">admin</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SquareAsterisk />
                Change password
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* LOGOUT BUTTON */}
            <Button className="w-full mt-2" onClick={handleLogout}>
              Log out
              <LogOut className="text-white" />
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="w-full h-full flex justify-center items-center gap-2">
      <span>{text}</span>
      <span className="size-5">
        <Icon.loading fill="#1a22e4" />
      </span>
    </div>
  );
}
