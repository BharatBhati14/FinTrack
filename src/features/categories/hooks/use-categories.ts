"use client";

import { useCallback, useEffect, useState } from "react";

export type Category = {
  id: string;
  userId: string | null;
  name: string;
  type: "INCOME" | "EXPENSE";
  isSystem: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load categories");
      }

      setData(result.data ?? []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    data,
    loading,
    error,
    refetch: fetchCategories,
  };
}
