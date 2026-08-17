import "server-only";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE URL is not defined");
}

export const env = {
  DATABASE_URL: databaseUrl,
} as const;
