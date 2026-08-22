import { db } from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../schemas/transactionSchema";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

type TransactionFilters = {
  accountId?: string;
  categoryId?: string;
  type?: "INCOME" | "EXPENSE" | "TRANSFER";
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
};

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
) {
  // --------------------------------------------------
  // 1. Validate account ownership
  // --------------------------------------------------

  const [account] = await db
    .select({
      id: accounts.id,
      currency: accounts.currency,
    })
    .from(accounts)
    .where(
      and(
        eq(accounts.id, input.accountId),
        eq(accounts.userId, userId),
        eq(accounts.status, "ACTIVE"),
      ),
    )
    .limit(1);

  if (!account) {
    return {
      error: "ACCOUNT_NOT_FOUND" as const,
      transaction: null,
    };
  }

  // --------------------------------------------------
  // 2. Validate category
  // --------------------------------------------------

  if (input.categoryId) {
    const [category] = await db
      .select({
        id: categories.id,
        type: categories.type,
        isSystem: categories.isSystem,
        userId: categories.userId,
      })
      .from(categories)
      .where(
        and(
          eq(categories.id, input.categoryId),
          eq(categories.isArchived, false),
        ),
      )
      .limit(1);

    if (!category) {
      return {
        error: "CATEGORY_NOT_FOUND",
        transaction: null,
      };
    }

    const canUseCategory = category.isSystem || category.userId === userId;

    if (!canUseCategory) {
      return {
        error: "CATEGORY_NOT_FOUND",
        transaction: null,
      };
    }

    if (!category.isSystem && category.userId !== userId) {
      return {
        error: "CATEGORY_NOT_FOUND",
        transaction: null,
      };
    }

    if (category.type !== input.type) {
      return {
        error: "CATEGORY_TYPE_MISMATCH",
        transaction: null,
      };
    }
  }

  // --------------------------------------------------
  // 3. Create transaction + update balance atomically
  // --------------------------------------------------

  const result = await db.transaction(async (tx) => {
    const [transaction] = await tx
      .insert(transactions)
      .values({
        userId,
        accountId: input.accountId,
        categoryId: input.categoryId ?? null,
        type: input.type,
        amount: input.amount,
        description: input.description ?? null,
        transactionDate: input.transactionDate,
      })
      .returning();

    if (!transaction) {
      throw new Error("Failed to create transaction");
    }

    const balanceDelta =
      input.type === "INCOME" ? input.amount : `-${input.amount}`;

    const [updatedAccount] = await tx
      .update(accounts)
      .set({
        currentBalance: sql`${accounts.currentBalance} + ${balanceDelta}`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(accounts.id, input.accountId),
          eq(accounts.userId, userId),
          eq(accounts.status, "ACTIVE"),
        ),
      )
      .returning({
        id: accounts.id,
      });

    if (!updatedAccount) {
      throw new Error("Failed to update account balance");
    }

    return transaction;
  });

  return {
    error: null,
    transaction: result,
  };
}

