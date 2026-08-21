import { createCategorySchema } from "@/features/categories/schemas/categorySchema";
import {
  createCategory,
  getCategoriesForUser,
} from "@/features/categories/services/categories.service";
import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";
import { NextResponse } from "next/server";

/**
 *
 * @param request /api/categories
 * @returns all categories of the user
 */

export async function GET() {
  try {
    const user = await requireApiUser();

    const categories = await getCategoriesForUser(user.id);

    return NextResponse.json(
      {
        data: categories,
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

    console.error("GET /api/categories failed:", error);

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
 * @param request /api/categories
 * @returns create a category
 */

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON body",
        },
        { status: 400 },
      );
    }

    const result = createCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error?.flatten(),
        },
        { status: 400 },
      );
    }

    const category = await createCategory(user.id, result.data);

    return NextResponse.json(
      {
        data: category,
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

    console.error("POST /api/categories failed:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
