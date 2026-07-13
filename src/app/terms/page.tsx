import Link from "next/link";

export const metadata = { title: "Términos de Servicio — Vitalis" };

export default function TermsPage() {
  return (
    <div className="flex-1 bg-bg text-text px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-text-dim hover:text-text">← Volver</Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Términos de Servicio</h1>
        <p className="text-xs text-text-dim mb-8">Última actualización: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-6 text-sm leading-relaxed text-text-dim">
          <Section title="1. El servicio">
            <p>
              Vitalis es una aplicación de seguimiento de hábitos con elementos de gamificación (XP, niveles, rachas, logros). Actualmente el servicio es gratuito; si en el futuro se introducen planes de pago, se te notificará con anticipación y estos términos se actualizarán en consecuencia.
            </p>
          </Section>

          <Section title="2. Tu cuenta">
            <p>
              Eres responsable de mantener segura tu contraseña y de toda la actividad que ocurra en tu cuenta. Debes darnos un email válido y no compartir tu cuenta con terceros.
            </p>
          </Section>

          <Section title="3. Aviso importante: no es consejo médico">
            <p>
              Vitalis te permite registrar entrenamientos, calorías y pasos con fines de seguimiento personal y motivación. <strong className="text-text">No sustituye el consejo de un profesional de la salud, nutriólogo o entrenador certificado.</strong> Las cifras de XP, niveles y logros son elementos de juego, no recomendaciones médicas. Consulta a un profesional antes de iniciar cualquier rutina de ejercicio o cambio significativo en tu alimentación.
            </p>
          </Section>

          <Section title="4. Uso aceptable">
            <p>
              No está permitido usar Vitalis para actividades ilegales, intentar acceder a cuentas de otras personas, ni intentar interrumpir el funcionamiento del servicio (ataques automatizados, fuerza bruta, scraping masivo, etc.).
            </p>
          </Section>

          <Section title="5. Tus datos">
            <p>
              El detalle de qué recolectamos y cómo lo protegemos está en nuestra{" "}
              <Link href="/privacy" className="underline">Política de Privacidad</Link>. En resumen: son tuyos, puedes descargarlos o borrarlos por completo en cualquier momento desde la sección Cuenta.
            </p>
          </Section>

          <Section title="6. Disponibilidad del servicio">
            <p>
              Hacemos lo posible por mantener el servicio disponible, pero al ser un proyecto en etapa temprana no garantizamos disponibilidad ininterrumpida (uptime). Te recomendamos descargar tus datos periódicamente si te preocupa la continuidad del servicio.
            </p>
          </Section>

          <Section title="7. Cancelación">
            <p>
              Puedes eliminar tu cuenta cuando quieras desde la sección Cuenta — la eliminación es inmediata y permanente. Nos reservamos el derecho de suspender cuentas que violen estos términos.
            </p>
          </Section>

          <Section title="8. Cambios a estos términos">
            <p>
              Podemos actualizar estos términos ocasionalmente. Los cambios importantes se notificarán con anticipación razonable.
            </p>
          </Section>

          <Section title="9. Ley aplicable">
            <p>
              Estos términos se rigen por las leyes de [agrega aquí tu país/jurisdicción].
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Preguntas sobre estos términos: <span className="text-text">[agrega aquí tu email de contacto]</span>.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-text mb-2">{title}</h2>
      {children}
    </section>
  );
}
