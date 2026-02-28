"use client";

import { MyToast } from "@/components/MyToast";
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
  LoginInputs,
  loginSchemas,
} from "@/features/auth/_schema/login.schema";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LoginFields() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<LoginInputs>({
    resolver: zodResolver(loginSchemas),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginInputs) {
    setError(null);
    setIsRedirecting(false);
    setIsLoading(true);
    const { email, password } = data;
    let isSuccess = false;

    try {
      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess({ data: { user } }) {
            isSuccess = true;
            setIsRedirecting(true);

            if (!user.emailVerified && env.EMAIL_VERIFICATION === "true") {
              return router.replace("/email-activation?v=r");
            }

            if (user.role === "ADMIN") {
              return router.replace("/admin/dashboard");
            }

            router.replace("/vote");
          },
          onError(ctx) {
            setError(ctx.error.message);
            setIsRedirecting(false);
            MyToast.error(ctx.error.message);
          },
        },
      });
    } catch {
      setError("Unable to Sign in, Please contact support.");
      setIsRedirecting(false);
    }

    if (!isSuccess) {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleLogin)}>
      <FieldGroup className="space-y-1">
        {/* EMAIL  */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email address</FieldLabel>

                <AuthInput
                  disabled={isLoading || isRedirecting}
                  {...field}
                  id="email"
                  placeholder="Please enter your email address"
                  type="email"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        {/* PASSWORD  */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <PasswordInput
                  disabled={isLoading || isRedirecting}
                  {...field}
                  id="password"
                  placeholder="Please enter your password"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        {/* SUBMIT BUTTON  */}
        <AuthSubmitButton
          loadingState={isLoading || isRedirecting}
          loadingText={isRedirecting ? "Redirecting" : "Logging in"}
          text="Login with email"
        />

        {isRedirecting && (
          <p className="text-center text-sm text-slate-500">
            Login successful. Redirecting, please wait...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            <span className="font-semibold">Error: </span>
            {error}
          </p>
        )}
      </FieldGroup>
    </form>
  );
}
