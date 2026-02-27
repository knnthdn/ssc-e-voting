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
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteUserAction({
  userId,
  isDisabled = false,
  action,
}: {
  userId: string;
  isDisabled?: boolean;
  action: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const formId = `delete-user-${userId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  function onConfirmDelete() {
    if (isDisabled || isPending) return;
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
      <form ref={formRef} id={formId}>
        <input type="hidden" name="userId" value={userId} />
      </form>

      {!mounted ? (
        <Button
          size="sm"
          variant="outline"
          className="w-24 border-red-300 text-red-700 hover:bg-red-50"
          type="button"
          disabled={isDisabled || isPending}
        >
          Delete User
        </Button>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="w-24 border-red-300 text-red-700 hover:bg-red-50"
              type="button"
              disabled={isDisabled || isPending}
            >
              {isPending ? "Deleting..." : "Delete User"}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm user deletion</DialogTitle>
              <DialogDescription>
                This will permanently delete this user and related records. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="button" onClick={onConfirmDelete} variant="destructive" disabled={isPending}>
                {isPending ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
