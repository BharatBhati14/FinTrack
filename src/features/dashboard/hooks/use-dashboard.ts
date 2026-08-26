"use client";

import { useCallback, useEffect, useState } from "react";

export type DashboardData = {
  currency: string;
  timezone: string;

  period: {
    from: string;
    to: string;
  };

  summary: {
    totalBalance: string;
    income: string;
    expenses: string;
    netCashFlow: string;
  };

  accounts: Array<{
    id: string;
    name: string;
    type: "BANK" | "CASH" | "CREDIT_CARD" | "WALLET" | "INVESTMENT" | "OTHER";
    currency: string;
    openingBalance: string;
    currentBalance: string;
    status: "ACTIVE" | "ARCHIVED";
  }>;

  cashFlow: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;

  spendingByCategory: Array<{
    categoryId: string | null;
    categoryName: string;
    amount: string;
  }>;

  recentTransactions: Array<{
    id: string;
    accountId: string;
    accountName: string;
    categoryId: string | null;
    categoryName: string | null;
    type: "INCOME" | "EXPENSE" | "TRANSFER";
    amount: string;
    description: string | null;
    transactionDate: string;
    transferId: string | null;
  }>;
};

type DashboardDate = string | Date;

function formatDate(date: DashboardDate) {
  if (typeof date === "string") {
    // If already YYYY-MM-DD, leave it alone.
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    return date.slice(0, 10);
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function useDashboard(from: DashboardDate, to: DashboardDate) {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        from: formatDate(from),
        to: formatDate(to),
      });

      const response = await fetch(`/api/dashboard?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load dashboard");
      }

      setData(result.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
}
