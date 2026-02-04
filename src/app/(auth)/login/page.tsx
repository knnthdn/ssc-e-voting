import LoginFields from "@/features/auth/_components/login/LoginFields";
import LoginSocial from "@/features/auth/_components/login/LoginSocial";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="white w-full max-w-lg space-y-12 pb-10">
      <h2 className="text-2xl">Login to your Account</h2>

      {/* LOGIN SOCIAL   */}
      <LoginSocial />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-500" />
        <span className="text-base text-gray-600">or</span>
        <div className="h-px flex-1 bg-gray-500" />
      </div>

      {/* LOGIN FIELDS */}
      <LoginFields />

      <div className="mt-10 flex flex-col gap-5">
        <p className="text-center opacity-60">
          Don&apos;t have an account?{" "}
          <Link href={"/register"} className="underline">
            Register here
          </Link>
        </p>

        <p className="text-center opacity-60">
          Forgot your password?{" "}
          <Link href={"/reset-password"} className="underline">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
}
