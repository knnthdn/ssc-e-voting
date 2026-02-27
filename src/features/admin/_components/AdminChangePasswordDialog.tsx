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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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

export default function AdminChangePasswordDialog() {
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

  const isSubmitting = form.formState.isSubmitting;

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
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <SquareAsterisk />
          Change password
        </DropdownMenuItem>
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
                  <FieldLabel htmlFor="admin-current-password">
                    Old password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="admin-current-password"
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
                  <FieldLabel htmlFor="admin-new-password">
                    New password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="admin-new-password"
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
                  <FieldLabel htmlFor="admin-confirm-password">
                    Confirm password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="admin-confirm-password"
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
