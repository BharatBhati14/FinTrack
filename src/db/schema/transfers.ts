import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { accounts } from "./accounts";

export const transfers = pgTable(
  "transfers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relationship: One user -> Many transfers
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    fromAccountId: uuid("from_account_id").notNull(),

    toAccountId: uuid("to_account_id").notNull(),

    amount: numeric("amount", {
      precision: 14,
      scale: 2,
    }).notNull(),

    description: varchar("description", {
      length: 255,
    }),

    transferDate: timestamp("transfer_date", {
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // FROM account -> accounts
    foreignKey({
      columns: [table.fromAccountId],
      foreignColumns: [accounts.id],
      name: "transfers_from_account_id_fk",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),

    // TO account -> accounts
    foreignKey({
      columns: [table.toAccountId],
      foreignColumns: [accounts.id],
      name: "transfers_to_account_id_fk",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),

    // Common query:
    // "Get all transfers for this user ordered by date"
    index("transfers_user_date_idx").on(
      table.userId,
      table.transferDate.desc(),
    ),

    // Account history / transfer lookup
    index("transfers_from_account_idx").on(table.fromAccountId),
    index("transfers_to_account_idx").on(table.toAccountId),
  ],
);

export type Transfer = typeof transfers.$inferSelect;
export type NewTransfer = typeof transfers.$inferInsert;
