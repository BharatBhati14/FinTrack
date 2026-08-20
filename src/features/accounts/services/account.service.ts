import { db } from "@/db";
import { Account, accounts } from "@/db/schema";
import { CreateAccountInput } from "../schemas/createAccountSchema";
import { and, asc, eq } from "drizzle-orm";
import { UpdateAccountInput } from "../schemas/updateAccountSchema";

export async function createAccount(userId: string, input: CreateAccountInput) {
  const [account] = await db
    .insert(accounts)
    .values({
      userId: userId,
      name: input.name,
      type: input.type,
      currency: input.currency,
      openingBalance: input.opening_balance,
      currentBalance: input.opening_balance,
      // status: "ACTIVE",
    })
    .returning();

  return account;
}

export async function getAccountsForUser(userId: string) {
  // const userAccounts = await
  return await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.status, "ACTIVE")))
    .orderBy(asc(accounts.name))
    .limit(20);

  // return userAccounts;
}

export async function getAccount(accountId: string, userId: string) {
  const [account] = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
    .limit(1);

  return account;
}

export async function updateAccount(
  accountId: string,
  userId: string,
  input: UpdateAccountInput,
) {
  const [updatedAccount] = await db
    .update(accounts)
    .set(input)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
    .returning();

  return updatedAccount;
}

export async function archiveAccount(accountId: string, userId: string) {
  const [archivedAccount] = await db
    .update(accounts)
    .set({
      status: "ARCHIVED",
    })
    .where(
      and(
        eq(accounts.id, accountId),
        eq(accounts.userId, userId),
        eq(accounts.status, "ACTIVE"),
      ),
    )
    .returning();

  return archivedAccount;
}
