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
import Link from "next/link";

type NavItem = {
  label: string;
  path: string;
};

type VotersMobileMenuProps = {
  navs: NavItem[];
  isAuthenticated: boolean;
};

export default function VotersMobileMenu({
  navs,
  isAuthenticated,
}: VotersMobileMenuProps) {
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

      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle className="text-brand-100">Menu</DrawerTitle>
          <DrawerDescription>Navigate voter pages quickly.</DrawerDescription>
        </DrawerHeader>

        <nav className="flex flex-col gap-2 px-4 pb-6">
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
      </DrawerContent>
    </Drawer>
  );
}
