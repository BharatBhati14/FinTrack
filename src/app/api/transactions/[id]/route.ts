import { updateTransactionSchema } from "@/features/transactions/schemas/transactionSchema";
import {
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "@/features/transactions/services/transactions.service";
import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";
import { NextResponse } from "next/server";

type TransactionRouteContext = {
  params: Promise<{ id: string }>;
};

function validateTransactionId(id: string | undefined) {
  return (
    typeof id === "string" &&
    id.trim().length > 0 &&
    /^[0-9a-fA-F-]{36}$/.test(id)
  );
}

export async function GET(
  request: Request,
  { params }: TransactionRouteContext,
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;

    if (!validateTransactionId(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const transaction = await getTransaction(id, user.id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: transaction }, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("GET /api/transactions/[id] failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: TransactionRouteContext,
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;

    if (!validateTransactionId(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = updateTransactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const resultData = await updateTransaction(id, user.id, result.data);

    switch (resultData.error) {
      case "NOT_FOUND":
        return NextResponse.json(
          { error: "Transaction not found" },
          { status: 404 },
        );

      case "TRANSFER_TRANSACTION":
        return NextResponse.json(
          {
            error: "Transfer transactions cannot be modified directly",
          },
          { status: 409 },
        );

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

    return NextResponse.json({ data: resultData.transaction }, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("PATCH /api/transactions/[id] failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: TransactionRouteContext,
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;

    if (!validateTransactionId(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const result = await deleteTransaction(id, user.id);

    if (result.error === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (result.error === "TRANSFER_TRANSACTION") {
      return NextResponse.json(
        {
          error: "Transfer transactions cannot be deleted directly",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        data: result.transaction,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("DELETE /api/transactions/[id] failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
