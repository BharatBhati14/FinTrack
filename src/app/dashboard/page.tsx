import { requireUser } from "@/lib/auth/auth-server";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main>
      <h1>Welcome, {user.name}</h1>

      <p>{user.email}</p>
    </main>
  );
}
