import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/lib/env";
import * as schema from "./schema";

// export const db = drizzle(process.env.DATABASE_URL!);

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: env.DATABASE_URL,

    max: 10,

    idleTimeoutMillis: 30_000,

    connectionTimeoutMillis: 5_000,
  });

// if (process.env.NODE_ENV !== "production") {
//   globalForDb.pool = pool;
// }

export const db = drizzle({
  client: pool,
  schema,
});
