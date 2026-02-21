import { getSession } from "@/actions/auth-actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import headerBg from "@/../public/header-bg.png";
import { Key, Menu } from "lucide-react";
import Link from "next/link";
import VotersHeader from "@/features/voters/_component/VotersHeader";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (session && session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }
  return (
    <div className="h-screen w-full flex flex-col">
      <VotersHeader />

      <main className="flex-1">{children}</main>
    </div>
  );
}
