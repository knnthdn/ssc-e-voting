"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import { MyToast } from "@/components/MyToast";
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
  deleteElection,
  resetElection,
} from "@/features/admin/_action/update-election";
import { ElectionStatus } from "@/lib/generated/prisma/enums";
import { ListRestart, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { toast } from "sonner";

type ConfirmDangerButtonProps = {
  triggerLabel: string;
  confirmLabel: string;
  title: string;
  description: string;
  onClick?: () => Promise<void>;
  icon: JSX.Element;
  isLoading?: boolean;
  isDisabled?: boolean;
};

function ConfirmDangerButton({
  triggerLabel,
  confirmLabel,
  title,
  description,
  onClick,
  icon,
  isLoading = false,
  isDisabled = false,
}: ConfirmDangerButtonProps) {
  async function handleConfirmClick() {
    if (!onClick) return;
    await onClick();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} disabled={isLoading || isDisabled}>
          {icon}
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmClick}
              disabled={isLoading || isDisabled}
            >
              {isLoading ? "Processing..." : confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DangerZone({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: ElectionStatus;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing...");
  const isResetDisabled =
    status === "STOPPED" || status === "COMPLETED" || status === "ONGOING";

  async function onReset() {
    setIsLoading(true);
    setLoadingText("Resetting election...");

    try {
      const res = await resetElection(id, slug);

      if (!res.ok) {
        MyToast.error(res.message);
        return;
      }

      toast(
        <p className="text-sm text-green-600">
          Election reset successfully.
        </p>,
      );
      router.refresh();
    } catch {
      MyToast.error("Something went wrong while resetting election");
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    setIsLoading(true);
    setLoadingText("Deleting election...");

    try {
      const res = await deleteElection(id);

      if (!res.ok) {
        MyToast.error(res.message);
        return;
      }

      toast(
        <p className="text-sm text-green-600">
          Election deleted successfully.
        </p>,
      );
      router.replace("/admin/election/manage");
    } catch {
      MyToast.error("Something went wrong while deleting election");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/40 p-5 sm:p-6">
      <span className="text-xl text-red-600 font-medium">Danger Zone</span>

      <div className="mt-5 space-y-5">
        <div className="space-y-3 rounded-lg border border-red-100 bg-white p-4">
          <span className="text-base text-brand-800 font-medium">
            Reset Election
          </span>
          <p className="text-sm text-black/50">
            Resetting the election will delete candidates and partylists, and
            set the election status to{" "}
            <span className="text-brand-100 underline">PENDING</span>.
          </p>
          <ConfirmDangerButton
            triggerLabel="Reset"
            confirmLabel="Confirm Reset"
            title="Reset election?"
            description="This will remove candidates and partylists, then set the election status to PENDING."
            onClick={onReset}
            icon={<ListRestart />}
            isLoading={isLoading}
            isDisabled={isResetDisabled}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-red-100 bg-white p-4">
          <span className="text-base text-brand-800 font-medium">
            Delete Election
          </span>

          <p className="text-sm text-black/50">
            Deleting the election will permanently remove all candidates,
            partylists, and election results.
          </p>
          <ConfirmDangerButton
            triggerLabel="Delete"
            confirmLabel="Confirm Delete"
            title="Delete election?"
            description="This action cannot be undone. All election data, candidates, partylists, and results will be permanently deleted."
            onClick={onDelete}
            icon={<Trash />}
            isLoading={isLoading}
          />
        </div>
      </div>

      <LoadingOverlay isLoading={isLoading} text={loadingText} />
    </div>
  );
}
