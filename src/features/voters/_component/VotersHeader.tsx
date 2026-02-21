import { getSession } from "@/actions/auth-actions";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import VotersLogoutButton from "@/features/voters/_component/VotersLogoutButton";
import prisma from "@/lib/prisma";
import { History, LogOut, Menu, SquareAsterisk } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navs = [
  {
    label: "Docs",
    path: "#",
  },
  {
    label: "History",
    path: "#",
  },
  {
    label: "About",
    path: "#",
  },
];

export default async function VotersHeader() {
  const session = await getSession();
  const voters = await prisma.voter.findUnique({
    where: { voterId: session?.user.id },
  });

  return (
    <div className="relative z-50 w-full h-20 sm:h-25  border-b-4 border-[#D08700] bg-[linear-gradient(90deg,rgba(25,60,184,1)_8%,#0066ff_73%)]">
      <header className="px-3 flex justify-between h-full md:px-10 items-center md:py-5 py-3">
        <Link href={"/vote"}>
          <div className="flex gap-2 items-center">
            <div className="relative size-[50px] sm:size-[60px]">
              <Image
                alt="olac-logo"
                src={"/olac-logo.png"}
                fill
                className="rounded-full absolute"
              />
            </div>

            <h1 className="text-white flex flex-col">
              <span className="text-xs -mb-1 sm:text-sm ">
                Our Lady of Assumption College
              </span>
              <span className="text-lg font-medium sm:text-2xl ">
                SSC E-VOTING SYSTEM
              </span>
            </h1>
          </div>
        </Link>

        {/* MENU BUTTON (SMALL SCREEN)  */}
        <Menu className="text-yellow-500 md:mt-2 lg:hidden " />

        {/* NAV BUTTONS (LARGE SCREEN) */}
        <nav className="lg:flex gap-5 mt-1 hidden items-center 2xl:gap-6">
          {navs.map((items, index) => {
            return (
              <Link
                key={index}
                href={items.path}
                className="text-white hover:underline text-lg"
              >
                {items.label}
              </Link>
            );
          })}

          <span aria-hidden="true" className="bg-white h-6 w-px " />

          {!session || !voters ? (
            <div className="flex gap-1 items-center">
              <Skeleton className="h-6 w-20 bg-white/40" />
              <Skeleton className="size-8 rounded-full bg-white/40" />
            </div>
          ) : (
            <Popover>
              <PopoverTrigger className="cursor-pointer text-white flex items-center gap-2">
                <span className="font-medium">{voters.firstName}</span>

                <div className="relative size-8">
                  <Image
                    alt="Voters Profile"
                    src={
                      (session.user.image ?? voters.gender === "MALE")
                        ? "/male-default-profile.png"
                        : "/female-default-profile.png"
                    }
                    fill
                    className="absolute object-cover"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-fit">
                <PopoverHeader>
                  <PopoverTitle className="font-medium text-base text-brand-800">
                    {voters.firstName} {voters.lastName}
                  </PopoverTitle>
                </PopoverHeader>

                <div className="h-px w-full bg-brand-100/50 my-3" />

                <div className="space-y-2">
                  <Link
                    href={"/"}
                    className="text-brand-100 flex gap-1 items-center"
                  >
                    <History size={20} />
                    Vote history
                  </Link>

                  <button className="text-brand-100 flex gap-1 items-center">
                    <SquareAsterisk size={20} />
                    Change Password
                  </button>

                  <VotersLogoutButton />
                </div>
              </PopoverContent>
            </Popover>
          )}
        </nav>
      </header>
    </div>
  );
}
