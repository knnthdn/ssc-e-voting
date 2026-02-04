"use client";
import { Session } from "@/actions/auth-actions";
import { Icon } from "@/components/Icon";
import { MyToast } from "@/components/MyToast";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmailActivationRequest({
  session,
}: {
  session: Session;
}) {
  const router = useRouter();
  const [isLoadingReq, setLoadingReq] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login");
        },
      },
    });
  }

  async function handleActivateRequest() {
    setLoadingReq(true);
    setError(null);

    try {
      const res = await fetch(`/api/request-email-activation`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.error) {
        setError(data.message);
        MyToast.error(data.message);
        return;
      }

      router.replace("/email-activation");
    } catch {
      setError("Something went wrong, Please contact support");
    } finally {
      setLoadingReq(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl py-10 sm:px-8 sm:py-15">
      <CardHeader>
        <CardTitle className="text-xl">Almost there</CardTitle>
        <CardDescription className="text-base">
          To complete the signup, click the button below and we&apos;ll send a
          verification email to{" "}
          <span className="text-brand-light-100 font-medium">
            {session?.user.email}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="my-3">
        <CardAction>
          <Button
            className="py-6"
            disabled={isLoadingReq}
            onClick={handleActivateRequest}
          >
            {isLoadingReq ? (
              <>
                Sending Activation Email
                <Icon.loading />
              </>
            ) : (
              "Send Activation Email"
            )}
          </Button>
        </CardAction>

        {error && <p className="mt-2 text-red-500">ERROR: {error}</p>}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2">
        <p>
          <button
            className="text-brand-light-100 cursor-pointer underline"
            onClick={handleLogout}
            disabled={isLoadingReq}
          >
            Log in
          </button>{" "}
          with a different account
        </p>

        <p className="text-sm">
          Having trouble activating your account? Contact{" "}
          <Link
            href={"mailto:support@getpingshipped.com"}
            className="underline"
          >
            support@getpingshipped.com
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
