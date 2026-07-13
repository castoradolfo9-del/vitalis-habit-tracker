import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountActions from "@/components/AccountActions";

export default async function AccountPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { email: true, name: true, plan: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Tu cuenta</h1>

      <div className="rounded-2xl border border-border bg-bg-card p-4 mb-4 text-sm">
        <Row label="Email" value={user!.email} />
        <Row label="Nombre" value={user!.name || "—"} />
        <Row label="Plan" value={user!.plan === "free" ? "Gratis" : user!.plan} />
        <Row
          label="Miembro desde"
          value={new Date(user!.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
        />
      </div>

      <AccountActions />

      <p className="text-xs text-text-dim mt-6 text-center">
        Lee nuestra <a href="/privacy" className="underline">Política de Privacidad</a> y{" "}
        <a href="/terms" className="underline">Términos de Servicio</a>.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-text-dim">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
