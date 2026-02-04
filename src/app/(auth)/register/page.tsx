import RegisterFields from "@/features/auth/_components/register/RegisterFields";
import SignupSocial from "@/features/auth/_components/register/RegisterSocial";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="white w-full max-w-lg space-y-8 pb-10">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl">Register</h1>
        <p className="text-muted-foreground text-sm">
          Create your student voter account for the Student Supreme Council
          elections.
        </p>
      </div>

      {/* SIGNUP SOCIAL */}
      <SignupSocial />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-500" />
        <span className="text-base text-gray-600">or</span>
        <div className="h-px flex-1 bg-gray-500" />
      </div>

      {/* FIELDS  */}

      <RegisterFields />

      <p className="mt-10 text-center opacity-60">
        Already have an account?{" "}
        <Link href={"login"} className="underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
