import { getSession } from "@/actions/auth-actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (session && session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }
  return <div>{children}</div>;
}
