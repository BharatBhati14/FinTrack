import { Navbar } from "@/components/Navbar";
import { requireUser } from "@/lib/auth/auth-server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar user={user} />

      <main className="flex-1">{children}</main>
    </div>
  );
}
