import z from "zod";

export const createTransferSchema = z
  .object({
    fromAccountId: z.string().uuid("Please select the source account."),

    toAccountId: z.string().uuid("Please select the destination account."),

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

    transferDate: z.date({
      error: "Transfer date is required.",
    }),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "Source and destination accounts must be different.",
    path: ["toAccountId"],
  });

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
