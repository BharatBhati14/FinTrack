import z from "zod";

export const categoryTypeSchema = z.enum(["EXPENSE", "INCOME"]);

export const createCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Category name is required")
      .max(100, "Category name is too long"),

    type: categoryTypeSchema,
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Category name is required")
      .max(100, "Category name is too long")
      .optional(),

    type: categoryTypeSchema.optional(),
  })
  .strict()
  .refine((data) => data.name !== undefined || data.type !== undefined, {
    message: "At least one field must be provided",
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
