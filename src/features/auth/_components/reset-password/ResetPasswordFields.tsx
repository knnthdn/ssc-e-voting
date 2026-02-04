"use client";

import { type ResetPasswordSetState } from "@/app/(auth)/reset-password/page";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AuthInput } from "@/features/auth/_components/AuthInput";
import AuthSubmitButton from "@/features/auth/_components/AuthSubmitButton";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/features/auth/_schema/resetPassword.schema";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/config";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type ResetPasswordFieldsProps = {
  onSetState: ResetPasswordSetState;
};

export default function ResetPasswordFields({
  onSetState,
}: ResetPasswordFieldsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const invalidToken = useSearchParams().get("error");
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  async function handleResetPassword(data: ResetPasswordInput) {
    if (env.EMAIL_VERIFICATION === "false")
      return setError(
        "Email verification is disabled, Please contact the admin.",
      );

    router.replace("/reset-password");
    setError(null);
    setIsLoading(true);

    const errorText =
      "We are unable to reset your password, Please contact support";

    try {
      const { error } = await authClient.requestPasswordReset({
        ...data,
        redirectTo: "/reset-password",
      });

      if (error) {
        setError(error.message ?? errorText);
        return;
      }

      onSetState("check-email");
    } catch {
      setError(errorText);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-1">
        {invalidToken && (
          <p className="text-red-500">
            Invalid Token! Please request a new one.
          </p>
        )}

        <h2 className="text-xl font-medium">Reset password</h2>

        <p className="opacity-80">
          Enter your email below to receive password reset instructions.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(handleResetPassword)}
        className="space-y-5"
      >
        <FieldGroup className="mt-8 space-y-1">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>

                  <AuthInput
                    {...field}
                    id="email"
                    placeholder="Please enter your email address"
                    type="email"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>

        {/* SUBMIT BUTTON  */}
        <AuthSubmitButton
          loadingState={isLoading}
          loadingText="Resetting password"
          text="Reset your password"
        />

        {error && (
          <p className="text-center text-red-500">
            <span className="font-semibold">Error: </span>
            {error}
          </p>
        )}

        <p className="text-center">
          <Link href={"/register"} className="text-brand-light-100 underline">
            Register
          </Link>{" "}
          or{" "}
          <Link href={"/login"} className="text-brand-light-100 underline">
            Log in
          </Link>{" "}
          instead
        </p>
      </form>
    </>
  );
}
