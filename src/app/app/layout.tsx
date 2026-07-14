import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="flex-1 flex flex-col bg-bg text-text">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Link href="/app" className="font-bold text-sm">🎮 Vitalis</Link>
        <div className="flex items-center gap-3">
          <Link href="/app/calendar" className="text-xs text-text-dim hover:text-text">
            Calendario
          </Link>
          <Link href="/app/account" className="text-xs text-text-dim hover:text-text">
            Cuenta
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="text-xs text-text-dim hover:text-text">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5">{children}</main>
    </div>
  );
}
