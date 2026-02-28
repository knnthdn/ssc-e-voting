"use client";

export type ResetPasswordSetState = Dispatch<
  SetStateAction<"onreset" | "check-email" | "success">
>;

import CheckEmail from "@/features/auth/_components/reset-password/CheckEmail";
import NewPasswordFields from "@/features/auth/_components/reset-password/NewPasswordFields";
import ResetPasswordFields from "@/features/auth/_components/reset-password/ResetPasswordFields";
import SuccessResetPassword from "@/features/auth/_components/reset-password/SuccessResetPassword";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, Suspense, useState } from "react";

function ResetPasswordContent() {
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

function ResetPasswordFallback() {
  return (
    <div className="max-w-lg self-center">
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="h-4 w-72 rounded bg-slate-200" />
        <div className="h-10 w-full rounded bg-slate-200" />
        <div className="h-10 w-full rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
