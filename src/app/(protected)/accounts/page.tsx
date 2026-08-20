import { AccountsPage } from "@/features/accounts/components/accounts-page";
import { requireUser } from "@/lib/auth/auth-server";

export default async function AccountsRoute() {
    await requireUser();
  return <AccountsPage />;
}