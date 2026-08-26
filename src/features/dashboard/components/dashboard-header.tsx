"use client";

import { Button } from "@/components/ui/button";

type Props = {
  from: Date;
  to: Date;
  onRangeChange: (from: Date, to: Date) => void;
};

export function DashboardHeader({ from, to, onRangeChange }: Props) {
  const label = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(from);

  function setCurrentMonth() {
    const now = new Date();

    onRangeChange(
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 1),
    );
  }

  function setPreviousMonth() {
    const now = new Date();

    onRangeChange(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
      new Date(now.getFullYear(), now.getMonth(), 1),
    );
  }

  function setLastThreeMonths() {
    const now = new Date();

    onRangeChange(
      new Date(now.getFullYear(), now.getMonth() - 2, 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 1),
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={setPreviousMonth}>
          Previous month
        </Button>

        <Button variant="outline" size="sm" onClick={setCurrentMonth}>
          This month
        </Button>

        <Button variant="outline" size="sm" onClick={setLastThreeMonths}>
          Last 3 months
        </Button>
      </div>
    </div>
  );
}
