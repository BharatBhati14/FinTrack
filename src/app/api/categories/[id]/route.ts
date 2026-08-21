import { updateCategorySchema } from "@/features/categories/schemas/categorySchema";
import {
  archiveCategory,
  getCategory,
  updateCategory,
} from "@/features/categories/services/categories.service";
import { requireApiUser, UnauthorizedError } from "@/lib/auth/auth-server";
import { NextResponse } from "next/server";

type CategoryRouteContext = {
  params: Promise<{ id: string }>;
};

function validateCategoryId(id: string | undefined) {
  return typeof id === "string" && id.trim().length > 0;
}

/**
 *
 * @param request /api/categories/id
 * @param param1 id
 * @returns fetch a category
 */

export async function GET(request: Request, { params }: CategoryRouteContext) {
  try {
    const user = await requireApiUser();

    const { id } = await params;

    if (!validateCategoryId(id)) {
      return NextResponse.json(
        {
          error: "Invalid or empty category ID",
        },
        { status: 400 },
      );
    }

    const category = await getCategory(id, user.id);

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: category,
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

    console.error("GET /api/categories/[id] failed:", error);

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
 * @param request /api/categories/id
 * @param param1 id
 * @returns update Category
 */

export async function PATCH(
  request: Request,
  { params }: CategoryRouteContext,
) {
  try {
    const user = await requireApiUser();

    const { id } = await params;

    if (!validateCategoryId(id)) {
      return NextResponse.json(
        {
          error: "Invalid or empty category ID",
        },
        { status: 400 },
      );
    }

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

    const result = updateCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const category = await updateCategory(id, user.id, result.data);

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: category,
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

    console.error("PATCH /api/categories/[id] failed:", error);

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
 * @param request /api/categories/id
 * @param param1 id
 * @returns archives a category
 */

export async function DELETE(
  request: Request,
  { params }: CategoryRouteContext,
) {
  try {
    const user = await requireApiUser();

    const { id } = await params;

    if (!validateCategoryId(id)) {
      return NextResponse.json(
        {
          error: "Invalid or empty category ID",
        },
        { status: 400 },
      );
    }

    const category = await archiveCategory(id, user.id);

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: category,
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

    console.error("DELETE /api/categories/[id] failed:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
