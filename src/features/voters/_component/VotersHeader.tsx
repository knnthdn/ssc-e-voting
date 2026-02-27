import { getSession } from "@/actions/auth-actions";
import VotersProfile from "@/features/voters/_component/VotersProfile";
import VotersMobileMenu from "@/features/voters/_component/VotersMobileMenu";
import Image from "next/image";
import Link from "next/link";

const navs = [
  {
    label: "Vote",
    path: "/vote",
  },
  {
    label: "Vote Results",
    path: "/vote-result",
  },
  {
    label: "Vote Rankings",
    path: "/vote-ranking",
  },
];

export default async function VotersHeader() {
  const session = await getSession();
  const visibleNavs = session
    ? navs
    : navs.filter((item) => item.path !== "/vote");

  return (
    <div className="relative z-50 w-full h-20 sm:h-25  border-b-4 border-[#D08700] bg-[linear-gradient(90deg,rgba(25,60,184,1)_8%,#0066ff_73%)]">
      <header className="px-3 flex justify-between h-full md:px-10 items-center md:py-5 py-3">
        <Link href={"/"}>
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
        <VotersMobileMenu
          navs={visibleNavs}
          isAuthenticated={Boolean(session)}
        />

        {/* NAV BUTTONS (LARGE SCREEN) */}
        <nav className="lg:flex gap-5 mt-1 hidden items-center 2xl:gap-6">
          {visibleNavs.map((items, index) => {
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

          <VotersProfile />
        </nav>
      </header>
    </div>
  );
}
