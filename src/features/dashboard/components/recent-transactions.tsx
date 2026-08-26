import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: string;
  accountName: string;
  categoryName: string | null;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: string;
  description: string | null;
  transactionDate: string;
};

type Props = {
  transactions: Transaction[];
};

function getAmount(transaction: Transaction) {
  if (transaction.type === "INCOME") {
    return `+₹${Number(transaction.amount).toLocaleString("en-IN")}`;
  }

  if (transaction.type === "EXPENSE") {
    return `-₹${Number(transaction.amount).toLocaleString("en-IN")}`;
  }

  return `₹${Number(transaction.amount).toLocaleString("en-IN")}`;
}

function getTypeLabel(type: Transaction["type"]) {
  if (type === "INCOME") {
    return "Income";
  }

  if (type === "EXPENSE") {
    return "Expense";
  }

  return "Transfer";
}

export function RecentTransactions({ transactions }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>Latest activity</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No transactions yet.
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {transaction.description ??
                        transaction.categoryName ??
                        transaction.type}
                    </p>

                    <Badge
                      variant={
                        transaction.type === "INCOME"
                          ? "default"
                          : transaction.type === "EXPENSE"
                            ? "destructive"
                            : "secondary"
                      }
                      className="hidden shrink-0 sm:inline-flex"
                    >
                      {getTypeLabel(transaction.type)}
                    </Badge>
                  </div>

                  <p className="truncate text-xs text-muted-foreground">
                    {transaction.accountName}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-semibold ${
                    transaction.type === "INCOME"
                      ? "text-green-600 dark:text-green-500"
                      : transaction.type === "EXPENSE"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {getAmount(transaction)}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
