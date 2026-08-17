import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db"; //drizzle instance
import * as schema from "../../db/schema";
import * as authSchema from "./auth-schema";
import { randomUUID } from "crypto";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: {
      ...authSchema,
      user: schema.users,
    },
    // schema: {
    //   ...schema, // existing tables
    //   ...authSchema, // Auth tables
    // },
  }),

  // user: {
  //   modelName: "users",
  // },

  emailAndPassword: {
    enabled: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
    // database: {
    //   generateId: "uuid",
    // },

    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
