"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AdminInput } from "@/features/admin/_components/AdminInput";
import {
  CreateElectionInput,
  createElectionSchema,
} from "@/features/admin/_schema/createElection.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useReducer } from "react";
import { Calendar1, Save } from "lucide-react";
import PartylistCreateTable from "@/features/admin/_components/create/PartylistCreateTable";
import { createElection } from "@/features/admin/_action/create-election";
import { MyToast } from "@/components/MyToast";
import SubmitOverlay from "@/features/admin/_components/create/SubmitOverlay";

type State = {
  openStartDate: boolean;
  openEndDate: boolean;
  partylist: string[];
  submitStatus: "idle" | "submitting" | "completed";
  openSubmitOverlay: boolean;
  redirectPath: string;
  error: string;
};

type Action =
  | { type: "SET_OPEN_START_DATE"; payload: boolean }
  | { type: "SET_OPEN_END_DATE"; payload: boolean }
  | { type: "SET_PARTYLIST"; payload: string[] }
  | { type: "SET_SUBMIT_STATUS"; payload: State["submitStatus"] }
  | { type: "SET_OPEN_SUBMIT_OVERLAY"; payload: boolean }
  | { type: "SET_MANAGE_REDIRECT"; payload: string }
  | { type: "SET_ERROR"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_OPEN_START_DATE":
      return { ...state, openStartDate: action.payload };
    case "SET_OPEN_END_DATE":
      return { ...state, openEndDate: action.payload };
    case "SET_PARTYLIST":
      return { ...state, partylist: action.payload };
    case "SET_SUBMIT_STATUS":
      return { ...state, submitStatus: action.payload };
    case "SET_OPEN_SUBMIT_OVERLAY":
      return { ...state, openSubmitOverlay: action.payload };
    case "SET_MANAGE_REDIRECT":
      return { ...state, redirectPath: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const initialState: State = {
  openStartDate: false,
  openEndDate: false,
  partylist: [],
  submitStatus: "idle",
  openSubmitOverlay: false,
  redirectPath: "",
  error: "",
};

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

const status = ["Pending", "Scheduled"];

export default function CreateElectionFields() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const form = useForm<CreateElectionInput>({
    resolver: zodResolver(createElectionSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      start: now,
      end: tomorrow,
      status: "PENDING",
    },
  });

  async function handleCreateElection(data: CreateElectionInput) {
    const errMsg = "Something went wrong while creating election";

    try {
      dispatch({ type: "SET_SUBMIT_STATUS", payload: "submitting" });
      dispatch({ type: "SET_OPEN_SUBMIT_OVERLAY", payload: true });
      dispatch({ type: "SET_ERROR", payload: "" });

      const res = await createElection(data, state.partylist);

      if (!res.ok) {
        dispatch({ type: "SET_ERROR", payload: res.message });
        dispatch({ type: "SET_SUBMIT_STATUS", payload: "idle" });
        dispatch({ type: "SET_OPEN_SUBMIT_OVERLAY", payload: false });
        MyToast.error(res.message);
        return;
      }

      if (res.id) {
        dispatch({ type: "SET_MANAGE_REDIRECT", payload: res.id });
      }
      dispatch({ type: "SET_PARTYLIST", payload: [] });
      dispatch({ type: "SET_SUBMIT_STATUS", payload: "completed" });
      form.reset();
    } catch {
      dispatch({ type: "SET_ERROR", payload: errMsg });
      dispatch({ type: "SET_SUBMIT_STATUS", payload: "idle" });
      dispatch({ type: "SET_OPEN_SUBMIT_OVERLAY", payload: false });
      MyToast.error("Error creating Election");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-20 max-w-5xl ">
        <SubmitOverlay
          redirectPath={state.redirectPath}
          isOpen={state.openSubmitOverlay}
          status={state.submitStatus}
          onClose={() => {
            dispatch({ type: "SET_OPEN_SUBMIT_OVERLAY", payload: false });
            dispatch({ type: "SET_SUBMIT_STATUS", payload: "idle" });
          }}
        />

        <form onSubmit={form.handleSubmit(handleCreateElection)} className="">
          {/* ERROR MESSAGE */}
          {state.error && (
            <p className="text-red-500 mb-2">ERROR: {state.error}</p>
          )}

          <div className="w-full flex justify-between">
            <h2 className="text-lg font-medium text-brand-100">
              Election details
            </h2>

            <Button
              className="flex gap-2"
              type="submit"
              disabled={state.submitStatus === "submitting"}
            >
              Save <Save />
            </Button>
          </div>

          <div className="space-y-10">
            {/* ELECTION NAME  */}
            <FieldGroup className="gap-4 sm:flex-row">
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
                      />

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* ELECTION STATUS  */}
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="gender">Status</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className=" py-5 focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0z">
                          <SelectValue placeholder="Election status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {status.map((items, i) => {
                              return (
                                <SelectItem key={i} value={items.toUpperCase()}>
                                  <span
                                    className={cn(
                                      "size-2  rounded-full",
                                      items === "Pending" && "bg-blue-600",
                                      items === "Scheduled" &&
                                        "bg-purple-600 ring-purple-200",
                                    )}
                                  />
                                  {items}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            {/* ELECTION DESCRIPTION  */}
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
                      />

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            {/* ELECTION START AND END*/}
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

                            //* transactional update
                            if (!currentEnd || currentEnd <= newStart) {
                              const nextDay = new Date(newStart);
                              nextDay.setDate(nextDay.getDate() + 1);

                              form.setValue("end", nextDay, {
                                shouldValidate: true,
                              });
                            }

                            field.onChange(newStart);
                            dispatch({
                              type: "SET_OPEN_START_DATE",
                              payload: false,
                            });
                          }}
                          disabled={(date) => {
                            const min = new Date(now);
                            min.setDate(min.getDate() - 1);

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

              {/* ELECTION END */}
              <Controller
                name="end"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Election end</FieldLabel>

                    <Popover
                      open={state.openEndDate}
                      onOpenChange={(value) =>
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
                            field.onChange(date);
                            dispatch({
                              type: "SET_OPEN_END_DATE",
                              payload: false,
                            });
                          }}
                          //* OPTIONAL UX constraint
                          disabled={(date) => {
                            const start = form.getValues("start");
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
          </div>
        </form>

        <PartylistCreateTable
          partylist={state.partylist}
          onPartylist={(value) =>
            dispatch({ type: "SET_PARTYLIST", payload: value })
          }
        />
      </div>
    </>
  );
}
