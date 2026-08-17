import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

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
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  return session.user;
}
