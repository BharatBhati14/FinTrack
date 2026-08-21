import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const categoryTypeEnum = pgEnum("category_type", ["INCOME", "EXPENSE"]);

export const categories = pgTable(
  "categories",
  {
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

    isArchived: boolean("is_archived").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIndex: index("categories_user_id_idx").on(table.userId),

    typeIndex: index("categories_type_idx").on(table.type),
  }),
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
