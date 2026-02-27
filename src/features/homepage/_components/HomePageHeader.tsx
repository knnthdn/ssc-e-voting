import { Key } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import headerBg from "@/../public/header-bg.png";
import HomePageMobileMenu from "@/features/homepage/_components/HomePageMobileMenu";

const navs = [
  {
    label: "Vote Rankings",
    path: "/vote-ranking",
  },
  {
    label: "Vote Results",
    path: "/vote-result",
  },
  {
    label: "Docs",
    path: "/docs",
  },
  {
    label: "About",
    path: "#",
  },
];

export default function HomePageHeader() {
  return (
    <div className="relative z-50 w-full h-20 sm:h-25 md:h-30 lg:h-32 border-b-4 border-[#D08700] md:border-none  bg-[linear-gradient(90deg,rgba(25,60,184,1)_8%,#0066ff_73%)] md:bg-none">
      {/* BIG SCREEN  */}
      <Image
        alt="header backround"
        src={headerBg}
        fill
        className="absolute -z-50 hidden md:block"
      />

      <header className="px-3 flex justify-between items-center h-full md:px-10 md:items-start md:py-5 xl:px-15 2xl:px-20 py-3">
        <div className="flex gap-2 items-center">
          <div className="relative size-[50px] sm:size-[60px] lg:size-[64px]">
            <Image
              alt="olac-logo"
              src={"/olac-logo.png"}
              fill
              className="rounded-full absolute"
            />
          </div>

          <h1 className="text-white flex flex-col">
            <span className="text-xs -mb-1 sm:text-sm lg:text-lg">
              Our Lady of Assumption College
            </span>
            <span className="text-lg font-medium sm:text-2xl lg:text-4xl">
              SSC E-VOTING SYSTEM
            </span>
          </h1>
        </div>

        {/* MENU BUTTON (SMALL SCREEN)  */}
        <HomePageMobileMenu navs={navs} />

        {/* NAV BUTTONS (LARGE SCREEN) */}
        <nav className="min-[1200px]:flex gap-5 mt-1 hidden items-center 2xl:gap-6">
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

          <Link
            href={"/login"}
            className="px-5 bg-amber-300 py-1.5 rounded-md tracking-wide flex items-center gap-1"
          >
            Login
            <Key size={15} />
          </Link>
        </nav>
      </header>
    </div>
  );
}
