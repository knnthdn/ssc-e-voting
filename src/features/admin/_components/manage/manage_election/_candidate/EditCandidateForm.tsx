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
import { Textarea } from "@/components/ui/textarea";
import deleteCandidate from "@/features/admin/_action/delete-candidate";
import updateCandidate from "@/features/admin/_action/update-candidate";
import { CandidateInput } from "@/features/admin/_components/manage/CandidateInput";
import type { Candidate as CandidateRow } from "@/features/admin/_components/manage/manage_election/Candidate";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";
import {
  AddCandidateInput,
  addCandidateSchema,
} from "@/features/admin/_schema/addCandidate.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@imagekit/next";
import { Trash2, Upload, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditCandidateForm({
  election,
  candidate,
  onCandidateUpdated,
}: {
  election: ManageElectionProps;
  candidate: CandidateRow;
  onCandidateUpdated?: () => Promise<void> | void;
}) {
  const [openDate, setOpenDate] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidateImageName, setCandidateImageName] = useState("");
  const pathname = usePathname().split("/");
  const canEdit =
    election.status === "COMPLETED" ||
    election.status === "ONGOING" ||
    election.status === "STOPPED";

  const defaultDate = useMemo(
    () => new Date(candidate.dateOfBirth),
    [candidate.dateOfBirth],
  );

  const form = useForm<AddCandidateInput>({
    resolver: zodResolver(addCandidateSchema),
    defaultValues: {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      bio: candidate.bio,
      gender: candidate.gender,
      dateOfBirth: defaultDate,
      schoolId: candidate.schoolId,
      positionId: candidate.positionId,
      partylistId: candidate.partylistId ?? "",
      image: undefined,
    },
  });

  async function handleEditCandidate(data: AddCandidateInput) {
    setError(null);
    setIsSubmitting(true);

    try {
      const getToken = await fetch("/api/upload-auth");
      const token = await getToken.json();

      let imageUrl = candidate.image;
      if (data.image) {
        const imageResult = await upload({
          file: data.image,
          fileName: data.image.name || `${data.firstName} profile`,
          ...token,
        });

        if (imageResult.url) {
          imageUrl = imageResult.url;
        }
      }

      const res = await updateCandidate(
        candidate.id,
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

      setDialogOpen(false);
      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      await onCandidateUpdated?.();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteCandidate() {
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await deleteCandidate(
        candidate.id,
        pathname[pathname.length - 1],
      );

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setConfirmDeleteOpen(false);
      setDialogOpen(false);
      toast(<p className="text-green-600 text-sm">{res.message}</p>);
      await onCandidateUpdated?.();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleResetForm() {
    form.reset({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      bio: candidate.bio,
      gender: candidate.gender,
      dateOfBirth: new Date(candidate.dateOfBirth),
      schoolId: candidate.schoolId,
      positionId: candidate.positionId,
      partylistId: candidate.partylistId ?? "",
      image: undefined,
    });
    setCandidateImageName("");
    setOpenDate(false);
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          aria-label={`Edit ${candidate.firstName} ${candidate.lastName}`}
          variant="secondary"
          disabled={canEdit}
        >
          Edit
          <Wrench />
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto overflow-x-hidden"
      >
        <DialogHeader>
          <DialogTitle className="text-brand-100 flex justify-between">
            Edit Candidate
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

        <form
          onSubmit={form.handleSubmit(handleEditCandidate)}
          className="pb-5"
        >
          <FieldGroup className="gap-3">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`first-name-${candidate.id}`}>
                    First name
                  </FieldLabel>
                  <CandidateInput
                    {...field}
                    id={`first-name-${candidate.id}`}
                    placeholder="First name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`last-name-${candidate.id}`}>
                    Last name
                  </FieldLabel>
                  <CandidateInput
                    {...field}
                    id={`last-name-${candidate.id}`}
                    placeholder="Last name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`bio-${candidate.id}`}>
                    Candidate Bio
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={`bio-${candidate.id}`}
                    placeholder="Bio"
                    rows={3}
                    className="resize-none focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0"
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex flex-row gap-3">
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`gender-${candidate.id}`}>
                      Gender
                    </FieldLabel>
                    <NativeSelect
                      disabled={isSubmitting}
                      className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0"
                      id={`gender-${candidate.id}`}
                      {...field}
                    >
                      <NativeSelectOption
                        value=""
                        disabled
                        className="text-muted-foreground"
                      >
                        Please select your gender
                      </NativeSelectOption>
                      <NativeSelectOption value="MALE">Male</NativeSelectOption>
                      <NativeSelectOption value="FEMALE">
                        Female
                      </NativeSelectOption>
                    </NativeSelect>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`date-${candidate.id}`}>
                      Date of birth
                    </FieldLabel>
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger
                        disabled={isSubmitting}
                        asChild
                        className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0"
                      >
                        <Button
                          variant="outline"
                          id={`date-${candidate.id}`}
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
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="positionId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`position-${candidate.id}`}>
                    Position
                  </FieldLabel>
                  <NativeSelect
                    disabled={isSubmitting}
                    className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0"
                    id={`position-${candidate.id}`}
                    {...field}
                  >
                    <NativeSelectOption
                      value=""
                      disabled
                      className="text-muted-foreground"
                    >
                      Candidate Position
                    </NativeSelectOption>
                    {election.positions.map((item) => (
                      <NativeSelectOption value={item.id} key={item.id}>
                        {item.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="partylistId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`partylist-${candidate.id}`}>
                    Partylist
                  </FieldLabel>
                  <NativeSelect
                    className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0"
                    id={`partylist-${candidate.id}`}
                    {...field}
                    disabled={isSubmitting}
                  >
                    <NativeSelectOption
                      value=""
                      className="text-muted-foreground"
                    >
                      Candidate Partylist
                    </NativeSelectOption>
                    {election.partylists.map((item) => (
                      <NativeSelectOption value={item.id} key={item.id}>
                        {item.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="schoolId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`school-id-${candidate.id}`}>
                    School ID
                  </FieldLabel>
                  <CandidateInput
                    {...field}
                    id={`school-id-${candidate.id}`}
                    placeholder="School ID"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`candidate-image-${candidate.id}`}>
                    Image
                  </FieldLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      id={`candidate-image-${candidate.id}`}
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
                      htmlFor={`candidate-image-${candidate.id}`}
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
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                disabled={isSubmitting}
                variant="outline"
                onClick={handleResetForm}
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isSubmitting}
                variant="destructive"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Delete
                <Trash2 />
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

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-100">Delete Candidate?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-600">
            This action cannot be undone. Are you sure you want to delete this
            candidate?
          </p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={handleDeleteCandidate}
            >
              {isSubmitting ? (
                <>
                  Deleting <Icon.loading />
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
