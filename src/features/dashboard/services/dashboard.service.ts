import { db } from "@/db";
import { accounts, categories, transactions, users } from "@/db/schema";

import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";

import { fromZonedTime } from "date-fns-tz";
import { addDays, parseISO, format } from "date-fns";

export type DashboardFilters = {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
};

function createUtcBoundaries(from: string, to: string, timezone: string) {
  const fromUtc = fromZonedTime(`${from}T00:00:00`, timezone);

  const toUtc = fromZonedTime(`${to}T00:00:00`, timezone);

  return {
    fromUtc,
    toUtc,
  };
}

export async function getDashboardForUser(
  userId: string,
  filters: DashboardFilters,
) {
  // --------------------------------------------------
  // 1. Load user preferences
  // --------------------------------------------------

  const [user] = await db
    .select({
      currency: users.currency,
      timezone: users.timezone,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  const { currency, timezone } = user;

  // --------------------------------------------------
  // 2. Convert user's local date range to UTC
  // --------------------------------------------------

  const { fromUtc, toUtc } = createUtcBoundaries(
    filters.from,
    filters.to,
    user.timezone,
  );

  // --------------------------------------------------
  // 3. Fetch active accounts
  // --------------------------------------------------

  const userAccounts = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      type: accounts.type,
      currency: accounts.currency,
      openingBalance: accounts.openingBalance,
      currentBalance: accounts.currentBalance,
      status: accounts.status,
    })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.status, "ACTIVE")))
    .orderBy(accounts.name);

  // Only accounts in the user's preferred currency participate
  // in the dashboard's aggregate balance.
  const dashboardAccounts = userAccounts.filter(
    (account) => account.currency === user.currency,
  );

  // --------------------------------------------------
  // 4. Total balance
  // --------------------------------------------------

  const totalBalance = dashboardAccounts.reduce(
    (total, account) => total + Number(account.currentBalance),
    0,
  );

  // --------------------------------------------------
  // 5. Income / expense summary
  // --------------------------------------------------

  const [summary] = await db
    .select({
      income: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.type} = 'INCOME'
              THEN ${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,

      expenses: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.type} = 'EXPENSE'
              THEN ${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
      and(
        eq(transactions.userId, userId),

        gte(transactions.transactionDate, fromUtc),

        lt(transactions.transactionDate, toUtc),

        eq(accounts.currency, user.currency),

        // Transfers aren't income/expense anyway,
        // but explicitly excluding them makes intent clear.
        sql`${transactions.type} IN ('INCOME', 'EXPENSE')`,
      ),
    );

  const income = Number(summary?.income ?? "0");
  const expenses = Number(summary?.expenses ?? "0");
  const netCashFlow = income - expenses;

  // --------------------------------------------------
  // 6. Daily cash flow
  // --------------------------------------------------

  const dailyTransactions = db.$with("daily_transactions").as(
    db
      .select({
        localDate: sql<string>`
        DATE(
          ${transactions.transactionDate}
          AT TIME ZONE ${timezone}
        )
      `.as("local_date"),

        type: transactions.type,
        amount: transactions.amount,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.transactionDate, fromUtc),
          lt(transactions.transactionDate, toUtc),
          eq(accounts.currency, currency),
          inArray(transactions.type, ["INCOME", "EXPENSE"]),
        ),
      ),
  );

  const dailyCashFlowRows = await db
    .with(dailyTransactions)
    .select({
      date: dailyTransactions.localDate,

      income: sql<string>`
      COALESCE(
        SUM(
          CASE
            WHEN ${dailyTransactions.type} = 'INCOME'
            THEN ${dailyTransactions.amount}
            ELSE 0
          END
        ),
        0
      )
    `,

      expenses: sql<string>`
      COALESCE(
        SUM(
          CASE
            WHEN ${dailyTransactions.type} = 'EXPENSE'
            THEN ${dailyTransactions.amount}
            ELSE 0
          END
        ),
        0
      )
    `,
    })
    .from(dailyTransactions)
    .groupBy(dailyTransactions.localDate)
    .orderBy(dailyTransactions.localDate);

  // --------------------------------------------------
  // 7. Fill missing days
  // --------------------------------------------------

  const dailyCashFlowMap = new Map(
    dailyCashFlowRows.map((row) => [
      row.date,
      {
        income: Number(row.income),
        expenses: Number(row.expenses),
      },
    ]),
  );

  const cashFlow: Array<{
    date: string;
    income: number;
    expenses: number;
  }> = [];

  let currentDate = parseISO(filters.from);
  const endDate = parseISO(filters.to);

  while (currentDate < endDate) {
    const date = format(currentDate, "yyyy-MM-dd");

    const existing = dailyCashFlowMap.get(date);

    cashFlow.push({
      date,
      income: existing?.income ?? 0,
      expenses: existing?.expenses ?? 0,
    });

    currentDate = addDays(currentDate, 1);
  }

  // --------------------------------------------------
  // 8. Spending by category
  // --------------------------------------------------

  const spendingByCategory = await db
    .select({
      categoryId: transactions.categoryId,

      categoryName: sql<string>`
        COALESCE(
          ${categories.name},
          'Uncategorized'
        )
      `,

      amount: sql<string>`
        COALESCE(
          SUM(${transactions.amount}),
          0
        )
      `,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "EXPENSE"),

        gte(transactions.transactionDate, fromUtc),

        lt(transactions.transactionDate, toUtc),

        eq(accounts.currency, user.currency),
      ),
    )
    .groupBy(transactions.categoryId, categories.name)
    .orderBy(desc(sql`SUM(${transactions.amount})`));

  // --------------------------------------------------
  // 9. Recent transactions
  //
  // IMPORTANT:
  // These are NOT restricted to the dashboard period.
  // --------------------------------------------------

  const recentTransactions = await db
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      accountName: accounts.name,

      categoryId: transactions.categoryId,
      categoryName: categories.name,

      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      transactionDate: transactions.transactionDate,
      transferId: transactions.transferId,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
    .limit(10);

  // --------------------------------------------------
  // 10. Return dashboard
  // --------------------------------------------------

  return {
    currency: user.currency,
    timezone: user.timezone,

    period: {
      from: filters.from,
      to: filters.to,
    },

    summary: {
      totalBalance: totalBalance.toFixed(2),
      income: income.toFixed(2),
      expenses: expenses.toFixed(2),
      netCashFlow: netCashFlow.toFixed(2),
    },

    accounts: userAccounts,

    cashFlow,

    spendingByCategory: spendingByCategory.map((row) => ({
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      amount: Number(row.amount).toFixed(2),
    })),

    recentTransactions,
  };
}
