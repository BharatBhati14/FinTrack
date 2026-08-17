import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/drizzle",
  schema: ["./src/db/schema/index.ts", "./src/lib/auth-schema.ts", "./src/lib/auth/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  strict: true,
  verbose: true,
});
