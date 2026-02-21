"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { updateElection } from "@/features/admin/_action/update-election";
import { AdminInput } from "@/features/admin/_components/AdminInput";
import {
  EditElectionInput,
  editElectionSchema,
} from "@/features/admin/_schema/editElection.schema";
import { ElectionStatus } from "@/lib/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar1 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type State = {
  openStartDate: boolean;
  openEndDate: boolean;
  isConfirmOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_OPEN_START_DATE"; payload: boolean }
  | { type: "SET_OPEN_END_DATE"; payload: boolean }
  | { type: "SET_CONFIRM_OPEN"; payload: boolean }
  | { type: "SET_IS_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_OPEN_START_DATE":
      return { ...state, openStartDate: action.payload };
    case "SET_OPEN_END_DATE":
      return { ...state, openEndDate: action.payload };
    case "SET_CONFIRM_OPEN":
      return { ...state, isConfirmOpen: action.payload };
    case "SET_IS_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const initialState: State = {
  openStartDate: false,
  openEndDate: false,
  isConfirmOpen: false,
  isSubmitting: false,
  error: null,
};

const now = new Date();

export type ConfigureFieldsProps = {
  data: {
    id: string;
    name: string;
    start?: Date | null;
    end: Date;
    description: string;
    slug: string;
    status: ElectionStatus;
  };
};

function toDayTimestamp(date?: Date | null) {
  if (!date) return null;
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.getTime();
}

