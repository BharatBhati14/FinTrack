import { createTransactionSchema } from "@/features/transactions/schemas/transactionSchema";
import {
  createTransaction,
  getTransactionsForUser,
} from "@/features/transactions/services/transactions.service";
import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";
import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();

    const { searchParams } = new URL(request.url);

    const result = querySchema.safeParse({
      accountId: searchParams.get("accountId") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const transactions = await getTransactionsForUser(user.id, result.data);

    return NextResponse.json(
      {
        data: transactions,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("GET /api/transactions failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = createTransactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const resultData = await createTransaction(user.id, result.data);

    switch (resultData.error) {
      case "ACCOUNT_NOT_FOUND":
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 },
        );

      case "CATEGORY_NOT_FOUND":
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );

      case "CATEGORY_TYPE_MISMATCH":
        return NextResponse.json(
          {
            error: "Category type does not match transaction type",
          },
          { status: 400 },
        );
    }

    return NextResponse.json(
      {
        data: resultData.transaction,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("POST /api/transactions failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
