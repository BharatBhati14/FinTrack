import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; //drizzle instance
import * as schema from "../../db/schema";
import * as authSchema from "../auth-schema";
import { randomUUID } from "crypto";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema, // existing tables
      ...authSchema, // Auth tables
    },
  }),
  user: {
    modelName: "users",
  },
  emailAndPassword: { enabled: true },
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },
});
