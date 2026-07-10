import type { StatsDTO } from "@/types";

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatsHeader({ stats }: { stats: StatsDTO }) {
  const offset = CIRCUMFERENCE - (stats.completionPct / 100) * CIRCUMFERENCE;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-bg-card p-3.5 mb-3.5">
      <div className="relative w-[84px] h-[84px] shrink-0">
        <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="42" cy="42" r={RADIUS} strokeWidth="8" fill="none" stroke="#2e2444" />
          <circle
            cx="42"
            cy="42"
            r={RADIUS}
            strokeWidth="8"
            fill="none"
            stroke="url(#ringGradient)"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-base font-bold">
          {stats.completionPct}%
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-[13px] px-2.5 py-0.5 rounded-full bg-gradient-to-br from-purple to-pink">
            Nivel {stats.level}
          </span>
          <span className="text-[11px] text-text-dim">
            {stats.xpIntoLevel} / {stats.xpForNext} XP
          </span>
        </div>
        <div className="h-2 bg-bg-card-2 rounded-full mt-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple to-pink transition-[width] duration-500 ease-out"
            style={{ width: `${stats.levelPct}%` }}
          />
        </div>

        <div className="flex gap-2 mt-2.5">
          <StatChip num={`${stats.racha} 🔥`} label="Racha" />
          <StatChip num={stats.rachaMaxima} label="Máxima" />
          <StatChip num={stats.tareasTotales} label="Total" />
        </div>
      </div>
    </div>
  );
}

function StatChip({ num, label }: { num: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-xl border border-border bg-bg-card-2 py-2 text-center">
      <div className="text-[15px] font-bold">{num}</div>
      <div className="text-[10px] text-text-dim">{label}</div>
    </div>
  );
}
