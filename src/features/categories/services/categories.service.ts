import { db } from "@/db";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/categorySchema";
import { categories } from "@/db/schema";
import { and, asc, desc, eq, or } from "drizzle-orm";

export async function createCategory(
  userId: string,
  input: CreateCategoryInput,
) {
  const [category] = await db
    .insert(categories)
    .values({
      userId: userId,
      name: input.name,
      type: input.type,
      isSystem: false,
      isArchived: false,
    })
    .returning();

  return category;
}

export async function getCategoriesForUser(userId: string) {
  return await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.isArchived, false),
        or(eq(categories.isSystem, true), eq(categories.userId, userId)),
      ),
    )
    .orderBy(desc(categories.createdAt));
}

export async function getCategory(categoryId: string, userId: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.isArchived, false),
        or(eq(categories.isSystem, true), eq(categories.userId, userId)),
      ),
    )
    .limit(1);

  return category;
}

// export async function updateCategory(
//   categoryId: string,
//   userId: string,
//   input: UpdateCategoryInput,
// ) {
//   const [updatedCategory] = await db
//     .update(categories)
//     .set(input)
//     .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
//     .returning();

//   return updatedCategory;
// }

export async function updateCategory(
  categoryId: string,
  userId: string,
  input: UpdateCategoryInput,
) {
  const [updatedCategory] = await db
    .update(categories)
    .set({
      ...(input.name !== undefined && {
        name: input.name,
      }),

      ...(input.type !== undefined && {
        type: input.type,
      }),

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.userId, userId),
        eq(categories.isSystem, false),
        eq(categories.isArchived, false),
      ),
    )
    .returning();

  return updatedCategory;
}

export async function archiveCategory(categoryId: string, userId: string) {
  const [archivedCategory] = await db
    .update(categories)
    .set({
      isArchived: true,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.userId, userId),
        eq(categories.isSystem, false),
        eq(categories.isArchived, false),
      ),
    )
    .returning();

  return archivedCategory;
}

export async function restoreCategory(categoryId: string, userId: string) {
  const [restoredCategory] = await db
    .update(categories)
    .set({
      isArchived: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.userId, userId),
        eq(categories.isSystem, false),
        eq(categories.isArchived, true),
      ),
    )
    .returning();

  return restoredCategory;
}
