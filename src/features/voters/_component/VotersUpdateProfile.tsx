"use client";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CandidateInput } from "@/features/admin/_components/manage/CandidateInput";
import {
  FormRegistrationInput,
  formRegisterSchema,
} from "@/features/auth/_schema/formRegistration.schema";
import { updateVoterProfile } from "@/features/voters/_action/update-voter-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@imagekit/next";
import { Upload, UserRoundPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type VotersUpdateProfileProps = {
  voter: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE";
    address: string;
    phoneNumber: string;
    schoolId: string;
  };
};

export default function VotersUpdateProfile({ voter }: VotersUpdateProfileProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voterImageName, setVoterImageName] = useState("");
  const [voterImage, setVoterImage] = useState<File | null>(null);
  const router = useRouter();

  const defaultDate = useMemo(() => new Date(voter.dateOfBirth), [voter.dateOfBirth]);

  const form = useForm<FormRegistrationInput>({
    resolver: zodResolver(formRegisterSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: voter.firstName,
      lastName: voter.lastName,
      dateOfBirth: defaultDate,
      gender: voter.gender.toLowerCase() as FormRegistrationInput["gender"],
      address: voter.address,
      phoneNumber: voter.phoneNumber,
      schoolId: voter.schoolId,
    },
  });

  function handleResetForm() {
    form.reset({
      firstName: voter.firstName,
      lastName: voter.lastName,
      dateOfBirth: new Date(voter.dateOfBirth),
      gender: voter.gender.toLowerCase() as FormRegistrationInput["gender"],
      address: voter.address,
      phoneNumber: voter.phoneNumber,
      schoolId: voter.schoolId,
    });
    setOpenDate(false);
    setVoterImageName("");
    setVoterImage(null);
    setError(null);
  }

  async function handleUpdateProfile(data: FormRegistrationInput) {
    setError(null);
    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;
      if (voterImage) {
        const getToken = await fetch("/api/upload-auth");
        const token = await getToken.json();

        const imageResult = await upload({
          file: voterImage,
          fileName: voterImage.name || `${data.firstName} profile`,
          ...token,
        });

        if (imageResult.url) {
          imageUrl = imageResult.url;
        }
      }

      const res = await updateVoterProfile(data, imageUrl);

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setDialogOpen(false);
      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(value) => {
        setDialogOpen(value);
        if (!value) {
          handleResetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-brand-100 flex gap-1 items-center cursor-pointer"
        >
          <UserRoundPen size={20} />
          Update Profile
        </button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto overflow-x-hidden"
      >
        <DialogHeader>
          <DialogTitle className="text-brand-100 flex justify-between">
            Update Profile
            <button
              disabled={isSubmitting}
              className="text-xs font-normal border border-gray-300 p-1 rounded mr-5 text-brand-800/80 cursor-pointer"
              onClick={handleResetForm}
            >
              Reset fields
            </button>
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm">ERROR: {error}</p>}

        <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="pb-2">
          <FieldGroup className="gap-3">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voter-first-name">First name</FieldLabel>
                  <CandidateInput
                    {...field}
                    id="voter-first-name"
                    placeholder="First name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voter-last-name">Last name</FieldLabel>
                  <CandidateInput
                    {...field}
                    id="voter-last-name"
                    placeholder="Last name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex flex-row gap-3">
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="voter-gender">Gender</FieldLabel>
                    <NativeSelect
                      id="voter-gender"
                      className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0"
                      {...field}
                      disabled={isSubmitting}
                    >
                      <NativeSelectOption
                        value=""
                        disabled
                        className="text-muted-foreground"
                      >
                        Please select your gender
                      </NativeSelectOption>
                      <NativeSelectOption value="male">Male</NativeSelectOption>
                      <NativeSelectOption value="female">
                        Female
                      </NativeSelectOption>
                    </NativeSelect>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="voter-date">Date of birth</FieldLabel>
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger
                        asChild
                        disabled={isSubmitting}
                        className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0"
                      >
                        <Button
                          variant="outline"
                          id="voter-date"
                          className="justify-start font-normal"
                        >
                          {field.value
                            ? new Date(field.value).toLocaleDateString()
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          defaultMonth={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (!date) return;
                            setOpenDate(false);
                            field.onChange(date);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voter-address">Address</FieldLabel>
                  <CandidateInput
                    {...field}
                    id="voter-address"
                    placeholder="Address"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voter-phone-number">Phone number</FieldLabel>
                  <CandidateInput
                    {...field}
                    id="voter-phone-number"
                    placeholder="Phone number"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="schoolId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voter-school-id">School ID</FieldLabel>
                  <CandidateInput
                    {...field}
                    id="voter-school-id"
                    placeholder="School ID"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="voter-image">Image</FieldLabel>
              <div className="flex items-center gap-3">
                <Input
                  id="voter-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setVoterImageName(file?.name ?? "");
                    setVoterImage(file);
                  }}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="voter-image"
                  className="inline-flex h-10.5 cursor-pointer items-center gap-2 rounded-md border border-gray-400 bg-white px-3 text-sm text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-light-400"
                >
                  <Upload className="size-4" />
                  <span>Update Image</span>
                </label>
                <span className="text-sm text-muted-foreground">
                  {voterImageName || "No file selected"}
                </span>
              </div>
            </Field>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Saving <Icon.loading />
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
