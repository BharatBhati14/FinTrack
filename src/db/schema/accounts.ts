import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// 1. Define Enums for strict type safety
export const accountTypeEnum = pgEnum("account_type", [
  "BANK",
  "CASH",
  "CREDIT_CARD",
  "WALLET",
  "INVESTMENT",
  "OTHER",
]);

export const accountStatusEnum = pgEnum("account_status", [
  "ACTIVE",
  "ARCHIVED",
]);

// 2. Define the Table
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Relationship: One user -> Many accounts
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade", // If user is deleted, delete their accounts
      onUpdate: "cascade",
    }),

  name: varchar("name", { length: 255 }).notNull(),

  // Enforced valid values (e.g., 'BANK', 'CREDIT_CARD')
  type: accountTypeEnum("type").notNull(),

  // ISO 4217 Currency Code (e.g., 'USD', 'INR')
  currency: varchar("currency", { length: 3 }).notNull(),

  // Money: Fixed precision NUMERIC(14, 2)
  // Prevents floating point errors (0.1 + 0.2 !== 0.3)
  openingBalance: numeric("opening_balance", { precision: 14, scale: 2 })
    .notNull()
    .default("0.00"),
  currentBalance: numeric("current_balance", { precision: 14, scale: 2 })
    .notNull()
    .default("0.00"),

  // Enforced valid values ('ACTIVE', 'ARCHIVED')
  status: accountStatusEnum("status").notNull().default("ACTIVE"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 3. Export TypeScript Types
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
