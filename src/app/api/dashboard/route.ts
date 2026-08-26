import { NextResponse } from "next/server";
import { z } from "zod";

import { getDashboardForUser } from "@/features/dashboard/services/dashboard.service";

import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

const querySchema = z.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
});

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();

    const { searchParams } = new URL(request.url);

    const result = querySchema.safeParse({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid date range",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------
    // Default: current month
    // ---------------------------------------------

    const now = new Date();

    const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);

    const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const formatDate = (date: Date) => date.toISOString().slice(0, 10);

    const from = result.data.from ?? formatDate(defaultFrom);

    const to = result.data.to ?? formatDate(defaultTo);

    // ---------------------------------------------
    // Validate range
    // ---------------------------------------------

    if (from >= to) {
      return NextResponse.json(
        {
          error: "`from` must be before `to`",
        },
        { status: 400 },
      );
    }

    const data = await getDashboardForUser(user.id, {
      from,
      to,
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("GET /api/dashboard failed:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
