"use client";

import { useState } from "react";
import type { GymDTO } from "@/types";

interface Props {
  gym: GymDTO;
  onSave: (entreno: boolean, calificacion: number, cardio: boolean, cardioMinutos: number, cardioIntensidad: string) => void;
}

// El padre pasa key={gym.racha + gym.calorias} para remontar este componente
// si los datos de gym cambian por una vía externa a sus propias interacciones.
export default function GymCard({ gym, onSave }: Props) {
  const [entreno, setEntreno] = useState(gym.entreno);
  const [calificacion, setCalificacion] = useState(gym.calificacion);
  const [cardio, setCardio] = useState(gym.cardio);
  const [cardioMinutos, setCardioMinutos] = useState(gym.cardioMinutos);
  const [cardioIntensidad, setCardioIntensidad] = useState(gym.cardioIntensidad);

  function toggleEntreno() {
    const next = !entreno;
    const nextCalif = !next ? 0 : calificacion || 3;
    setEntreno(next);
    setCalificacion(nextCalif);
    onSave(next, nextCalif, cardio, cardioMinutos, cardioIntensidad);
  }

  function clickStar(n: number) {
    setCalificacion(n);
    setEntreno(true);
    onSave(true, n, cardio, cardioMinutos, cardioIntensidad);
  }

  function toggleCardio() {
    const next = !cardio;
    setCardio(next);
    onSave(entreno, calificacion, next, cardioMinutos, cardioIntensidad);
  }

  function commitCardioFields(minutos: number, intensidad: string) {
    setCardioMinutos(minutos);
    setCardioIntensidad(intensidad);
    onSave(entreno, calificacion, cardio, minutos, intensidad);
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-3 mb-2">
      <Switch label="¿Entrenaste hoy?" on={entreno} onClick={toggleEntreno} />

      <div className="flex gap-1 mb-2.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => clickStar(n)}
            className={`text-xl cursor-pointer transition-all ${n <= calificacion ? "opacity-100" : "opacity-30 grayscale"}`}
          >
            ★
          </span>
        ))}
      </div>

      <Switch label="¿Hiciste cardio?" on={cardio} onClick={toggleCardio} />

      {cardio && (
        <div className="flex gap-2 mb-2.5">
          <div className="flex-1">
            <label className="text-[11px] text-text-dim block mb-1">Minutos</label>
            <input
              type="number"
              min={0}
              defaultValue={cardioMinutos}
              onBlur={(e) => commitCardioFields(Number(e.target.value) || 0, cardioIntensidad)}
              className="w-full px-2 py-1.5 rounded-lg border border-border bg-bg-card-2 text-text text-xs outline-none focus:border-purple"
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] text-text-dim block mb-1">Intensidad</label>
            <select
              value={cardioIntensidad}
              onChange={(e) => commitCardioFields(cardioMinutos, e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg border border-border bg-bg-card-2 text-text text-xs outline-none focus:border-purple"
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
        </div>
      )}

      <div className="text-[11px] text-text-dim text-center pt-1 border-t border-border">
        🔥 Racha de entrenamiento: {gym.racha} día{gym.racha === 1 ? "" : "s"} (máx {gym.rachaMaxima})
      </div>
    </div>
  );
}

function Switch({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <div className="flex justify-between items-center mb-2.5 text-xs">
      <span>{label}</span>
      <div
        onClick={onClick}
        className={`w-10 h-[22px] rounded-full border relative cursor-pointer transition-colors shrink-0 ${
          on ? "bg-gradient-to-br from-purple to-pink border-transparent" : "bg-bg-card-2 border-border"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${on ? "left-5" : "left-0.5"}`}
        />
      </div>
    </div>
  );
}
