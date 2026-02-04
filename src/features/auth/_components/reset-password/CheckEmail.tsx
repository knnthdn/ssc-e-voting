"use client";

import { type ResetPasswordSetState } from "@/app/(auth)/reset-password/page";
import { Icon } from "@/components/Icon";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type CheckEmailProps = {
  onSetState: ResetPasswordSetState;
};

export default function CheckEmail({ onSetState }: CheckEmailProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium">Check your Email inbox</h2>
        <p className="text-gray-500">
          A password reset link has been sent to the email address associated
          with your account.
        </p>
      </div>

      <div className="mt-10">
        <p className="mb-1 font-medium">Shortcut:</p>
        <div className="grid w-full gap-2 sm:grid-cols-2 2xl:gap-4">
          <Link
            target="_blank"
            href={"https://mail.google.com"}
            className={`${buttonVariants({ variant: "outline" })} w-full py-5`}
          >
            <Icon.gmail />
            Open Gmail
          </Link>

          <Link
            target="_blank"
            href={"https://outlook.live.com/"}
            className={`${buttonVariants({ variant: "outline" })} w-full py-5`}
          >
            <Icon.outlook />
            Open Outlook
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-center">
          Can&apos;t find the email? Check your spam or{" "}
          <button
            className="text-brand-light-100 cursor-pointer underline"
            onClick={() => onSetState("onreset")}
          >
            Request a new one
          </button>
        </p>

        <p className="text-center">
          <Link href={"/signup"} className="text-brand-light-100 underline">
            Sign up
          </Link>{" "}
          or{" "}
          <Link href={"/login"} className="text-brand-light-100 underline">
            Log in
          </Link>{" "}
          instead
        </p>
      </div>
    </div>
  );
}
