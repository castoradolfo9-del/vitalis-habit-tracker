import type { HabitDTO } from "@/types";

interface Props {
  habits: HabitDTO[];
  onSetMeta: (id: string, meta: number) => void;
}

export default function GoalsList({ habits, onSetMeta }: Props) {
  if (habits.length === 0) {
    return <div className="text-text-dim text-xs text-center py-5">Crea un hábito para poder definirle una meta mensual</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {habits.map((h) => {
        const hasMeta = h.meta > 0;
        const pct = hasMeta ? Math.min(100, Math.round((h.progresoMes / h.meta) * 100)) : 0;

        return (
          <div key={h.id} className="rounded-2xl border border-border bg-bg-card p-2.5 px-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="text-base w-[22px] text-center shrink-0">{h.icono}</div>
              <div className="flex-1 min-w-0 text-[12px] font-semibold truncate">{h.nombre}</div>
              <div className="flex items-center gap-1 text-[10px] text-text-dim shrink-0">
                meta/mes
                <input
                  type="number"
                  min={0}
                  defaultValue={h.meta || ""}
                  placeholder="—"
                  onBlur={(e) => onSetMeta(h.id, Number(e.target.value) || 0)}
                  className="w-11 px-1.5 py-1 rounded-md border border-border bg-bg-card-2 text-text text-[11px] text-center outline-none focus:border-purple"
                />
              </div>
            </div>
            {hasMeta ? (
              <>
                <div className="h-1.5 bg-bg-card-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                      pct >= 100 ? "bg-gradient-to-r from-green to-emerald-600" : "bg-gradient-to-r from-purple to-pink"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-text-dim mt-1">
                  <span>{h.progresoMes} / {h.meta} este mes</span>
                  <span>{pct}%</span>
                </div>
              </>
            ) : (
              <div className="text-[10px] text-text-dim italic">Define una meta para ver tu progreso del mes</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
