import "dotenv/config";

import { seedDb, pool } from "./seed-db";
import { categories } from "./schema/categories";

const systemCategories = [
  { name: "Food", type: "EXPENSE" as const },
  { name: "Transport", type: "EXPENSE" as const },
  { name: "Shopping", type: "EXPENSE" as const },
  { name: "Bills", type: "EXPENSE" as const },
  { name: "Entertainment", type: "EXPENSE" as const },
  { name: "Health", type: "EXPENSE" as const },
  { name: "Education", type: "EXPENSE" as const },
  { name: "Travel", type: "EXPENSE" as const },
  { name: "Other", type: "EXPENSE" as const },

  { name: "Salary", type: "INCOME" as const },
  { name: "Freelance", type: "INCOME" as const },
  { name: "Business", type: "INCOME" as const },
  { name: "Investment", type: "INCOME" as const },
  { name: "Other", type: "INCOME" as const },
];

async function seed() {
  console.log("🌱 Seeding system categories...");

  await seedDb
    .insert(categories)
    .values(
      systemCategories.map((category) => ({
        ...category,
        userId: null,
        isSystem: true,
        isArchived: false,
      })),
    )
    .onConflictDoNothing();

  console.log("✅ System categories seeded.");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
