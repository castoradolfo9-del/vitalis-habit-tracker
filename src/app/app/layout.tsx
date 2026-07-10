import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="flex-1 flex flex-col bg-bg text-text">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-bold text-sm">🎮 Vitalis</span>
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
      </header>
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5">{children}</main>
    </div>
  );
}
