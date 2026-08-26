"use client";

import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useDashboard } from "../hooks/use-dashboard";
import { DashboardHeader } from "./dashboard-header";
import { SummaryCards } from "./summary-cards";
import { CashFlowChart } from "./cash-flow-chart";
import { SpendingChart } from "./spending-chart";
import { AccountsCard } from "./accounts-card";
import { RecentTransactions } from "./recent-transactions";

function getMonthRange() {
  const now = new Date();

  const from = new Date(now.getFullYear(), now.getMonth(), 1);

  const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { from, to };
}

export function Dashboard() {
  const initialRange = useMemo(getMonthRange, []);

  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);

  const { data, loading, error, refetch } = useDashboard(from, to);

  function handleRangeChange(nextFrom: Date, nextTo: Date) {
    setFrom(nextFrom);
    setTo(nextTo);
  }

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="flex min-h-100 items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Unable to load dashboard</AlertTitle>

            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Button
            type="button"
            variant="outline"
            onClick={refetch}
            className="w-full"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader from={from} to={to} onRangeChange={handleRangeChange} />

      <SummaryCards summary={data.summary} />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="min-w-0 lg:col-span-4">
          <CashFlowChart data={data.cashFlow} />
        </div>

        <div className="min-w-0 lg:col-span-3">
          <SpendingChart data={data.spendingByCategory} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AccountsCard accounts={data.accounts} />

        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Skeleton className="h-95 w-full rounded-xl lg:col-span-4" />

        <Skeleton className="h-95 w-full rounded-xl lg:col-span-3" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-70 w-full rounded-xl" />

        <Skeleton className="h-70 w-full rounded-xl" />
      </div>
    </div>
  );
}