export async function getTransactionsForUser(
  userId: string,
  filters: TransactionFilters = {},
) {
  const limit = Math.min(Math.max(filters.limit ?? 50, 1), 100);

  const offset = Math.max(filters.offset ?? 0, 0);

  const conditions = [eq(transactions.userId, userId)];

  if (filters.accountId) {
    conditions.push(eq(transactions.accountId, filters.accountId));
  }

  if (filters.categoryId) {
    conditions.push(eq(transactions.categoryId, filters.categoryId));
  }

  if (filters.type) {
    conditions.push(eq(transactions.type, filters.type));
  }

  if (filters.from) {
    conditions.push(gte(transactions.transactionDate, filters.from));
  }

  if (filters.to) {
    conditions.push(lte(transactions.transactionDate, filters.to));
  }

  return db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getTransaction(transactionId: string, userId: string) {
  const [transaction] = await db
    .select()
    .from(transactions)
    .where(
      and(eq(transactions.id, transactionId), eq(transactions.userId, userId)),
    )
    .limit(1);

  return transaction;
}

export async function updateTransaction(
  transactionId: string,
  userId: string,
  input: UpdateTransactionInput,
) {
  return db.transaction(async (tx) => {
    // --------------------------------------------------
    // 1. Load existing transaction
    // --------------------------------------------------

    const [existing] = await tx
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .limit(1);

    if (!existing) {
      return {
        error: "NOT_FOUND" as const,
        transaction: null,
      };
    }

    // Transfer transactions are immutable through
    // the normal transaction API.
    if (existing.transferId) {
      return {
        error: "TRANSFER_TRANSACTION" as const,
        transaction: null,
      };
    }

    // --------------------------------------------------
    // 2. Calculate new values
    // --------------------------------------------------

    const nextAccountId = input.accountId ?? existing.accountId;

    const nextAmount = input.amount ?? existing.amount;

    const nextCategoryId =
      input.categoryId !== undefined ? input.categoryId : existing.categoryId;

    // IMPORTANT:
    // Type is intentionally immutable.
    const nextType = existing.type;

    // --------------------------------------------------
    // 3. Validate account
    // --------------------------------------------------

    const [account] = await tx
      .select({
        id: accounts.id,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.id, nextAccountId),
          eq(accounts.userId, userId),
          eq(accounts.status, "ACTIVE"),
        ),
      )
      .limit(1);

    if (!account) {
      return {
        error: "ACCOUNT_NOT_FOUND" as const,
        transaction: null,
      };
    }

    // --------------------------------------------------
    // 4. Validate category
    // --------------------------------------------------

    if (nextCategoryId) {
      const [category] = await tx
        .select({
          id: categories.id,
          type: categories.type,
          isSystem: categories.isSystem,
          userId: categories.userId,
        })
        .from(categories)
        .where(
          and(
            eq(categories.id, nextCategoryId),
            eq(categories.isArchived, false),
          ),
        )
        .limit(1);

      if (!category) {
        return {
          error: "CATEGORY_NOT_FOUND" as const,
          transaction: null,
        };
      }

      if (!category.isSystem && category.userId !== userId) {
        return {
          error: "CATEGORY_NOT_FOUND" as const,
          transaction: null,
        };
      }

      if (category.type !== nextType) {
        return {
          error: "CATEGORY_TYPE_MISMATCH" as const,
          transaction: null,
        };
      }
    }

    // --------------------------------------------------
    // 5. Reverse old account balance effect
    // --------------------------------------------------

    const oldBalanceDelta =
      existing.type === "INCOME" ? `-${existing.amount}` : existing.amount;

    const [oldAccount] = await tx
      .update(accounts)
      .set({
        currentBalance: sql`${accounts.currentBalance} + ${oldBalanceDelta}`,
        updatedAt: new Date(),
      })
      .where(
        and(eq(accounts.id, existing.accountId), eq(accounts.userId, userId)),
      )
      .returning({
        id: accounts.id,
      });

    if (!oldAccount) {
      throw new Error("Failed to reverse old account balance");
    }

    // --------------------------------------------------
    // 6. Apply new account balance effect
    // --------------------------------------------------

    const newBalanceDelta =
      nextType === "INCOME" ? nextAmount : `-${nextAmount}`;

    const [newAccount] = await tx
      .update(accounts)
      .set({
        currentBalance: sql`${accounts.currentBalance} + ${newBalanceDelta}`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(accounts.id, nextAccountId),
          eq(accounts.userId, userId),
          eq(accounts.status, "ACTIVE"),
        ),
      )
      .returning({
        id: accounts.id,
      });

    if (!newAccount) {
      throw new Error("Failed to apply new account balance");
    }

    // --------------------------------------------------
    // 7. Update transaction
    // --------------------------------------------------

    const [updatedTransaction] = await tx
      .update(transactions)
      .set({
        ...(input.accountId !== undefined && {
          accountId: input.accountId,
        }),

        ...(input.categoryId !== undefined && {
          categoryId: input.categoryId,
        }),

        ...(input.amount !== undefined && {
          amount: input.amount,
        }),

        ...(input.description !== undefined && {
          description: input.description,
        }),

        ...(input.transactionDate !== undefined && {
          transactionDate: input.transactionDate,
        }),

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .returning();

    if (!updatedTransaction) {
      throw new Error("Failed to update transaction");
    }

    return {
      error: null,
      transaction: updatedTransaction,
    };
  });
}

export async function deleteTransaction(transactionId: string, userId: string) {
  return db.transaction(async (tx) => {
    // --------------------------------------------------
    // 1. Find transaction
    // --------------------------------------------------

    const [existing] = await tx
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .limit(1);

    if (!existing) {
      return {
        error: "NOT_FOUND" as const,
        transaction: null,
      };
    }

    // Transfers must be deleted through the transfer API.
    if (existing.transferId) {
      return {
        error: "TRANSFER_TRANSACTION" as const,
        transaction: null,
      };
    }

    // --------------------------------------------------
    // 2. Reverse balance
    // --------------------------------------------------

    const balanceDelta =
      existing.type === "INCOME" ? `-${existing.amount}` : existing.amount;

    const [updatedAccount] = await tx
      .update(accounts)
      .set({
        currentBalance: sql`${accounts.currentBalance} + ${balanceDelta}`,
        updatedAt: new Date(),
      })
      .where(
        and(eq(accounts.id, existing.accountId), eq(accounts.userId, userId)),
      )
      .returning({
        id: accounts.id,
      });

    if (!updatedAccount) {
      throw new Error("Failed to reverse account balance");
    }

    // --------------------------------------------------
    // 3. Delete transaction
    // --------------------------------------------------

    const [deletedTransaction] = await tx
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .returning();

    if (!deletedTransaction) {
      throw new Error("Failed to delete transaction");
    }

    return {
      error: null,
      transaction: deletedTransaction,
    };
  });
}
