import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Summary = {
  totalBalance: string;
  income: string;
  expenses: string;
  netCashFlow: string;
};

type Props = {
  summary: Summary;
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function SummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Total balance",
      value: formatCurrency(summary.totalBalance),
      description: "Across active accounts",
    },
    {
      label: "Income",
      value: formatCurrency(summary.income),
      description: "Selected period",
    },
    {
      label: "Expenses",
      value: formatCurrency(summary.expenses),
      description: "Selected period",
    },
    {
      label: "Net cash flow",
      value: formatCurrency(summary.netCashFlow),
      description:
        Number(summary.netCashFlow) >= 0
          ? "You're cash-flow positive"
          : "You're cash-flow negative",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">
              {card.value}
            </div>

            <CardDescription className="mt-1">
              {card.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
