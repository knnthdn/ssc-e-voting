import { getSession } from "@/actions/auth-actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (session) {
    if (
      session.user.emailVerified ||
      process.env?.EMAIL_VERIFACATION === "true"
    ) {
      redirect("/vote");
    } else {
      redirect("/email-activation");
    }
  }
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* AUTH FIELDS */}
      <div className="flex flex-col gap-5">
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

        <main className="flex flex-1 px-5 py-2 justify-center">{children}</main>
      </div>

      {/* IMAGE */}
      <div className="relative hidden md:block">
        <Image
          src="/olac-hero.png"
          alt="olac background"
          fill
          priority
          className="object-cover object-right -z-50"
        />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/50 -z-49" />

        <div className="h-full flex flex-col px-5 justify-center gap-2 md:px-10 xl:px-15 2xl:px-20 z-50">
          <h1 className=" text-white flex flex-col ">
            <span className="text-lg font-medium lg:text-xl xl:text-2xl">
              Welcome to the
            </span>
            <span className="uppercase font-semibold text-3xl lg:text-4xl xl:text-5xl">
              Student Supreme
            </span>
            <span className=" uppercase font-semibold text-3xl lg:text-4xl xl:text-5xl">
              Council E-Voting{" "}
            </span>
          </h1>

          <p className="text-white/80 lg:text-lg xl:text-2xl">
            Cast your vote securely online for your SSC elections.
          </p>
        </div>
      </div>
    </div>
  );
}
