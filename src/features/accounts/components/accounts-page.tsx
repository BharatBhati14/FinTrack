"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw, WalletCards } from "lucide-react";

import { AccountCard } from "./account-card";
import { AccountForm } from "./account-form";
import { EditAccountDialog } from "./edit-account-dialog";
import { ArchiveAccountDialog } from "./archive-account-dialog";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Account, AccountsResponse } from "../types/account";

// type Account = {
//   id: string;
//   name: string;
//   type: "BANK" | "CASH" | "CREDIT_CARD" | "WALLET" | "INVESTMENT" | "OTHER";
//   currency: string;
//   openingBalance: string;
//   currentBalance: string;
//   status: "ACTIVE" | "ARCHIVED";
//   createdAt: string;
//   updatedAt: string;
// };

// type AccountsResponse = {
//   data: Account[];
// };

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const fetchAccounts = useCallback(async (refresh = false) => {
    try {
      setError(null);

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetch("/api/accounts", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Your session has expired. Please sign in again.");
        } else {
          setError(payload?.error ?? "Unable to load your accounts.");
        }

        return;
      }

      const result = payload as AccountsResponse;

      setAccounts(result.data ?? []);
    } catch (error) {
      console.error("Get accounts request failed:", error);

      setError(
        "Unable to connect to the server. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  function handleAccountCreated() {
    setDialogOpen(false);
    void fetchAccounts(true);
  }

  function handleEdit(account: Account) {
    setSelectedAccount(account);
    setEditDialogOpen(true);
  }

  function handleArchive(account: Account) {
    setSelectedAccount(account);
    setArchiveDialogOpen(true);
  }

  function handleAccountMutationSuccess() {
    setSelectedAccount(null);
    void fetchAccounts(true);
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>

            <p className="mt-1 text-muted-foreground">
              Manage your bank accounts, cash, wallets and other accounts.
            </p>
          </div>

          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add Account
          </Button>

          {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Add Account
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Add account</DialogTitle>

                <DialogDescription>
                  Add a financial account to start tracking its balance.
                </DialogDescription>
              </DialogHeader>

              <AccountForm
                onSuccess={handleAccountCreated}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog> */}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add account</DialogTitle>

              <DialogDescription>
                Add a financial account to start tracking its balance.
              </DialogDescription>
            </DialogHeader>

            <AccountForm
              onSuccess={handleAccountCreated}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{error}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => void fetchAccounts(true)}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}

                <span className="ml-2">Retry</span>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-6 w-28 animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && accounts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <WalletCards className="size-6 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">No accounts yet</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Add your first bank account, cash account, wallet or investment
                account.
              </p>

              <Button className="mt-6" onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 size-4" />
                Add Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Accounts */}
        {!isLoading && accounts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your accounts</h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => void fetchAccounts(true)}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}

                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <EditAccountDialog
        account={selectedAccount}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleAccountMutationSuccess}
      />

      <ArchiveAccountDialog
        account={selectedAccount}
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        onSuccess={handleAccountMutationSuccess}
      />
    </main>
  );
}
