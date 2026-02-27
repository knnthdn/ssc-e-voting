"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "VOTER";

export default function RoleUpdateAction({
  userId,
  currentRole,
  action,
}: {
  userId: string;
  currentRole: Role;
  action: (formData: FormData) => Promise<void>;
}) {
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const formId = `role-update-${userId}`;

  const hasChanges = selectedRole !== currentRole;

  const confirmationMessage = useMemo(() => {
    if (currentRole === "VOTER" && selectedRole === "ADMIN") {
      return "Updating Voter to Admin will lose its abilty to vote";
    }
    if (currentRole === "ADMIN" && selectedRole === "VOTER") {
      return "Updating Admin to Voter will delete its access to Admin Dashboard";
    }
    return "No changes to update.";
  }, [currentRole, selectedRole]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onConfirmUpdate() {
    if (!hasChanges || isPending) return;
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    startTransition(async () => {
      await action(formData);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <form ref={formRef} id={formId} className="grid grid-cols-[minmax(0,160px)_auto] items-center gap-2">
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="role" value={selectedRole} />

        <select
          name="roleSelect"
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value as Role)}
          className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm"
          disabled={isPending}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="VOTER">VOTER</option>
        </select>

        {!mounted ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-24 bg-slate-200 text-slate-800 hover:bg-slate-300"
            disabled={!hasChanges || isPending}
          >
            Update
          </Button>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="w-24 bg-slate-200 text-slate-800 hover:bg-slate-300"
                disabled={!hasChanges || isPending}
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm role update</DialogTitle>
                <DialogDescription>{confirmationMessage}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="button" onClick={onConfirmUpdate} disabled={isPending}>
                  {isPending ? "Updating..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </form>
    </>
  );
}
