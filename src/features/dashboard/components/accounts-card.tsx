import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Account = {
  id: string;
  name: string;
  type: "BANK" | "CASH" | "CREDIT_CARD" | "WALLET" | "INVESTMENT" | "OTHER";
  currency: string;
  currentBalance: string;
};

type Props = {
  accounts: Account[];
};

const accountLabels: Record<Account["type"], string> = {
  BANK: "Bank",
  CASH: "Cash",
  CREDIT_CARD: "Credit card",
  WALLET: "Wallet",
  INVESTMENT: "Investment",
  OTHER: "Other",
};

export function AccountsCard({ accounts }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardDescription>Current balances</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active accounts.</p>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{account.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {accountLabels[account.type]}
                  </p>
                </div>

                <p
                  className={`shrink-0 text-sm font-semibold ${
                    Number(account.currentBalance) < 0 ? "text-destructive" : ""
                  }`}
                >
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: account.currency,
                  }).format(Number(account.currentBalance))}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
