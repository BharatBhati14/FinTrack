import { pgTable, uuid, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core";
// import { boolean } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),

  // ISO 4217 Currency Code (e.g., 'USD', 'INR', 'EUR')
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),

  // IANA Timezone (e.g., 'Asia/Kolkata', 'America/New_York', 'UTC')
  timezone: varchar("timezone", { length: 50 })
    .notNull()
    .default("Asia/Kolkata"),

  emailVerified: boolean("emailVerified").notNull().default(false),
  image: varchar("image", { length: 255 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
