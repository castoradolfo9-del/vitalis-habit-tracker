"use client";

import { useState } from "react";
import type { CalendarResponse } from "@/types";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DIAS_SEMANA = ["D", "L", "M", "M", "J", "V", "S"];

interface Props {
  initialData: CalendarResponse;
}

export default function CalendarView({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  async function loadMonth(year: number, month: number) {
    setLoading(true);
    const res = await fetch(`/api/calendar?year=${year}&month=${month}`);
    const fresh: CalendarResponse = await res.json();
    setData(fresh);
    setLoading(false);
  }

  function prevMonth() {
    const m = data.month - 1;
    if (m < 1) loadMonth(data.year - 1, 12);
    else loadMonth(data.year, m);
  }

  function nextMonth() {
    const m = data.month + 1;
    if (m > 12) loadMonth(data.year + 1, 1);
    else loadMonth(data.year, m);
  }

  // día de la semana (0=Dom) en que cae el 1º del mes, calculado en UTC para que coincida con las fechas del backend
  const firstWeekday = new Date(Date.UTC(data.year, data.month - 1, 1)).getUTCDay();
  const leadingBlanks = Array.from({ length: firstWeekday });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={loading}
          className="w-8 h-8 rounded-lg bg-bg-card-2 border border-border text-text-dim hover:text-text disabled:opacity-40"
        >
          ←
        </button>
        <h2 className="text-sm font-bold">
          {MESES[data.month - 1]} {data.year}
        </h2>
        <button
          onClick={nextMonth}
          disabled={loading}
          className="w-8 h-8 rounded-lg bg-bg-card-2 border border-border text-text-dim hover:text-text disabled:opacity-40"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-text-dim font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1.5 transition-opacity ${loading ? "opacity-40" : "opacity-100"}`}>
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {data.days.map((d) => (
          <DayCell key={d.fecha} day={d} />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-5 text-[10px] text-text-dim">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-green to-emerald-600" /> 100%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-purple to-pink opacity-60" /> Parcial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-bg-card-2 border border-border" /> Sin marcar
        </span>
        <span>🏋️ Entrenaste</span>
      </div>
    </div>
  );
}

function DayCell({ day }: { day: import("@/types").CalendarDay }) {
  if (day.esFuturo) {
    return (
      <div className="aspect-square rounded-lg border border-border/40 flex items-center justify-center text-[11px] text-text-dim/40">
        {day.dia}
      </div>
    );
  }

  const hasHabits = day.totalHabitos > 0;
  const bgStyle =
    hasHabits && day.pct >= 100
      ? "bg-gradient-to-br from-green to-emerald-600 text-white"
      : hasHabits && day.pct > 0
      ? "bg-gradient-to-br from-purple to-pink text-white"
      : "bg-bg-card-2 text-text-dim";

  const opacity = hasHabits && day.pct > 0 && day.pct < 100 ? { opacity: 0.35 + (day.pct / 100) * 0.65 } : undefined;

  return (
    <div
      title={hasHabits ? `${day.completadas}/${day.totalHabitos} hábitos (${day.pct}%)` : "Sin hábitos ese día"}
      style={opacity}
      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[11px] font-semibold relative ${bgStyle} ${
        day.esHoy ? "ring-2 ring-purple-light" : ""
      }`}
    >
      {day.dia}
      {day.entreno && <span className="absolute bottom-0.5 right-0.5 text-[8px]">🏋️</span>}
    </div>
  );
}
