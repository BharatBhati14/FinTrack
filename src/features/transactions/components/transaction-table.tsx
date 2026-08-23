"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import type { Transaction } from "../hooks/use-transactions";

type Account = {
  id: string;
  name: string;
  currency: string;
};

type Category = {
  id: string;
  name: string;
};

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export function TransactionTable({
  transactions,
  accounts,
  categories,
  onEdit,
  onDelete,
}: Props) {
  function getAccountName(id: string) {
    return (
      accounts.find((account) => account.id === id)?.name ?? "Unknown account"
    );
  }

  function getCategoryName(id: string | null) {
    if (!id) return "—";

    return categories.find((category) => category.id === id)?.name ?? "Unknown";
  }

  function formatAmount(transaction: Transaction) {
    const amount = Number(transaction.amount);

    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency:
        accounts.find((account) => account.id === transaction.accountId)
          ?.currency ?? "INR",
      maximumFractionDigits: 2,
    });

    return formatter.format(amount);
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="whitespace-nowrap">
                {new Intl.DateTimeFormat("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(transaction.transactionDate))}
              </TableCell>

              <TableCell className="max-w-55">
                <div className="truncate font-medium">
                  {transaction.description || "No description"}
                </div>
              </TableCell>

              <TableCell>{getAccountName(transaction.accountId)}</TableCell>

              <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    transaction.type === "INCOME"
                      ? "default"
                      : transaction.type === "EXPENSE"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {transaction.type}
                </Badge>
              </TableCell>

              <TableCell
                className={`text-right font-medium ${
                  transaction.type === "INCOME"
                    ? "text-green-600"
                    : transaction.type === "EXPENSE"
                      ? "text-red-600"
                      : ""
                }`}
              >
                {transaction.type === "INCOME"
                  ? "+"
                  : transaction.type === "EXPENSE"
                    ? "-"
                    : ""}
                {formatAmount(transaction)}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    }
                  />

                  <DropdownMenuContent align="end">
                    {transaction.type === "TRANSFER" && (
                      <>
                        <DropdownMenuItem
                          disabled
                          className="text-xs opacity-100"
                        >
                          Transfer transactions are managed as a pair and can’t
                          be edited or deleted.
                        </DropdownMenuItem>
                      </>
                    )}

                    {transaction.type !== "TRANSFER" && (
                      <>
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(transaction)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}

          {transactions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-muted-foreground"
              >
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
