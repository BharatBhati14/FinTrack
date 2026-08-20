export const ACCOUNT_TYPES = [
  "BANK",
  "CASH",
  "CREDIT_CARD",
  "WALLET",
  "INVESTMENT",
  "OTHER",
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_STATUSES = ["ACTIVE", "ARCHIVED"] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  openingBalance: string;
  currentBalance: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
};

export type AccountsResponse = {
  data: Account[];
};
