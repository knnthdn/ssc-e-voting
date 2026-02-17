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
import { TableHead } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import addCandidate from "@/features/admin/_action/add-candidate";
import { CandidateInput } from "@/features/admin/_components/manage/CandidateInput";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";
import {
  AddCandidateInput,
  addCandidateSchema,
} from "@/features/admin/_schema/addCandidate.schema";
import { getEffectiveElectionStatus } from "@/lib/election-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@imagekit/next";
import { DialogClose } from "@radix-ui/react-dialog";
import { CirclePlus, Upload } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CandidateForm({
  election,
  onCandidateAdded,
}: {
  election: ManageElectionProps;
  onCandidateAdded?: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [candidateImageName, setCandidateImageName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const pathname = usePathname().split("/");
  const router = useRouter();
  const effectiveStatus = getEffectiveElectionStatus({
    status: election.status,
    start: election.start,
    end: election.end,
  });
  const canEdit =
    effectiveStatus === "COMPLETED" ||
    effectiveStatus === "ONGOING" ||
    effectiveStatus === "STOPPED";

  const form = useForm<AddCandidateInput>({
    resolver: zodResolver(addCandidateSchema),
    defaultValues: {
      bio: "",
      gender: "",
      dateOfBirth: new Date(),
      firstName: "",
      schoolId: "",
      lastName: "",
      partylistId: "",
      positionId: "",
      image: undefined,
    },
  });

  async function handleAddCandidate(data: AddCandidateInput) {
    setError(null);
    setIsSubmitting(true);

    try {
      const getToken = await fetch(`/api/upload-auth`);
      const token = await getToken.json();

      const image = data.image;
      let imageUrl = "";

      if (image) {
        const imageResult = await upload({
          file: image,
          fileName: image?.name || `${data.firstName} profile`,
          ...token,
        });

        if (imageResult.url) {
          imageUrl = imageResult.url;
        }
      }

      const res = await addCandidate(
        {
          ...data,
          image: imageUrl,
          partylistId: data.partylistId?.trim() || undefined,
        },
        pathname[pathname.length - 1],
      );

      if (!res.ok) {
        setError(res.message);
        return;
      }

      handleResetForm();
      setDialogOpen(false);
      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      router.refresh();
      window.dispatchEvent(
        new CustomEvent("election:partylist-refresh", {
          detail: { electionId: election.id },
        }),
      );

      try {
        await onCandidateAdded?.();
      } catch (refreshError) {
        console.log(refreshError);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleResetForm() {
    form.reset();
    setCandidateImageName("");
    setDate(undefined);
    setOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild className="w-fit">
        <Button size="sm" className="w-fit" disabled={canEdit}>
          Add Candidate <CirclePlus />
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto overflow-x-hidden"
      >
        <DialogHeader>
          <DialogTitle className="text-brand-100 flex justify-between">
            Add Candidate{" "}
            <button
              disabled={isSubmitting}
              className="text-xs font-normal border border-gray-300 p-1 rounded mr-5 text-brand-800/80 cursor-pointer"
              onClick={handleResetForm}
            >
              Reset fields
            </button>
          </DialogTitle>
        </DialogHeader>

        {/* SHOW IF ERROR  */}
        {error && <p className="text-red-600 text-sm">ERROR: {error}</p>}

        <form onSubmit={form.handleSubmit(handleAddCandidate)} className="pb-5">
          <FieldGroup className="gap-3">
            {/* FIRST NAME */}
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="first-name">First name</FieldLabel>

                    <CandidateInput
                      {...field}
                      id="first-name"
                      placeholder="First name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
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
                    <FieldLabel htmlFor="last-name">Last name</FieldLabel>

                    <CandidateInput
                      {...field}
                      id="last-name"
                      placeholder="Last name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* BIO */}
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bio">Candidate Bio</FieldLabel>

                    <Textarea
                      {...field}
                      placeholder="Bio"
                      rows={3}
                      className="resize-none focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400  focus-visible:ring-1 focus-visible:ring-offset-0 "
                      disabled={isSubmitting}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* GENDER AND DATE OF BIRTH */}
            <div className="flex flex-row gap-3">
              {/* Gender */}
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>

                      <NativeSelect
                        disabled={isSubmitting}
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
                        <NativeSelectOption value={"MALE"}>
                          Male
                        </NativeSelectOption>
                        <NativeSelectOption value={"FEMALE"}>
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
                          disabled={isSubmitting}
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
            </div>

            {/* POSITION  */}
            <Controller
              name="positionId"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="position">Position</FieldLabel>

                    <NativeSelect
                      disabled={isSubmitting}
                      className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0 "
                      id="position"
                      {...field}
                    >
                      <NativeSelectOption
                        value={""}
                        disabled
                        className="text-muted-foreground"
                      >
                        Candidate Position
                      </NativeSelectOption>
                      {election.positions.map((items) => {
                        return (
                          <NativeSelectOption value={items.id} key={items.id}>
                            {items.name}
                          </NativeSelectOption>
                        );
                      })}
                    </NativeSelect>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* PARTYLIST  */}
            <Controller
              name="partylistId"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="partylist">Partylist</FieldLabel>

                    <NativeSelect
                      className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0 "
                      id="partylist"
                      {...field}
                      disabled={isSubmitting}
                    >
                      <NativeSelectOption
                        value={""}
                        disabled
                        className="text-muted-foreground"
                      >
                        Candidate Partylist
                      </NativeSelectOption>
                      {election.partylists.map((items) => {
                        return (
                          <NativeSelectOption value={items.id} key={items.id}>
                            {items.name}
                          </NativeSelectOption>
                        );
                      })}
                    </NativeSelect>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* SCHOOL ID */}
            <Controller
              name="schoolId"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="school-id">School ID</FieldLabel>

                    <CandidateInput
                      {...field}
                      id="shcool-id"
                      placeholder="School ID"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* IMAGE */}
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="candidate-image">Image</FieldLabel>

                    <div className="flex items-center gap-3">
                      <Input
                        id="candidate-image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        aria-invalid={fieldState.invalid}
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          setCandidateImageName(file?.name ?? "");
                          field.onChange(file);
                        }}
                        disabled={isSubmitting}
                      />

                      <label
                        htmlFor="candidate-image"
                        className="inline-flex h-10.5 cursor-pointer items-center gap-2 rounded-md border border-gray-400 bg-white px-3 text-sm text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-light-400"
                      >
                        <Upload className="size-4" />
                        <span>Upload Image</span>
                      </label>

                      <span className="text-sm text-muted-foreground">
                        {candidateImageName || "No file selected"}
                      </span>
                    </div>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* SUBMIT AND CLOSE BUTTON  */}
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  variant={"outline"}
                  onClick={handleResetForm}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Submitting <Icon.loading />
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
