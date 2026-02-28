"use client";
import { Icon } from "@/components/Icon";
import { MyToast } from "@/components/MyToast";
import SocialAuthButton from "@/features/auth/_components/SocialAuthButton";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function SignupSocial() {
  const [pendingProvider, setPendingProvider] = useState<
    "google" | "github" | null
  >(null);

  async function googleLogin() {
    setPendingProvider("google");
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch {
      setPendingProvider(null);
      MyToast.error("Something went wrong, Please look for the admin.");
    }
  }

  async function githubLogin() {
    setPendingProvider("github");
    try {
      await authClient.signIn.social({
        provider: "github",
      });
    } catch {
      setPendingProvider(null);
      MyToast.error("Something went wrong, Please look for the admin.");
    }
  }
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <SocialAuthButton
        text={
          pendingProvider === "github"
            ? "Redirecting to Github"
            : "Register with Github"
        }
        onClick={githubLogin}
        disabled={pendingProvider !== null}
      >
        <Icon.github />
      </SocialAuthButton>

      <SocialAuthButton
        text={
          pendingProvider === "google"
            ? "Redirecting to Google"
            : "Register with Google"
        }
        onClick={googleLogin}
        disabled={pendingProvider !== null}
      >
        <Icon.google />
      </SocialAuthButton>
    </div>
  );
}
