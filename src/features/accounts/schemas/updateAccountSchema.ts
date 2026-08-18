import { z } from "zod";

export const accountStatusSchema = z.enum(["ACTIVE", "ARCHIVED"]);

export const supportedCurrencies = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "JPY",
  "SGD",
] as const;

export const currencySchema = z.enum(supportedCurrencies);

export const updateAccountSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Account name is required")
      .max(100, "Account name is too long")
      .optional(),

    currency: currencySchema.optional(),

    status: accountStatusSchema.optional(),
  })
  .strict();

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
