"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SpendingItem = {
  categoryId: string | null;
  categoryName: string | null;
  amount: string;
};

type Props = {
  data: SpendingItem[];
};

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#64748b",
];

export function SpendingChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: item.categoryName ?? "Uncategorized",
    value: Number(item.amount),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Spending</CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-75 w-full sm:h-87.5">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              No expenses for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="45%"
                  outerRadius="70%"
                  paddingAngle={2}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {chartData.length > 0 && (
          <div className="mt-4 space-y-2">
            {chartData.slice(0, 5).map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="truncate">{item.name}</span>
                </div>

                <span className="shrink-0 font-medium">
                  ₹{item.value.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
