"use client";

import { useCallback, useEffect, useState } from "react";

export type Account = {
  id: string;
  userId: string;
  name: string;
  type: string;
  currency: string;
  openingBalance: string;
  currentBalance: string;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
};

export function useAccounts() {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/accounts", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load accounts");
      }

      setData(result.data ?? []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load accounts",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    data,
    loading,
    error,
    refetch: fetchAccounts,
  };
}
