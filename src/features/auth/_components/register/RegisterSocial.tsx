"use client";
import { Icon } from "@/components/Icon";
import SocialAuthButton from "@/features/auth/_components/SocialAuthButton";

export default function SignupSocial() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <SocialAuthButton text="Register with Facebook">
        <Icon.facebook />
      </SocialAuthButton>

      <SocialAuthButton text="Register with Google">
        <Icon.google />
      </SocialAuthButton>
    </div>
  );
}
