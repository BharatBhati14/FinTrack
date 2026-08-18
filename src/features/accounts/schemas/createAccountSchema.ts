import { z } from "zod";

export const accountTypeSchema = z.enum([
  "BANK",
  "CASH",
  "CREDIT_CARD",
  "WALLET",
  "INVESTMENT",
  "OTHER",
]);

// export const currencySchema = z
//   .string()
//   .trim()
//   .toUpperCase()
//   .regex(/^[A-Z]{3}$/, "Currency must be a valid 3-letter currency code");
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

export const monetaryValueSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid monetary amount")
  .refine(
    (value) => {
      const amount = Number(value);
      return Number.isFinite(amount) && amount >= 0;
    },
    {
      message: "Amount must be zero or greater",
    },
  );

export const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(100, "Account name is too long"),

  type: accountTypeSchema,

  currency: currencySchema,

  opening_balance: monetaryValueSchema,
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
