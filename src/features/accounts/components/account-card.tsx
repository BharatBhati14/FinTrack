"use client";

import { MoreHorizontal, WalletCards } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Account } from "../types/account";

type AccountCardProps = {
  account: Account;
  onEdit: (account: Account) => void;
  onArchive: (account: Account) => void;
};

const accountTypeLabels: Record<Account["type"], string> = {
  BANK: "Bank",
  CASH: "Cash",
  CREDIT_CARD: "Credit Card",
  WALLET: "Wallet",
  INVESTMENT: "Investment",
  OTHER: "Other",
};

function formatCurrency(amount: string, currency: string) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return amount;
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function AccountCard({ account, onEdit, onArchive }: AccountCardProps) {
  return (
    <Card className="transition-colors hover:bg-muted/30">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <WalletCards className="size-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold">{account.name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {accountTypeLabels[account.type]}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted"
              aria-label={`Actions for ${account.name}`}
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(account)}>
                Edit account
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => onArchive(account)}
              >
                Archive account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <p className="text-lg font-semibold tabular-nums">
            {formatCurrency(account.currentBalance, account.currency)}
          </p>

          <Badge
            variant={account.status === "ACTIVE" ? "default" : "secondary"}
          >
            {account.status === "ACTIVE" ? "Active" : "Archived"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
