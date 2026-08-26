"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

import type { ChartConfig } from "@/components/ui/chart";

type CashFlowPoint = {
  date: string;
  income: number;
  expenses: number;
};

type Props = {
  data: CashFlowPoint[];
};

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(142, 71%, 45%)",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(0, 72%, 51%)",
  },
} satisfies ChartConfig;

export function CashFlowChart({ data }: Props) {
  const chartData = data.map((item) => ({
    date: item.date,
    income: Number(item.income),
    expenses: Number(item.expenses),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cash flow</CardTitle>
        <CardDescription>Income vs expenses</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-70 w-full sm:h-80">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No transactions for this period.
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 8,
                    right: 8,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-border/50"
                  />

                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={55}
                    tickFormatter={(value) => `₹${value}`}
                    className="text-xs"
                  />

                  <Tooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          `₹${Number(value).toLocaleString("en-IN")}`
                        }
                      />
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="var(--color-income)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--color-expenses)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>

        {chartData.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
              <span className="text-muted-foreground">Income</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
              <span className="text-muted-foreground">Expenses</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
