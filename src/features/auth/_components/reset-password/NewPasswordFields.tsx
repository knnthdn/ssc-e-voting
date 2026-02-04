"use client";

import { type ResetPasswordSetState } from "@/app/(auth)/reset-password/page";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AuthInput } from "@/features/auth/_components/AuthInput";
import AuthSubmitButton from "@/features/auth/_components/AuthSubmitButton";
import { PasswordInput } from "@/features/auth/_components/PasswordInput";
import {
  NewPasswordInput,
  newPasswordSchema,
} from "@/features/auth/_schema/newPassword.schema";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type NewPasswordFieldsProps = {
  token: string;
  onSetState: ResetPasswordSetState;
};

export default function NewPasswordFields({
  token,
  onSetState,
}: NewPasswordFieldsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function handleNewPassword(data: NewPasswordInput) {
    setError(null);
    setIsLoading(true);
    const errorText =
      "We are unable to reset your password, Please contact support";

    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (error) {
        setError(error.message ?? errorText);
        return;
      }

      router.replace("/reset-password");
      onSetState("success");
    } catch {
      setError(errorText);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-xl font-medium">New password</h2>

        <p className="opacity-80">
          Enter your new password below to reset your password.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(handleNewPassword)}
        className="space-y-5"
      >
        <FieldGroup className="mt-8 space-y-1">
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <AuthInput
                    {...field}
                    id="password"
                    placeholder="Please enter your password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          {/* CONFIRM PASSWORD  */}
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm password
                  </FieldLabel>

                  <PasswordInput
                    {...field}
                    id="confirm-password"
                    placeholder="Please enter your confirm password"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
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

        <Button
          variant={"outline"}
          type="button"
          onClick={() => router.replace("/reset-password")}
        >
          <ArrowLeft />
          Back
        </Button>
      </form>
    </>
  );
}
