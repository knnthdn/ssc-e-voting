"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import VotersLogoutButton from "@/features/voters/_component/VotersLogoutButton";

type NavItem = {
  label: string;
  path: string;
};

type VotersMobileMenuProps = {
  navs: NavItem[];
  isAuthenticated: boolean;
  userName?: string;
  userImage?: string | null;
};

export default function VotersMobileMenu({
  navs,
  isAuthenticated,
  userName,
  userImage,
}: VotersMobileMenuProps) {
  const displayName = userName?.trim() || "Voter";

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="rounded-md p-1.5 text-yellow-500 transition hover:bg-white/10 lg:hidden"
        >
          <Menu />
        </button>
      </DrawerTrigger>

      <DrawerContent className="flex h-[100dvh] flex-col bg-white">
        <DrawerHeader>
          <DrawerTitle className="text-brand-100">Menu</DrawerTitle>
          <DrawerDescription>Navigate voter pages quickly.</DrawerDescription>
        </DrawerHeader>

        {isAuthenticated ? (
          <div className="mb-3 px-4">
            <div className="flex items-center gap-3 rounded-lg border bg-slate-50 px-3 py-3">
              <div className="relative size-9">
                <Image
                  alt="Voter profile"
                  src={userImage || "/male-default-profile.png"}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-slate-800">
                {displayName}
              </p>
            </div>
          </div>
        ) : null}

        <nav className="flex flex-col gap-2 px-4">
          {navs.map((item) => (
            <DrawerClose key={item.path} asChild>
              <Link
                href={item.path}
                className="rounded-md border px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            </DrawerClose>
          ))}

          <DrawerClose asChild>
            <Link
              href={isAuthenticated ? "/vote-history" : "/login"}
              className="rounded-md bg-brand-100 px-3 py-2 text-sm font-medium text-white"
            >
              {isAuthenticated ? "Vote History" : "Login"}
            </Link>
          </DrawerClose>
        </nav>

        {isAuthenticated ? (
          <div className="mt-auto border-t px-4 pb-6 pt-4">
            <VotersLogoutButton />
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
