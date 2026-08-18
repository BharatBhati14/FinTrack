import { updateAccountSchema } from "@/features/accounts/schemas/updateAccountSchema";
import {
  archiveAccount,
  getAccount,
  updateAccount,
} from "@/features/accounts/services/account.service";
import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";
import { NextResponse } from "next/server";

/**
 *
 * @param _request /api/accounts/id
 * @param param1 id
 * @returns one account
 */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          error: "Invalid or empty account ID",
        },
        { status: 400 },
      );
    }

    const account = await getAccount(id, user.id);

    if (!account) {
      return NextResponse.json(
        {
          error: "Account not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: account,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // console.error("GET /api/accounts/[id] error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 *
 * @param request UPDATE    /api/accounts/id
 * @param param1 id
 * @returns updated account
 */

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          error: "Invalid or empty account ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const result = updateAccountSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const account = await updateAccount(id, user.id, result.data);

    if (!account) {
      return NextResponse.json(
        {
          error: "Account not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: account,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    console.error("PATCH /api/accounts/[id] error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          error: "Invalid or empty account ID",
        },
        { status: 400 },
      );
    }

    const account = await archiveAccount(id, user.id);

    if (!account) {
      return NextResponse.json(
        {
          error: "Account not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: account,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    console.error("DELETE /api/accounts/[id] error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
