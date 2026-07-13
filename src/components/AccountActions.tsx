"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AccountActions() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch("/api/account", { method: "DELETE" });
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="flex flex-col gap-3">
      <a
        href="/api/account/export"
        className="block text-center py-2.5 rounded-lg text-sm font-semibold bg-bg-card-2 border border-border hover:border-purple transition-colors"
      >
        📥 Descargar mis datos
      </a>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="py-2.5 rounded-lg text-sm font-semibold bg-bg-card-2 border border-pink/40 text-pink hover:bg-pink/10 transition-colors"
        >
          Eliminar mi cuenta
        </button>
      ) : (
        <div className="rounded-lg border border-pink/40 bg-pink/5 p-3">
          <p className="text-xs text-text-dim mb-2">
            Esto borra tu cuenta y <strong>todos</strong> tus hábitos, registros y logros de forma permanente. No se puede deshacer.
            Escribe <strong>ELIMINAR</strong> para confirmar.
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-bg-card-2 text-text text-sm outline-none focus:border-pink mb-2"
            placeholder="ELIMINAR"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowConfirm(false); setConfirmText(""); }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-bg-card-2 text-text-dim"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== "ELIMINAR" || deleting}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-pink text-white disabled:opacity-40"
            >
              {deleting ? "Eliminando..." : "Confirmar eliminación"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
