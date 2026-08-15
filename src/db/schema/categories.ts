import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// 1. Define Enum for Category Purpose
// Prevents assigning an 'INCOME' category to an expense transaction
export const categoryTypeEnum = pgEnum("category_type", ["INCOME", "EXPENSE"]);

// 2. Define the Table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),

  name: varchar("name", { length: 100 }).notNull(),

  // Enforced purpose: 'INCOME' or 'EXPENSE'
  type: categoryTypeEnum("type").notNull(),

  // Distinguishes 'Food' (system) from 'Gym' (user)
  isSystem: boolean("is_system").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 3. Export TypeScript Types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
