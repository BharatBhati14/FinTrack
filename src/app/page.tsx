import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  LineChart,
  PieChart,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Add your accounts",
    description:
      "Bring your bank accounts, cash, wallets, credit cards, and other accounts into one simple view.",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Track your transactions",
    description:
      "Record your income, expenses, and transfers so you always know where your money is going.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Understand your finances",
    description:
      "Use your dashboard to see balances, cash flow, spending patterns, and recent activity at a glance.",
  },
];

const features = [
  {
    icon: LineChart,
    title: "See your cash flow",
    description:
      "Compare income and expenses over time and quickly understand whether your cash flow is moving in the right direction.",
  },
  {
    icon: PieChart,
    title: "Understand your spending",
    description:
      "See where your money goes with clear category-based spending insights.",
  },
  {
    icon: Wallet,
    title: "Keep accounts organized",
    description:
      "Manage your financial accounts from one place and keep an eye on your current balances.",
  },
  {
    icon: Zap,
    title: "Stay up to date",
    description:
      "Your dashboard brings your latest financial activity together so you can make decisions with confidence.",
  },
];

const dashboardStats = [
  {
    label: "Total balance",
    value: "₹1,24,500",
    description: "Across active accounts",
  },
  {
    label: "Income",
    value: "₹65,000",
    description: "Selected period",
  },
  {
    label: "Expenses",
    value: "₹38,450",
    description: "Selected period",
  },
  {
    label: "Net cash flow",
    value: "+₹26,550",
    description: "You're cash-flow positive",
  },
];

const recentTransactions = [
  {
    name: "Salary",
    account: "Bank account",
    amount: "+₹65,000",
    type: "income",
  },
  {
    name: "Groceries",
    account: "Credit card",
    amount: "-₹2,450",
    type: "expense",
  },
  {
    name: "Electricity bill",
    account: "Bank account",
    amount: "-₹1,850",
    type: "expense",
  },
];

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-primary)/0.12,transparent_35%),radial-gradient(circle_at_top_left,var(--color-primary)/0.06,transparent_30%)]" />

          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="secondary"
                className="mb-6 rounded-full px-4 py-1"
              >
                Simple personal finance tracking
              </Badge>

              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Understand your money.
                <span className="text-primary"> Take control of it.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                FinTrack gives you one clear place to manage your accounts,
                track transactions, and understand your spending.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "lg",
                  })}
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Product preview */}
            <div className="mx-auto mt-16 max-w-6xl">
              <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/5">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <span className="size-2.5 rounded-full bg-red-500/70" />
                  <span className="size-2.5 rounded-full bg-yellow-500/70" />
                  <span className="size-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-3 text-xs text-muted-foreground">
                    FinTrack Dashboard
                  </span>
                </div>

                <div className="bg-muted/30 p-4 sm:p-6 lg:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold">Dashboard</p>
                      <p className="text-sm text-muted-foreground">
                        August 2026
                      </p>
                    </div>

                    <Badge variant="outline">This month</Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {dashboardStats.map((stat) => (
                      <Card key={stat.label}>
                        <CardContent className="p-5">
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>

                          <p className="mt-2 text-2xl font-semibold tracking-tight">
                            {stat.value}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {stat.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Cash flow</p>
                            <p className="text-sm text-muted-foreground">
                              Income vs expenses
                            </p>
                          </div>

                          <LineChart className="size-5 text-primary" />
                        </div>

                        <div className="relative mt-8 h-48 overflow-hidden">
                          <div className="absolute inset-x-0 top-1/2 border-t border-dashed" />

                          <svg
                            viewBox="0 0 600 180"
                            className="h-full w-full"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M0 135 C50 125 70 80 120 100 S180 130 220 75 S290 90 330 105 S390 35 430 65 S500 95 600 25"
                              fill="none"
                              stroke="var(--color-primary)"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />

                            <path
                              d="M0 155 C55 145 90 130 130 140 S200 145 240 115 S300 130 350 120 S420 145 465 105 S530 120 600 85"
                              fill="none"
                              stroke="currentColor"
                              className="text-destructive/70"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <div className="mt-3 flex justify-center gap-6 text-xs text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary" />
                            Income
                          </span>

                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-destructive" />
                            Expenses
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Recent transactions</p>
                            <p className="text-sm text-muted-foreground">
                              Latest activity
                            </p>
                          </div>

                          <CreditCard className="size-5 text-muted-foreground" />
                        </div>

                        <div className="mt-6 space-y-5">
                          {recentTransactions.map((transaction) => (
                            <div
                              key={transaction.name}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {transaction.name}
                                </p>

                                <p className="truncate text-xs text-muted-foreground">
                                  {transaction.account}
                                </p>
                              </div>

                              <span
                                className={
                                  transaction.type === "income"
                                    ? "shrink-0 text-sm font-semibold text-green-600 dark:text-green-500"
                                    : "shrink-0 text-sm font-semibold text-destructive"
                                }
                              >
                                {transaction.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From financial activity to clarity
              </h2>

              <p className="mt-4 text-muted-foreground">
                FinTrack keeps the process simple. Add your accounts, record
                your activity, and let your dashboard bring everything together.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div key={step.number} className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-6" />
                      </div>

                      <span className="text-sm font-semibold text-muted-foreground/50">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold">{step.title}</h3>

                    <p className="mt-3 leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Everything in one place
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  A clearer picture of your finances
                </h2>

                <p className="mt-5 leading-7 text-muted-foreground">
                  Instead of jumping between spreadsheets and different
                  accounts, FinTrack gives you a simple overview of your
                  financial activity.
                </p>

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className: "mt-7",
                  })}
                >
                  Start tracking
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <Card key={feature.title} className="bg-background">
                      <CardContent className="p-6">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>

                        <h3 className="mt-5 font-semibold">{feature.title}</h3>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-b">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight">
              Your financial data should stay yours
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
              FinTrack is designed around keeping your financial information
              organized and accessible to you. Use secure authentication and
              keep your account credentials private.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Secure authentication
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Private account data
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Clear financial insights
              </span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to understand your finances better?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start with your accounts, keep your transactions up to date, and
              let FinTrack turn your activity into a clearer financial picture.
            </p>

            <Link
              href="/sign-up"
              className={buttonVariants({
                size: "lg",
                className: "mt-8",
              })}
            >
              Create your account
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

// **************** Public Navbar ***************************

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-[25px] font-semibold tracking-tight">
          FinTrack
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
            })}
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className={buttonVariants({
              size: "lg",
            })}
          >
            Get started
            <ArrowRight className="size-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
