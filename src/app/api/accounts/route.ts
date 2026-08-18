import { requireApiUser } from "@/lib/auth/auth-server";
import {
  createAccount,
  getAccountsForUser,
} from "@/features/accounts/services/account.service";
import { createAccountSchema } from "@/features/accounts/schemas/createAccountSchema";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/db/schema";

/**
 *
 * @param request /api/accounts
 * @returns all accounts of the user
 */

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser();

    const accounts = await getAccountsForUser(user.id);

    return NextResponse.json(
      {
        data: accounts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get accounts error:", error);

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
 * @param request /api/accounts
 * @returns create an account
 */

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser();

    const body = await request.json();

    const result = createAccountSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error?.flatten(),
        },
        { status: 400 },
      );
    }

    const account = await createAccount(user.id, result.data);

    return NextResponse.json(
      {
        data: account,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create account error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
