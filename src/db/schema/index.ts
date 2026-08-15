// 1. Import locally to use in the 'schema' object
import { users } from "./users";
import { accounts, accountTypeEnum, accountStatusEnum } from "./accounts";
import { categories, categoryTypeEnum } from "./categories";
import { transactions, transactionTypeEnum } from "./transactions";

// 2. Re-export for external modules (Clean API)
export { users } from "./users";
export { accounts, accountTypeEnum, accountStatusEnum } from "./accounts";
export { categories, categoryTypeEnum } from "./categories";
export { transactions, transactionTypeEnum } from "./transactions";

// 3. Re-export types
export type { User, NewUser } from "./users";
export type { Account, NewAccount } from "./accounts";
export type { Category, NewCategory } from "./categories";
export type { Transaction, NewTransaction } from "./transactions";

// 4. Now this works because 'users' exists as a local variable
export const schema = {
  users,
  accounts,
  categories,
  transactions,
  //   Enums
  accountTypeEnum,
  accountStatusEnum,
  categoryTypeEnum,
  transactionTypeEnum,
};
