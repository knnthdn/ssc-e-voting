"use client";
import { Icon } from "@/components/Icon";
import { MyToast } from "@/components/MyToast";
import SocialAuthButton from "@/features/auth/_components/SocialAuthButton";
import { authClient } from "@/lib/auth-client";

export default function SignupSocial() {
  async function googleLogin() {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch {
      MyToast.error("Something went wrong, Please look for the admin.");
    }
  }

  async function githubLogin() {
    try {
      await authClient.signIn.social({
        provider: "github",
      });
    } catch {
      MyToast.error("Something went wrong, Please look for the admin.");
    }
  }
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <SocialAuthButton text="Register with Github" onClick={githubLogin}>
        <Icon.github />
      </SocialAuthButton>

      <SocialAuthButton text="Register with Google" onClick={googleLogin}>
        <Icon.google />
      </SocialAuthButton>
    </div>
  );
}
