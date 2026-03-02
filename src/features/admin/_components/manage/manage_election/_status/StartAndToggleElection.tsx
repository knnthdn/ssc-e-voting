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
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

//* START ELECTION
export function StartElection({ slug }: { slug: string }) {
  const router = useRouter();
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    if (isLoading || isRefreshing) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await startElection(slug);

      if (!res.ok) return setError(res.message);
      startRefreshTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const isBusy = isLoading || isRefreshing;

  return (
    <div className="mt-5 space-y-2">
      <Button onClick={handleStart} disabled={isBusy}>
        {isBusy ? "Processing election status..." : "Start Election"}
      </Button>

      {error && <p className="text-red-500">ERROR: {error}</p>}
    </div>
  );
}

//* TOGGLE ELECTION
export function ToggleElection({ slug }: { slug: string }) {
  const router = useRouter();
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const [selectValue, setSelectValue] = useState<toggleElectionStatus | "">("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!selectValue || isLoading || isRefreshing) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await toggleElection(slug, selectValue);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setIsOpen(false);
      startRefreshTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const isBusy = isLoading || isRefreshing;

  return (
    <div className="mt-5 space-y-2">
      <div className="flex gap-2">
        <Select
          value={selectValue}
          onValueChange={(val: toggleElectionStatus) => setSelectValue(val)}
          disabled={isBusy}
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

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (isBusy) return;
            setIsOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={!selectValue || isBusy}>
              {isBusy ? "Processing..." : "Toggle"}
            </Button>
          </DialogTrigger>

          <DialogContent
            onInteractOutside={(e) => {
              if (isBusy) e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              if (isBusy) e.preventDefault();
            }}
          >
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
                <Button variant="outline" disabled={isBusy}>
                  Close
                </Button>
              </DialogClose>

              <Button onClick={handleConfirm} disabled={isBusy}>
                {isBusy ? "Processing election status..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-red-500">ERROR: {error}</p>}
    </div>
  );
}
