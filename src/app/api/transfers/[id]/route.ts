import { getTransfer } from "@/features/transfers/services/transfer.service";
import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";
import { NextResponse } from "next/server";

type TransferRouteContext = {
  params: Promise<{ id: string }>;
};

function validateTransferId(id: string | undefined) {
  return (
    typeof id === "string" &&
    id.trim().length > 0 &&
    /^[0-9a-fA-F-]{36}$/.test(id)
  );
}

export async function GET(request: Request, { params }: TransferRouteContext) {
  try {
    const user = await requireApiUser();

    const { id } = await params;

    if (!validateTransferId(id)) {
      return NextResponse.json(
        { error: "Invalid transfer ID" },
        { status: 400 },
      );
    }

    const transfer = await getTransfer(id, user.id);

    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: transfer,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("GET /api/transfers/[id] failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
