import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function VerifyUserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col gap-2 px-5 py-2">
      <header className="w-fit py-2 px-4">
        <Link href={"/"} className="w-fit">
          <div className="flex gap-2  w-fit items-center">
            <div className="relative size-[50px] sm:size-[60px] lg:size-[64px]">
              <Image
                alt="olac-logo"
                src={"/olac-logo.png"}
                fill
                className="rounded-full absolute"
              />
            </div>

            <h1 className="text-brand-500 flex flex-col">
              <span className="text-xs -mb-1 sm:text-sm lg:text-lg">
                Our Lady of Assumption College
              </span>
              <span className="text-lg font-medium sm:text-2xl lg:text-3xl">
                SSC E-VOTING SYSTEM
              </span>
            </h1>
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  );
}