export default function ConfigureFields({ data }: ConfigureFieldsProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const isFormLocked =
    data.status === "STOPPED" ||
    data.status === "COMPLETED" ||
    data.status === "ONGOING";
  const isStartDateLocked =
    data.status === "PENDING" ||
    data.status === "ONGOING" ||
    data.status === "PAUSED" ||
    isFormLocked;
  const isEndDateLocked = isFormLocked;

  const form = useForm<EditElectionInput>({
    resolver: zodResolver(editElectionSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      id: data.id,
      name: data.name,
      description: data.description,
      start: data.start ?? undefined,
      end: data.end,
    },
  });

  async function handleEditElection(formData: EditElectionInput) {
    dispatch({ type: "SET_IS_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const res = await updateElection({ ...formData, slug: data.slug });

      if (!res.ok) {
        dispatch({ type: "SET_ERROR", payload: res.message });
        toast(<p className="text-red-600 text-sm">{res.message}</p>);
        return;
      }

      toast(<p className="text-green-600 text-sm">{res.message}</p>);

      if (res.slug && res.slug !== data.slug) {
        router.replace(`/admin/election/manage/${res.slug}`);
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "SET_ERROR",
        payload: "Something went wrong while updating the election",
      });
    } finally {
      dispatch({ type: "SET_IS_SUBMITTING", payload: false });
    }
  }

  const nameValue = useWatch({ control: form.control, name: "name" });
  const descriptionValue = useWatch({
    control: form.control,
    name: "description",
  });
  const startValue = useWatch({ control: form.control, name: "start" });
  const endValue = useWatch({ control: form.control, name: "end" });

  const hasChanges =
    nameValue !== data.name ||
    descriptionValue !== data.description ||
    toDayTimestamp(startValue) !== toDayTimestamp(data.start) ||
    toDayTimestamp(endValue) !== toDayTimestamp(data.end);

  function handleConfirmUpdate() {
    dispatch({ type: "SET_CONFIRM_OPEN", payload: false });
    form.handleSubmit(handleEditElection)();
  }

  return (
    <form
      className="w-full flex flex-col"
      onSubmit={form.handleSubmit(() =>
        dispatch({ type: "SET_CONFIRM_OPEN", payload: true }),
      )}
    >
      {state.error && <p className="text-red-500 mb-1">Error: {state.error}</p>}
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Election name</FieldLabel>

                <AdminInput
                  {...field}
                  id="name"
                  placeholder="Election name..."
                  type="text"
                  aria-invalid={fieldState.invalid}
                  disabled={isFormLocked || state.isSubmitting}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        <FieldGroup>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>

                  <Textarea
                    {...field}
                    placeholder="Description..."
                    rows={5}
                    className="resize-none focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400  focus-visible:ring-1 focus-visible:ring-offset-0 "
                    disabled={isFormLocked || state.isSubmitting}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <FieldGroup className="gap-4 sm:flex-row">
            <Controller
              name="start"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Election start</FieldLabel>

                  <Popover
                    open={state.openStartDate}
                    onOpenChange={(value) =>
                      !isStartDateLocked &&
                      dispatch({
                        type: "SET_OPEN_START_DATE",
                        payload: value,
                      })
                    }
                  >
                    <PopoverTrigger
                      asChild
                      className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0   "
                    >
                      <Button
                        variant="outline"
                        className="justify-between font-normal"
                        disabled={isStartDateLocked || state.isSubmitting}
                      >
                        {field.value
                          ? field.value.toLocaleDateString()
                          : "Select date"}

                        <Calendar1 className="text-brand-100" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(newStart) => {
                          if (!newStart) return;

                          const currentEnd = form.getValues("end");
                          const normalizedStart = new Date(newStart);
                          normalizedStart.setHours(0, 0, 0, 0);
                          const normalizedEnd = currentEnd
                            ? new Date(currentEnd)
                            : null;
                          normalizedEnd?.setHours(0, 0, 0, 0);

                          if (
                            !normalizedEnd ||
                            normalizedEnd <= normalizedStart
                          ) {
                            const nextDay = new Date(normalizedStart);
                            nextDay.setDate(nextDay.getDate() + 1);

                            form.setValue("end", nextDay, {
                              shouldValidate: true,
                            });
                          }

                          field.onChange(normalizedStart);
                          dispatch({
                            type: "SET_OPEN_START_DATE",
                            payload: false,
                          });
                        }}
                        disabled={(date) => {
                          const min = new Date(now);
                          min.setDate(min.getDate());

                          if (date <= min) return true;

                          return false;
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

            <Controller
              name="end"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Election end</FieldLabel>

                  <Popover
                    open={state.openEndDate}
                    onOpenChange={(value) =>
                      !isEndDateLocked &&
                      dispatch({ type: "SET_OPEN_END_DATE", payload: value })
                    }
                  >
                    <PopoverTrigger
                      asChild
                      className="h-10.5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0   "
                    >
                      <Button
                        variant="outline"
                        className="justify-between font-normal"
                        disabled={isEndDateLocked || state.isSubmitting}
                      >
                        {field.value
                          ? field.value.toLocaleDateString()
                          : "Select date"}

                        <Calendar1 className="text-brand-100" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (!date) return;
                          field.onChange(date);
                          dispatch({
                            type: "SET_OPEN_END_DATE",
                            payload: false,
                          });
                        }}
                        disabled={(date) => {
                          const start = form.getValues("start");
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          if (date <= today) return true;

                          if (!start) return false;

                          const min = new Date(start);
                          min.setDate(min.getDate());
                          return date <= min;
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
          </FieldGroup>
        </FieldGroup>
      </FieldGroup>

      <Button
        type="submit"
        className="mt-8 self-end"
        disabled={!hasChanges || state.isSubmitting || isFormLocked}
      >
        {state.isSubmitting ? "Updating..." : "Update"}
      </Button>

      <Dialog
        open={state.isConfirmOpen}
        onOpenChange={(value) =>
          dispatch({ type: "SET_CONFIRM_OPEN", payload: value })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription className="flex flex-col gap-1">
              <span className="text-base">
                Are you sure you want to update this election?
              </span>

              <span className="text-red-500 text-sm">
                Note: Updating it may affect the election.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                dispatch({ type: "SET_CONFIRM_OPEN", payload: false })
              }
              disabled={state.isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleConfirmUpdate}
              disabled={state.isSubmitting}
            >
              {state.isSubmitting ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
