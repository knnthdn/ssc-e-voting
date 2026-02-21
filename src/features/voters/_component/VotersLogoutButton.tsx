"use client";
import { MyToast } from "@/components/MyToast";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VotersLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
          },
        },
      });
    } catch {
      MyToast.error("Something went wrong");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <Button className="w-full" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Logout"}
        <LogOut />
      </Button>
    </>
  );
}
