"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-bg text-text px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-lg font-bold block text-center mb-8">🎮 Vitalis</Link>
        <div className="rounded-2xl border border-border bg-bg-card p-6">
          <h1 className="text-xl font-bold mb-1">Iniciar sesión</h1>
          <p className="text-sm text-text-dim mb-6">Bienvenido de vuelta</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-card-2 text-text text-sm outline-none focus:border-purple"
              />
            </div>

            {error && <p className="text-sm text-pink">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 rounded-lg font-semibold bg-gradient-to-br from-purple to-pink text-white disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-text-dim mt-4">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="text-purple-light font-medium">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
