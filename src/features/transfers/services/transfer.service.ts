import { db } from "@/db";
import { accounts, transactions, transfers } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { CreateTransferInput } from "../schemas/transferSchema";

export async function createTransfer(
  userId: string,
  input: CreateTransferInput,
) {
  return db.transaction(async (tx) => {
    const sourceAccounts = await tx
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.id, input.fromAccountId),
          eq(accounts.userId, userId),
          eq(accounts.status, "ACTIVE"),
        ),
      )
      .limit(1);

    const destinationAccounts = await tx
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.id, input.toAccountId),
          eq(accounts.userId, userId),
          eq(accounts.status, "ACTIVE"),
        ),
      )
      .limit(1);

    const source = sourceAccounts[0];
    const destination = destinationAccounts[0];

    if (!source) {
      return {
        error: "SOURCE_ACCOUNT_NOT_FOUND" as const,
        transfer: null,
      };
    }

    if (!destination) {
      return {
        error: "DESTINATION_ACCOUNT_NOT_FOUND" as const,
        transfer: null,
      };
    }

    // Prevent transferring between different currencies.
    if (source.currency !== destination.currency) {
      return {
        error: "CURRENCY_MISMATCH" as const,
        transfer: null,
      };
    }

    // Prevent overdrawing the source account.
    // const sourceBalance = Number(source.currentBalance);
    const sourceBalance = Number(sql`${accounts.currentBalance} >= ${input.amount}`);
    
    const transferAmount = Number(input.amount);

    if (sourceBalance < transferAmount) {
      return {
        error: "INSUFFICIENT_FUNDS" as const,
        transfer: null,
      };
    }

    // Create the transfer parent record.
    const [transfer] = await tx
      .insert(transfers)
      .values({
        userId,
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
        amount: input.amount,
        description: input.description ?? null,
        transferDate: input.transferDate,
      })
      .returning();

    // Source transaction.
    await tx.insert(transactions).values({
      userId,
      accountId: input.fromAccountId,
      categoryId: null,
      type: "TRANSFER",
      amount: input.amount,
      description: input.description ?? null,
      transactionDate: input.transferDate,
      transferId: transfer.id,
    });

    // Destination transaction.
    await tx.insert(transactions).values({
      userId,
      accountId: input.toAccountId,
      categoryId: null,
      type: "TRANSFER",
      amount: input.amount,
      description: input.description ?? null,
      transactionDate: input.transferDate,
      transferId: transfer.id,
    });

    // Debit source.
    const debitResult = await tx
      .update(accounts)
      .set({
        currentBalance: sql`${accounts.currentBalance} - ${input.amount}`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(accounts.id, input.fromAccountId),
          eq(accounts.userId, userId),
          sql`${accounts.currentBalance} >= ${input.amount}`,
        ),
      )
      .returning({ id: accounts.id });

    if (debitResult.length === 0) {
      throw new Error("Source account balance changed during transfer");
    }

    // Credit destination.
    await tx
      .update(accounts)
      .set({
        currentBalance: sql`${accounts.currentBalance} + ${input.amount}`,
        updatedAt: new Date(),
      })
      .where(
        and(eq(accounts.id, input.toAccountId), eq(accounts.userId, userId)),
      );

    return {
      error: null,
      transfer,
    };
  });
}

export async function getTransfer(transferId: string, userId: string) {
  const [transfer] = await db
    .select()
    .from(transfers)
    .where(and(eq(transfers.id, transferId), eq(transfers.userId, userId)))
    .limit(1);

  if (!transfer) {
    return null;
  }

  const transferTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.transferId, transferId),
        eq(transactions.userId, userId),
      ),
    )
    .orderBy(desc(transactions.createdAt));

  return {
    ...transfer,
    transactions: transferTransactions,
  };
}
