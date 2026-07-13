import Link from "next/link";

export const metadata = { title: "Política de Privacidad — Vitalis" };

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-bg text-text px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-text-dim hover:text-text">← Volver</Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Política de Privacidad</h1>
        <p className="text-xs text-text-dim mb-8">Última actualización: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-6 text-sm leading-relaxed text-text-dim">
          <Section title="Qué datos recolectamos">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-text">Datos de cuenta:</strong> tu email y una contraseña, que nunca guardamos en texto plano — se almacena únicamente un hash (bcrypt) que no se puede revertir.</li>
              <li><strong className="text-text">Datos de la app:</strong> los hábitos que creas, si los marcaste completados cada día, tus metas mensuales, tus registros de gimnasio/cardio, y las calorías y pasos que ingreses manualmente.</li>
              <li><strong className="text-text">No recolectamos</strong> datos de ubicación, contactos, ni accedemos a sensores de tu dispositivo. Los pasos y calorías que registras los escribes tú mismo — hoy la app no se conecta automáticamente a tu smartwatch.</li>
            </ul>
          </Section>

          <Section title="Dónde se guardan tus datos">
            <p>
              Tu información se almacena en una base de datos PostgreSQL alojada en{" "}
              <a href="https://neon.tech" className="underline" target="_blank" rel="noreferrer">Neon</a> (infraestructura en AWS, EE.UU.), y la aplicación se ejecuta en{" "}
              <a href="https://vercel.com" className="underline" target="_blank" rel="noreferrer">Vercel</a>. Ambos proveedores cifran los datos en tránsito (HTTPS/TLS) y en reposo. No vendemos, alquilamos ni compartimos tus datos con anunciantes ni redes de rastreo — no usamos analítica de terceros con fines publicitarios.
            </p>
          </Section>

          <Section title="Cómo protegemos tu cuenta">
            <ul className="list-disc pl-5 space-y-1">
              <li>Contraseñas cifradas con bcrypt, nunca en texto plano.</li>
              <li>Toda la comunicación viaja cifrada por HTTPS.</li>
              <li>Límite de intentos de inicio de sesión y de creación de cuentas para dificultar ataques automatizados.</li>
              <li>Cada consulta a tus datos está siempre filtrada por tu cuenta — ningún otro usuario puede ver tu información.</li>
            </ul>
          </Section>

          <Section title="Tus derechos sobre tus datos">
            <p>
              Desde la sección <Link href="/app/account" className="underline">Cuenta</Link> dentro de la app puedes:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-text">Descargar</strong> una copia completa de todos tus datos en formato JSON.</li>
              <li><strong className="text-text">Eliminar tu cuenta</strong> permanentemente, lo que borra de inmediato todos tus hábitos, registros y logros de nuestra base de datos.</li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>
              Usamos únicamente una cookie de sesión, necesaria para mantenerte conectado (creada por nuestro sistema de autenticación). No usamos cookies de rastreo ni de publicidad.
            </p>
          </Section>

          <Section title="Cambios a esta política">
            <p>
              Si esta política cambia de forma importante, te lo notificaremos por correo o dentro de la app antes de que entre en vigor.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Si tienes preguntas sobre tus datos o esta política, escríbenos a{" "}
              <span className="text-text">[agrega aquí tu email de contacto]</span>.
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
