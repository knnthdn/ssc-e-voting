"use client";

import { useReducer } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PartylistCreateTableProps = {
  partylist: string[];
  onPartylist: (val: string[]) => void;
};

export default function PartylistCreateTable({
  partylist,
  onPartylist,
}: PartylistCreateTableProps) {
  type State = {
    partylistName: string;
    error: string;
  };

  type Action =
    | { type: "SET_PARTYLIST_NAME"; value: string }
    | { type: "SET_ERROR"; value: string };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_PARTYLIST_NAME":
        return { ...state, partylistName: action.value };
      case "SET_ERROR":
        return { ...state, error: action.value };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    partylistName: "",
    error: "",
  });

  function handleAddPartylist() {
    const trimmed = state.partylistName.trim();

    if (!trimmed) {
      dispatch({ type: "SET_ERROR", value: "Please enter a partylist name." });
      return;
    }

    const duplicate = partylist.some(
      (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicate) {
      dispatch({
        type: "SET_ERROR",
        value: "Partylist name already exists.",
      });
      return;
    }

    onPartylist([...partylist, trimmed]);
    dispatch({ type: "SET_PARTYLIST_NAME", value: "" });
    dispatch({ type: "SET_ERROR", value: "" });
  }

  function handleRemovePartylist(name: string) {
    onPartylist(partylist.filter((item) => item !== name));
  }

  return (
    <div className="max-w-3xl space-y-3">
      <div className="mb-8">
        <h2 className="text-lg  font-medium text-brand-100">Partylist</h2>

        <p className="text-sm text-gray-500">
          This area is only for creating partylist, you can add partylist member
          in <span className="text-brand-100">Manage</span> section{" "}
        </p>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Partylist Name
            </TableHead>
            <TableHead className="w-[1%] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow className="bg-white">
            <TableCell className="px-4 py-3">
              <Input
                className="focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 py-5 focus-visible:ring-1 focus-visible:ring-offset-0"
                placeholder="e.g., Students First Alliance"
                value={state.partylistName}
                onChange={(val) => {
                  dispatch({
                    type: "SET_PARTYLIST_NAME",
                    value: val.target.value,
                  });
                  if (state.error) {
                    dispatch({ type: "SET_ERROR", value: "" });
                  }
                }}
                aria-invalid={Boolean(state.error)}
              />
              {state.error ? (
                <p className="mt-1 text-xs text-red-600">{state.error}</p>
              ) : null}
            </TableCell>
            <TableCell className="px-4 py-3 text-right">
              <Button onClick={handleAddPartylist}>+ Add Partylist</Button>
            </TableCell>
          </TableRow>

          {partylist.map((partylist, i) => (
            <TableRow key={partylist + i}>
              <TableCell className="px-4 py-3 font-medium text-slate-700">
                {partylist}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  className="text-slate-500"
                  onClick={() => handleRemovePartylist(partylist)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
