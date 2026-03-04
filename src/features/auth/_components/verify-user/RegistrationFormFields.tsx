"use client";
import { Icon } from "@/components/Icon";
import LoadingOverlay from "@/components/LoadingOverlay";
import { MyToast } from "@/components/MyToast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { sendFormRegistration } from "@/features/auth/_actions/sendFormRegistration";
import { AuthInput } from "@/features/auth/_components/AuthInput";
import {
  formRegisterSchema,
  FormRegistrationInput,
} from "@/features/auth/_schema/formRegistration.schema";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function RegisterFormField() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRedirecting, startRedirectTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/vote");
  }, [router]);

  const form = useForm<FormRegistrationInput>({
    resolver: zodResolver(formRegisterSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      dateOfBirth: new Date(),
      gender: "",
      phoneNumber: "",
      schoolId: "",
    },
  });

  async function handleLogout() {
    setError(null);
    setIsLoggingOut(true);

    const errMsg =
      "Something went wrong while logging out, Please contact the admins.";

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
          },
        },
      });
    } catch {
      MyToast.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function handleSubmitForm(data: FormRegistrationInput) {
    setError(null);
    setIsSubmitting(true);
    const errMsg =
      "Something went wrong while submitting form, Please contact the admins.";

    try {
      const res = await sendFormRegistration(data);

      if (!res.ok) {
        setError(res.message);
        return;
      }

      startRedirectTransition(() => {
        router.replace("/vote");
        router.refresh();
      });

      //* Fallback for intermittent client-navigation stalls:
      //* if we are still on register-form shortly after success,
      //* force a full navigation to keep UX deterministic.
      setTimeout(() => {
        if (window.location.pathname.startsWith("/register-form")) {
          window.location.replace("/vote");
        }
      }, 900);
    } catch {
      MyToast.error(errMsg);
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoggingOut} text="Logging out..." />
      <LoadingOverlay
        isLoading={isSubmitting || isRedirecting}
        text={isRedirecting ? "Redirecting..." : "Submitting form..."}
      />
      <Card className="max-w-150 w-full py-10 sm:px-8 sm:py-15">
        <CardHeader>
          {error && <p className="text-red-500 text-lg">ERROR: {error}</p>}

          <CardTitle>Register Form</CardTitle>
          <CardDescription>
            Please fill up the form to completly register your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            id="register-form"
          >
            <FieldGroup className="space-y-1">
              {/* FIRSTNAME */}
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstname">Firstname</FieldLabel>

                      <AuthInput
                        disabled={isSubmitting || isRedirecting}
                        {...field}
                        id="firstname"
                        placeholder="Please enter your First name"
                        type="text"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* LASTNAME */}
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastname">Lastname</FieldLabel>

                      <AuthInput
                        disabled={isSubmitting}
                        {...field}
                        id="lastname"
                        placeholder="Please enter your Last name"
                        type="text"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <FieldGroup className="flex flex-row">
                {/* Gender */}
                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="gender">Gender</FieldLabel>

                        <NativeSelect
                          disabled={isSubmitting || isRedirecting}
                          className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0 "
                          id="gender"
                          {...field}
                        >
                          <NativeSelectOption
                            value={""}
                            disabled
                            className="text-muted-foreground"
                          >
                            Please select your gender
                          </NativeSelectOption>
                          <NativeSelectOption value={"male"}>
                            Male
                          </NativeSelectOption>
                          <NativeSelectOption value={"female"}>
                            Female
                          </NativeSelectOption>
                        </NativeSelect>

                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* DATEOFBIRTH */}
                <Controller
                  name="dateOfBirth"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="date">Date of birth</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger
                            disabled={isSubmitting || isRedirecting}
                            asChild
                            className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0   "
                          >
                            <Button
                              variant="outline"
                              id="date"
                              className="justify-start font-normal "
                            >
                              {date ? date.toLocaleDateString() : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              {...field}
                              mode="single"
                              selected={date}
                              defaultMonth={date}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                                field.onChange(date);
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              {/* ADDRESS */}
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="address">Address</FieldLabel>

                      <AuthInput
                        disabled={isSubmitting || isRedirecting}
                        {...field}
                        id="address"
                        placeholder="Please enter your Address"
                        type="text"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* PHONE NUMBER  */}
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phoneNumber">
                        Phone number
                      </FieldLabel>

                      <AuthInput
                        disabled={isSubmitting || isRedirecting}
                        {...field}
                        id="phoneNumber"
                        placeholder="Please enter your Phone number"
                        type="text"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="schoolId"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="school-id">School ID</FieldLabel>

                      <AuthInput
                        disabled={isSubmitting || isRedirecting}
                        {...field}
                        id="school-id"
                        placeholder="Please enter your School ID"
                        type="text"
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
          </form>
        </CardContent>

        <CardFooter className="justify-end gap-3  ">
          <Button
            onClick={handleLogout}
            variant={"outline"}
            disabled={isSubmitting || isRedirecting}
          >
            Logout
          </Button>

          <Button
            form="register-form"
            type="submit"
            disabled={isSubmitting || isRedirecting}
          >
            {isSubmitting || isRedirecting ? (
              <>
                {isRedirecting ? "Redirecting" : "Submitting"}
                <Icon.loading />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
