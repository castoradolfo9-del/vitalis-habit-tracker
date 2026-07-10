"use client";

import { useState } from "react";
import type { WeeklyStepDay } from "@/types";

interface Props {
  weeklySteps: WeeklyStepDay[];
  weeklyStepsTotal: number;
  onSave: (pasos: number) => void;
}

export default function StepsCard({ weeklySteps, weeklyStepsTotal, onSave }: Props) {
  const [value, setValue] = useState("");
  const max = Math.max(1, ...weeklySteps.map((d) => d.pasos));

  function submit() {
    if (!value) return;
    onSave(Number(value));
    setValue("");
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-3 mb-2">
      <div className="flex gap-2 mb-2.5">
        <input
          type="number"
          min={0}
          placeholder="Pasos de hoy"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-bg-card-2 text-text text-xs outline-none focus:border-purple"
        />
        <button
          onClick={submit}
          className="px-3.5 rounded-lg bg-purple-dark hover:bg-purple text-white text-xs font-bold"
        >
          Guardar
        </button>
      </div>

      <div className="flex items-end gap-1.5 h-20 mb-1">
        {weeklySteps.map((d) => (
          <div key={d.fecha} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              title={`${d.pasos.toLocaleString()} pasos`}
              className="w-full max-w-[22px] rounded-t-md rounded-b-sm bg-gradient-to-t from-green to-purple transition-[height] duration-500 ease-out"
              style={{ height: `${Math.round((d.pasos / max) * 100)}%`, minHeight: 3 }}
            />
            <div className="text-[9px] text-text-dim mt-1">{d.dia}</div>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-text-dim text-center pt-1 border-t border-border">
        Esta semana: {weeklyStepsTotal.toLocaleString()} pasos
      </div>
    </div>
  );
}
