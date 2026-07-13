"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "No se pudo crear la cuenta");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-bg text-text px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-lg font-bold block text-center mb-8">🎮 Vitalis</Link>
        <div className="rounded-2xl border border-border bg-bg-card p-6">
          <h1 className="text-xl font-bold mb-1">Crear cuenta</h1>
          <p className="text-sm text-text-dim mb-6">Gratis, sin tarjeta</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-text-dim block mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-card-2 text-text text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs text-text-dim block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-card-2 text-text text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs text-text-dim block mb-1">Contraseña</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-card-2 text-text text-sm outline-none focus:border-purple"
              />
              <p className="text-[11px] text-text-dim mt-1">Mínimo 8 caracteres</p>
            </div>

            {error && <p className="text-sm text-pink">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 rounded-lg font-semibold bg-gradient-to-br from-purple to-pink text-white disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-[11px] text-text-dim text-center mt-4">
            Al crear una cuenta aceptas nuestros{" "}
            <Link href="/terms" className="underline">Términos</Link> y nuestra{" "}
            <Link href="/privacy" className="underline">Política de Privacidad</Link>.
          </p>
        </div>
        <p className="text-center text-sm text-text-dim mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-purple-light font-medium">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
