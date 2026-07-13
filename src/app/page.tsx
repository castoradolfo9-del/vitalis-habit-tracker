import Link from "next/link";

const FEATURES = [
  { icon: "🎯", title: "Metas mensuales", desc: "Define cuántas veces al mes quieres cada hábito y sigue tu progreso automáticamente." },
  { icon: "🔥", title: "Rachas", desc: "Racha de hábitos y racha de gimnasio, independientes, para mantenerte constante." },
  { icon: "💪", title: "Gimnasio y cardio", desc: "Registra si entrenaste, tu rendimiento y tu cardio en segundos." },
  { icon: "⌚", title: "Calorías y pasos del smartwatch", desc: "Vuelca tus calorías y pasos diarios y mira tu progreso semanal en gráficos." },
  { icon: "🏆", title: "XP, niveles y logros", desc: "Cada hábito completado suma XP. Sube de nivel y desbloquea insignias." },
  { icon: "❝", title: "Frase estoica diaria", desc: "Una cita de Marco Aurelio, Séneca o Epicteto distinta cada día." },
];

export default function Home() {
  return (
    <div className="flex-1 bg-bg text-text">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <nav className="flex items-center justify-between mb-20">
          <span className="text-lg font-bold">🎮 Vitalis</span>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-text-dim hover:text-text transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-br from-purple to-pink text-white"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-2xl mx-auto mb-24">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Gamifica tu vida.
            <br />
            <span className="bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
              Un hábito a la vez.
            </span>
          </h1>
          <p className="text-text-dim text-lg mb-8">
            Checklist diario, XP, niveles, rachas y metas mensuales — todo en un panel oscuro
            hecho para que quieras volver todos los días.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 rounded-xl font-semibold bg-gradient-to-br from-purple to-pink text-white hover:opacity-90 transition-opacity"
          >
            Empezar gratis
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-bg-card p-6">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-text-dim">{f.desc}</p>
            </div>
          ))}
        </div>

        <footer className="mt-24 text-center text-xs text-text-dim space-y-2">
          <p>Instalable en tu iPhone o Android como app — sin App Store.</p>
          <p className="flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-text">Privacidad</Link>
            <Link href="/terms" className="hover:text-text">Términos</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
