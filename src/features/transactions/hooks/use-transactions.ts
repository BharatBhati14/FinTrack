"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../schemas/transactionSchema";

export type Transaction = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: string;
  description: string | null;
  transactionDate: string;
  transferId: string | null;
  createdAt: string;
  updatedAt: string;
};

type TransactionFilters = {
  accountId?: string;
  categoryId?: string;
  type?: "INCOME" | "EXPENSE" | "TRANSFER";
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};

export function useTransactions(filters: TransactionFilters = {}) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/transactions?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load transactions");
      }

      setData(result.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load transactions",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions,
  };
}

export async function createTransaction(input: CreateTransactionInput) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to create transaction");
  }

  return result.data as Transaction;
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to update transaction");
  }

  return result.data as Transaction;
}

export async function deleteTransaction(id: string) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to delete transaction");
  }

  return result.data as Transaction;
}
