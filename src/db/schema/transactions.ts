import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  pgEnum,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { accounts } from "./accounts";
import { categories } from "./categories";
import { transfers } from "./transfers";

// 1. Define Enum for Transaction Type
export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOME",
  "EXPENSE",
  "TRANSFER",
]);

// 2. Define the Table
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),

    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),

    // --- Core Data ---
    type: transactionTypeEnum("type").notNull(),

    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),

    description: varchar("description", { length: 255 }),

    // The date the transaction actually occurred (e.g., on the bank statement)
    transactionDate: timestamp("transaction_date", {
      withTimezone: true,
    }).notNull(),

    // Nullable UUID to link two legs of a TRANSFER (e.g., HDFC outflow <-> SBI inflow)
    transferId: uuid("transfer_id").references(() => transfers.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  // 3. Indexes for Performance
  (table) => [
    // Common Query: "Get all transactions for this user in August, ordered by date"
    index("transactions_user_date_idx").on(
      table.userId,
      table.transactionDate.desc(),
    ),

    // Common Query: "Get all transactions for this specific account"
    index("transactions_account_idx").on(table.accountId),

    // Common Query: "Show spending by category"
    index("transactions_category_idx").on(table.categoryId),

    // Transfer Logic: Quickly find the matching leg of a transfer
    index("transactions_transfer_idx").on(table.transferId),
  ],
);

// 4. Export TypeScript Types
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
