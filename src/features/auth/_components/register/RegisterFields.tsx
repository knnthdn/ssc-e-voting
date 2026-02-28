"use client";

import { MyToast } from "@/components/MyToast";
import { Checkbox } from "@/components/ui/checkbox";
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
  RegisterInput,
  registerSchema,
} from "@/features/auth/_schema/register.schema";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function RegisterFields() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  async function handleRegister(data: RegisterInput) {
    setError(null);
    setIsLoading(true);

    const { email, password } = data;
    const name = email.split("@")[0];

    try {
      await authClient.signUp.email({
        name,
        email,
        password,
        fetchOptions: {
          onError(ctx) {
            setError(ctx.error?.message || "Something went wrong");
            MyToast.error(ctx.error?.message || "Something went wrong");
          },
          onSuccess() {
            router.refresh();
          },
        },
      });
    } catch {
      setError("Unable to Sign up, Please contact support.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleRegister)} className="mt-2">
      <FieldGroup className="space-y-1">
        {/* Email ADDRESS  */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>

                <AuthInput
                  {...field}
                  id="email"
                  placeholder="Please enter your Email address"
                  type="email"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        {/* PASSWORD */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <AuthInput
                  {...field}
                  id="password"
                  placeholder="Please enter your Password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        {/* CONFIRM PASSWORD */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Confirm password</FieldLabel>

                <PasswordInput
                  {...field}
                  id="confirm-password"
                  placeholder="Please Confirm your password"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        {/* TERM And CONDITION */}
        <Controller
          name="acceptTerms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acceptTerms"
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(val)}
                  className="mt-1 cursor-pointer border-gray-500"
                />

                <FieldLabel
                  htmlFor="acceptTerms"
                  className="flex w-full flex-col items-start gap-1 text-left font-normal opacity-80"
                >
                  <span className="font-semibold">Accept Terms</span>

                  <span>
                    I understand and agree that my personal data will be used
                    solely for verification and voting purposes in the Student
                    Supreme Council election.
                  </span>
                </FieldLabel>
              </div>
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} className="mt-0.5" />
              )}
            </Field>
          )}
        />

        {/* SUBMIT BUTTON  */}
        <AuthSubmitButton
          loadingState={isLoading}
          loadingText="Loading"
          text="Register"
        />

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
