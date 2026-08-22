import { createTransferSchema } from "@/features/transfers/schemas/transferSchema";
import { createTransfer } from "@/features/transfers/services/transfer.service";
import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = createTransferSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const resultData = await createTransfer(user.id, result.data);

    switch (resultData.error) {
      case "SOURCE_ACCOUNT_NOT_FOUND":
        return NextResponse.json(
          { error: "Source account not found" },
          { status: 404 },
        );

      case "DESTINATION_ACCOUNT_NOT_FOUND":
        return NextResponse.json(
          { error: "Destination account not found" },
          { status: 404 },
        );

      case "CURRENCY_MISMATCH":
        return NextResponse.json(
          {
            error: "Source and destination accounts must use the same currency",
          },
          { status: 400 },
        );

      case "INSUFFICIENT_FUNDS":
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 409 },
        );
    }

    return NextResponse.json(
      {
        data: resultData.transfer,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("POST /api/transfers failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
