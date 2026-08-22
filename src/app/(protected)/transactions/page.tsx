"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, ArrowLeftRight, Search } from "lucide-react";

import {
  useTransactions,
  type Transaction,
} from "@/features/transactions/hooks/use-transactions";

import { TransactionTable } from "@/features/transactions/components/transaction-table";
import { TransactionDialog } from "@/features/transactions/components/transaction-dialog";
import { TransactionDeleteDialog } from "@/features/transactions/components/transaction-delete-dialog";
import { TransferDialog } from "@/features/transfers/components/transfer-dialog";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { useCategories } from "@/features/categories/hooks/use-categories";

type Account = {
  id: string;
  name: string;
  currency: string;
};

type Category = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"ALL" | "INCOME" | "EXPENSE" | "TRANSFER">(
    "ALL",
  );

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  /*
   * Replace these with your account/category data hooks.
   */
//   const accounts: Account[] = [];
//   const categories: Category[] = [];

  const filters = useMemo(
    () => ({
      type: type === "ALL" ? undefined : type,
      limit: 50,
      offset: 0,
    }),
    [type],
  );

  const {
    data: transactions,
    loading,
    error,
    refetch,
  } = useTransactions(filters);

  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError,
    refetch: refetchAccounts,
  } = useAccounts();

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) {
      return transactions;
    }

    const query = search.toLowerCase();

    return transactions.filter((transaction) => {
      return (
        transaction.description?.toLowerCase().includes(query) ||
        accounts
          .find((account) => account.id === transaction.accountId)
          ?.name.toLowerCase()
          .includes(query)
      );
    });
  }, [transactions, search, accounts]);

  function openCreateTransaction() {
    setEditingTransaction(null);
    setTransactionDialogOpen(true);
  }

  function openEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setTransactionDialogOpen(true);
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>

          <p className="text-sm text-muted-foreground">
            Track your income, expenses, and transfers.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTransferDialogOpen(true)}>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Transfer
          </Button>

          <Button onClick={openCreateTransaction}>
            <Plus className="mr-2 h-4 w-4" />
            Add transaction
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction history</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions..."
                className="pl-9"
              />
            </div>

            <Select
              value={type}
              onValueChange={(value) =>
                setType(value as "ALL" | "INCOME" | "EXPENSE" | "TRANSFER")
              }
            >
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Loading transactions...
            </div>
          ) : (
            <TransactionTable
              transactions={filteredTransactions}
              accounts={accounts}
              categories={categories}
              onEdit={openEditTransaction}
              onDelete={setDeletingTransaction}
            />
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={editingTransaction}
        accounts={accounts}
        categories={categories}
        onSuccess={refetch}
      />

      <TransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        accounts={accounts}
        onSuccess={refetch}
      />

      <TransactionDeleteDialog
        transaction={deletingTransaction}
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTransaction(null);
          }
        }}
        onSuccess={refetch}
      />
    </div>
  );
}
