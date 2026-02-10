"use client";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  startElection,
  toggleElection,
  toggleElectionStatus,
} from "@/features/admin/_action/manage-election";
import { useState } from "react";

export function StartElection({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setIsLoading(true);
    setError("");

    try {
      const res = await startElection(slug);

      if (!res.ok) return setError(res.message);
    } catch {
      setError("Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-5 space-y-2">
      <Button onClick={handleStart} disabled={isLoading}>
        {isLoading ? (
          <>
            Starting Election <Icon.loading />
          </>
        ) : (
          "Start Election"
        )}
      </Button>

      {error && <p className="text-red-500">ERROR: {error}</p>}
    </div>
  );
}

//* TOGGLE ELECTION
export function ToggleElection({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectValue, setSelectValue] = useState<toggleElectionStatus | "">("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsLoading(true);
    setError(null);

    if (!selectValue) return;

    try {
      await toggleElection(slug, selectValue);
      setIsOpen(false);
    } catch {
      setError("Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-5 space-y-2">
      <div className="flex gap-2">
        <Select
          value={selectValue}
          onValueChange={(val: toggleElectionStatus) => setSelectValue(val)}
        >
          <SelectTrigger className="w-full max-w-48 border-brand-100/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="PAUSED" className="text-yellow-600">
                Pause Election
              </SelectItem>
              <SelectItem value="COMPLETED" className="text-green-600">
                End Election
              </SelectItem>
              <SelectItem value="STOPPED" className="text-red-600">
                Stop Election
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectValue}>Toggle</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change election status?</DialogTitle>

              <DialogDescription className="flex flex-col gap-3">
                Are you sure you want to change election status? <br />
                Changing status may affect the election.
                {selectValue === "PAUSED" && (
                  <span className="text-red-600/80">
                    <span className="font-medium">Important:</span> Once the
                    election is paused, voters are not allowed to vote.
                  </span>
                )}
                {selectValue === "STOPPED" && (
                  <span className="text-red-600/80">
                    <span className="font-medium">Important:</span> Once the
                    election is stopped, it cannot be reopened.
                  </span>
                )}
                {selectValue === "COMPLETED" && (
                  <span className="text-red-600/80">
                    <span className="font-medium">Important:</span> Once the
                    election is ended, it cannot be reopened.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>

              <Button onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? (
                  <>
                    Updating <Icon.loading />
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-red-500">ERROR: {error}</p>}
    </div>
  );
}
