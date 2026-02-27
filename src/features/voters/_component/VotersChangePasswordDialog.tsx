"use client";

import { MyToast } from "@/components/MyToast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/features/auth/_components/PasswordInput";
import {
  ChangeVotersPasswordInput,
  changeVotersPasswordSchema,
} from "@/features/voters/schema/changePassword.shcema";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquareAsterisk } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function VotersChangePasswordDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<ChangeVotersPasswordInput>({
    resolver: zodResolver(changeVotersPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(data: ChangeVotersPasswordInput) {
    const { oldPassword, newPassword } = data;

    try {
      const { error } = await authClient.changePassword({
        currentPassword: oldPassword,
        newPassword,
      });

      if (error) {
        MyToast.error(error.message || "Unable to change password.");
        return;
      }

      toast(
        <div className="text-base text-green-600">
          Password changed successfully.
        </div>,
      );

      form.reset();
      setOpen(false);
    } catch {
      MyToast.error("Something went wrong while changing password.");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-brand-100 flex gap-1 items-center cursor-pointer"
        >
          <SquareAsterisk size={20} />
          Change Password
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brand-100">Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="oldPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="current-password">
                    Old password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="current-password"
                    placeholder="Enter your old password"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="new-password"
                    placeholder="Enter your new password"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="confirm-password"
                    placeholder="Confirm your new password"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
