# Vitalis — Habit Tracker Gamificado

MVP full-stack: Next.js 16 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL + NextAuth.
Multi-usuario, instalable como PWA en iPhone/Android, listo para desplegar gratis en Vercel + Neon.

## 1. Correrlo en local

Necesitas Node.js 20+ y una base de datos Postgres. La forma más rápida de tener una gratis es [Neon](https://neon.tech) (ver paso 2), pero para desarrollar puedes usar cualquier Postgres.

```bash
npm install
cp .env.example .env
# edita .env con tu DATABASE_URL y un AUTH_SECRET (genera uno con: openssl rand -base64 32)
npx prisma db push   # crea las tablas en tu base de datos
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 2. Desplegar en producción (gratis)

### 2.1 Base de datos — Neon

1. Crea una cuenta en [neon.tech](https://neon.tech) (gratis, no pide tarjeta).
2. Crea un proyecto nuevo → copia el **Connection string** (empieza con `postgresql://...`).
3. Guárdalo, lo vas a necesitar en el paso 2.3.

### 2.2 Subir el código a GitHub

```bash
git add -A
git commit -m "Initial commit"
```
Crea un repositorio en GitHub y sigue las instrucciones para subir (`git remote add origin ...`, `git push`).

### 2.3 Desplegar en Vercel

1. Crea una cuenta en [vercel.com](https://vercel.com) (puedes entrar con tu cuenta de GitHub).
2. **Add New → Project** → importa tu repositorio.
3. En **Environment Variables** agrega:
   - `DATABASE_URL` → el connection string de Neon del paso 2.1
   - `AUTH_SECRET` → genera uno nuevo con `openssl rand -base64 32`
4. Click **Deploy**.
5. Una vez desplegado, corre las migraciones contra la base de datos de producción (una sola vez, desde tu máquina, apuntando temporalmente tu `.env` local al `DATABASE_URL` de Neon):
   ```bash
   npx prisma db push
   ```

Tu app queda en una URL tipo `https://tu-proyecto.vercel.app`. Cada vez que hagas `git push`, Vercel despliega automáticamente.

## 3. Instalarla en el celular (PWA)

1. Abre la URL de tu app (la de Vercel, o tu dominio propio) en **Safari** (iPhone) o **Chrome** (Android).
2. iPhone: toca compartir → **"Agregar a pantalla de inicio"**.
   Android: Chrome mostrará un banner **"Instalar app"**, o desde el menú ⋮ → "Instalar app".
3. Queda un ícono como app nativa, a pantalla completa, sin la barra del navegador.

## Arquitectura

- **`prisma/schema.prisma`** — esquema de base de datos (User, Habit, HabitLog, GymLog, UserStats, UserBadge).
- **`src/lib/`** — lógica de negocio pura y acceso a datos:
  - `gamification.ts` — XP, niveles, definición de badges (reutilizable, sin dependencias de DB).
  - `dates.ts` — utilidades de fecha en UTC.
  - `stats.ts` — cálculo de rachas y desbloqueo de badges (usa Prisma).
  - `dashboard.ts` — arma el payload agregado del dashboard (usa Prisma).
  - `auth.ts` — configuración de NextAuth (Credentials + bcrypt).
  - `quotes.ts` — frases estoicas y selección determinista por día.
- **`src/app/api/`** — endpoints REST (ver tabla de abajo).
- **`src/components/`** — UI del dashboard (todo cliente, Tailwind, tema morado/negro).
- **`src/proxy.ts`** — protege `/app/*`, redirige a `/login` si no hay sesión (convención `proxy` de Next.js 16, reemplaza a `middleware`).

## Endpoints de API

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/auth/register` | Crea cuenta |
| * | `/api/auth/[...nextauth]` | Login/logout/sesión (NextAuth) |
| GET | `/api/dashboard` | Todo el estado del dashboard en una llamada |
| POST | `/api/habits` | Crear hábito |
| PATCH | `/api/habits/:id` | Editar hábito (nombre, ícono, categoría, meta mensual) |
| DELETE | `/api/habits/:id` | Borrado suave (`active=false`) |
| POST | `/api/habits/:id/toggle` | Marcar/desmarcar completado hoy |
| POST | `/api/gym` | Guardar entreno/cardio de hoy |
| POST | `/api/calories` | Guardar kcal de hoy |
| POST | `/api/steps` | Guardar pasos de hoy |

Todas las rutas (excepto register/login) requieren sesión y filtran siempre por `userId` de la sesión — nunca confían en un `userId` que venga del cliente.

## Cosas a decidir antes de lanzar públicamente

Estas quedaron fuera del MVP a propósito (para no bloquear el lanzamiento), pero conviene resolverlas pronto:

- **Nombre y dominio**: "Vitalis" es un nombre placeholder — cámbialo en `layout.tsx`, `manifest.json` y el ícono si quieres otro.
- **Verificación de email**: hoy cualquier email funciona sin confirmarse. Para producción real, agregar verificación evita cuentas falsas.
- **Recuperar contraseña**: no existe todavía un flujo de "olvidé mi contraseña".
- **Cobros**: el campo `plan` en `User` ya existe (`free` por defecto) — cuando quieras cobrar, se integra Stripe sin tocar el resto del esquema.
- **Rate limiting**: los endpoints no tienen límite de requests; para un lanzamiento público conviene agregarlo (ej. con Vercel Firewall o Upstash).
