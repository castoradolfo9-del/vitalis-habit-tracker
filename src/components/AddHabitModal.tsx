"use client";

import { useState } from "react";

interface Props {
  onCreate: (nombre: string, icono: string, categoria: string, dificultad: string) => void;
}

export default function AddHabitModal({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dificultad, setDificultad] = useState("Media");

  function close() {
    setOpen(false);
    setNombre("");
    setIcono("");
    setCategoria("");
    setDificultad("Media");
  }

  function submit() {
    if (!nombre.trim()) {
      alert("Ponle un nombre a tu hábito");
      return;
    }
    onCreate(nombre.trim(), icono.trim() || "⭐", categoria.trim() || "General", dificultad);
    close();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-[22px] h-[22px] rounded-lg bg-purple-dark hover:bg-purple text-white text-sm leading-none"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-10 px-6" onClick={close}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[260px] rounded-2xl border border-border bg-bg-card p-4.5"
          >
            <h3 className="text-sm font-bold mb-3">Nuevo hábito</h3>

            <Field label="Nombre">
              <input
                type="text"
                placeholder="Ej: Estudiar inglés"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-bg-card-2 text-text text-xs outline-none focus:border-purple"
              />
            </Field>
            <Field label="Icono (emoji)">
              <input
                type="text"
                placeholder="📖"
                maxLength={2}
                value={icono}
                onChange={(e) => setIcono(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-bg-card-2 text-text text-xs outline-none focus:border-purple"
              />
            </Field>
            <Field label="Categoría">
              <input
                type="text"
                placeholder="Personal"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-bg-card-2 text-text text-xs outline-none focus:border-purple"
              />
            </Field>
            <Field label="Dificultad">
              <select
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-bg-card-2 text-text text-xs outline-none focus:border-purple"
              >
                <option value="Facil">Fácil (+5 XP)</option>
                <option value="Media">Media (+10 XP)</option>
                <option value="Dificil">Difícil (+20 XP)</option>
              </select>
            </Field>

            <div className="flex gap-2 mt-3.5">
              <button onClick={close} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-bg-card-2 text-text-dim">
                Cancelar
              </button>
              <button
                onClick={submit}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-gradient-to-br from-purple to-pink text-white"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <label className="text-[11px] text-text-dim block mb-1">{label}</label>
      {children}
    </div>
  );
}
