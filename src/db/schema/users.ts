import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password_hash", { length: 255 }).notNull(),

  // ISO 4217 Currency Code (e.g., 'USD', 'INR', 'EUR')
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),

  // IANA Timezone (e.g., 'Asia/Kolkata', 'America/New_York', 'UTC')
  timezone: varchar("timezone", { length: 50 }).notNull().default("Asia/Kolkata"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
