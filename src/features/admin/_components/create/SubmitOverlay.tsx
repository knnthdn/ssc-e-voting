"use client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

type SubmitOverlayProps = {
  redirectPath: string;
  isOpen: boolean;
  status: "idle" | "submitting" | "completed";
  onClose: () => void;
};

export default function SubmitOverlay({
  isOpen,
  status,
  onClose,
  redirectPath,
}: SubmitOverlayProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        {status === "submitting" ? (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-brand-500 flex items-center w-full justify-between">
              <span className="flex items-center justify-between w-full">
                Creating election
                <span
                  aria-hidden
                  className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-100"
                />
              </span>
            </h3>

            <p className="text-base text-black/70">
              Creating election, Please wait....
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-5">
              <h3 className="text-lg font-medium text-brand-500 flex items-center w-full justify-between">
                Election created
                <Check className="text-green-500" />
              </h3>

              <p className="text-base text-black/70">
                Election saved successfully, you can now manage it in{" "}
                <span className="text-brand-100">manage</span> section.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>

              <Button
                size="sm"
                onClick={() =>
                  router.push(`/admin/election/manage/${redirectPath}`)
                }
              >
                Manage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
