import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import Link from "next/link";
import EmailActivationRequest from "@/features/auth/_components/verify-user/EmailActivationRequest";
import { getSession, Session } from "@/actions/auth-actions";
import { env } from "@/lib/config";

export default async function EmailActivationPage({
  searchParams,
}: {
  searchParams: Promise<{ v: string }>;
}) {
  const sp = await searchParams;
  const session = await getSession();

  if (session?.user.emailVerified || env.EMAIL_VERIFICATION !== "true")
    redirect("/vote");

  return (
    <>
      {sp.v ? (
        <EmailActivationRequest session={session} />
      ) : (
        <ToConfirm session={session} />
      )}
    </>
  );
}

function ToConfirm({ session }: { session: Session }) {
  return (
    <Card className="w-full max-w-2xl py-10 sm:px-8 sm:py-15">
      <CardHeader>
        <CardTitle className="text-xl">Check your email</CardTitle>
        <CardDescription className="text-base">
          We&apos;ve sent an email to{" "}
          <span className="text-brand-light-100 font-medium">
            {session?.user.email}
          </span>{" "}
          with a link to activate your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
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
      </CardContent>

      <CardFooter>
        <p>
          Can&apos;t find the email? Check your spam or{" "}
          <Link
            href={"/email-activation?v=r"}
            className="text-brand-light-100 underline"
          >
            Resend activation email
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
