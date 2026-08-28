import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const client = postgres(databaseUrl, {
  max: 1,
  idle_timeout: 30,
  connect_timeout: 5,
});

export const seedDb = drizzle(client, {
  schema,
});

export { client };
