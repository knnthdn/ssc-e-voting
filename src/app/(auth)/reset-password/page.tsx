"use client";

export type ResetPasswordSetState = Dispatch<
  SetStateAction<"onreset" | "check-email" | "success">
>;

import CheckEmail from "@/features/auth/_components/reset-password/CheckEmail";
import NewPasswordFields from "@/features/auth/_components/reset-password/NewPasswordFields";
import ResetPasswordFields from "@/features/auth/_components/reset-password/ResetPasswordFields";
import SuccessResetPassword from "@/features/auth/_components/reset-password/SuccessResetPassword";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export default function ResetPasswordPage() {
  const [state, setState] = useState<"onreset" | "check-email" | "success">(
    "onreset",
  );
  const token = useSearchParams().get("token");

  return (
    <div className="max-w-lg self-center">
      {token && state !== "success" && (
        <NewPasswordFields onSetState={setState} token={token} />
      )}

      {state === "check-email" && <CheckEmail onSetState={setState} />}

      {state === "success" && <SuccessResetPassword />}

      {!token && state === "onreset" && (
        <ResetPasswordFields onSetState={setState} />
      )}
    </div>
  );
}
