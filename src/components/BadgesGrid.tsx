import type { BadgeDTO } from "@/types";

export default function BadgesGrid({ badges }: { badges: BadgeDTO[] }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {badges.map((b) => (
        <div
          key={b.id}
          title={b.descripcion}
          className={`rounded-xl border p-2 text-center text-xl ${
            b.desbloqueado
              ? "border-purple shadow-[0_0_12px_rgba(139,92,246,0.4)] opacity-100"
              : "border-border opacity-25 grayscale"
          } bg-bg-card`}
        >
          {b.icono}
          <span className="block text-[8px] text-text-dim mt-0.5">{b.nombre}</span>
        </div>
      ))}
    </div>
  );
}
