"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getSession(): Promise<Session> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
