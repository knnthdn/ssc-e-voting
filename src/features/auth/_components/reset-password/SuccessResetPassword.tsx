import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SuccessResetPassword() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium">Password reset successfully</h2>

        <p className="text-gray-500">
          Your password has been reset successfully! You can now sign in with
          your new password.
        </p>
      </div>

      <Link
        href={"/login"}
        replace
        className={`${buttonVariants({ variant: "default" })}`}
      >
        <ArrowLeft />
        Go to Log in
      </Link>
    </div>
  );
}
