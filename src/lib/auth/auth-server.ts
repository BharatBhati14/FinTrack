import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user ?? null;
}

export async function requireUser() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session.user;
}

export async function requireApiUser() {
  const session = await getSession();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  return session.user;
}
