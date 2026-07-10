import type { HabitDTO } from "@/types";

interface Props {
  habits: HabitDTO[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, onToggle, onDelete }: Props) {
  if (habits.length === 0) {
    return <div className="text-text-dim text-xs text-center py-5">No tienes hábitos activos. Crea el primero con el botón +</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {habits.map((h) => (
        <div
          key={h.id}
          onClick={() => onToggle(h.id)}
          className={`flex items-center gap-2.5 rounded-2xl border p-2.5 px-3 cursor-pointer transition-[transform,border-color] active:scale-[0.98] ${
            h.completado
              ? "border-purple bg-gradient-to-br from-purple/[0.18] to-pink/10"
              : "border-border bg-bg-card"
          }`}
        >
          <div className="text-xl w-7 text-center shrink-0">{h.icono}</div>
          <div className="flex-1 min-w-0">
            <div className={`text-[13px] font-semibold ${h.completado ? "line-through text-text-dim" : ""}`}>
              {h.nombre}
            </div>
            <div className="flex gap-1.5 mt-0.5">
              <span className="text-[10px] text-text-dim bg-bg-card-2 rounded-full px-1.5 py-0.5">{h.categoria}</span>
              <span className="text-[10px] text-text-dim bg-bg-card-2 rounded-full px-1.5 py-0.5">+{h.xp} XP</span>
            </div>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggle(h.id);
            }}
            className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center text-[13px] transition-all ${
              h.completado ? "bg-gradient-to-br from-purple to-pink border-transparent" : "border-purple-light"
            }`}
          >
            {h.completado ? "✓" : ""}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`¿Eliminar "${h.nombre}"?`)) onDelete(h.id);
            }}
            className="text-text-dim hover:text-pink text-sm p-1"
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
