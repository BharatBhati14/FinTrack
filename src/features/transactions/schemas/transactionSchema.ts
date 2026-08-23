import { z } from "zod";

export const transactionTypeSchema = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);

export const createTransactionSchema = z.object({
  accountId: z.string().uuid("Please select a valid account."),

  categoryId: z
    .string()
    .uuid("Please select a valid category.")
    .nullable()
    .optional(),

  type: transactionTypeSchema,

  amount: z
    .string()
    .trim()
    .min(1, "Amount is required.")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount.")
    .refine((value) => Number(value) > 0, {
      message: "Amount must be greater than zero.",
    }),

  description: z
    .string()
    .trim()
    .max(255, "Description cannot exceed 255 characters.")
    .nullable()
    .optional(),

  transactionDate: z.coerce.date({
    error: "Transaction date is required.",
  }),
});

export const updateTransactionSchema = z
  .object({
    accountId: z.string().uuid("Please select a valid account.").optional(),

    categoryId: z
      .string()
      .uuid("Please select a valid category.")
      .nullable()
      .optional(),

    amount: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount.")
      .refine((value) => Number(value) > 0, {
        message: "Amount must be greater than zero.",
      })
      .optional(),

    description: z
      .string()
      .trim()
      .max(255, "Description cannot exceed 255 characters.")
      .nullable()
      .optional(),

    transactionDate: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

// export type CreateTransactionInput = z.input<typeof createTransactionSchema>;
// export type CreateTransactionOutput = z.output<typeof createTransactionSchema>;
export type CreateTransactionFormInput = z.input<
  typeof createTransactionSchema
>;

// Validated/output type
export type CreateTransactionInput = z.output<typeof createTransactionSchema>;

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type UpdateTransactionOutput = z.output<typeof updateTransactionSchema>;
