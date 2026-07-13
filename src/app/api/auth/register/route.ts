import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, recordAttempt, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const allowed = await checkRateLimit(ip, "register");
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiadas cuentas creadas desde aquí. Espera un rato e inténtalo de nuevo." },
      { status: 429 }
    );
  }
  await recordAttempt(ip, "register");

  const { email, password, name } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email requerido y contraseña de al menos 8 caracteres" },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese email" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name || null,
      stats: { create: {} },
    },
  });

  // hábitos de ejemplo para que el usuario nuevo no vea el dashboard vacío
  await prisma.habit.createMany({
    data: [
      { userId: user.id, name: "Tomar 2L de agua", icon: "💧", category: "Salud", difficulty: "Facil", xpValue: 5, monthlyGoal: 24 },
      { userId: user.id, name: "Ejercicio 30 min", icon: "🏋️", category: "Salud", difficulty: "Media", xpValue: 10, monthlyGoal: 12 },
      { userId: user.id, name: "Leer 20 páginas", icon: "📚", category: "Personal", difficulty: "Media", xpValue: 10, monthlyGoal: 16 },
      { userId: user.id, name: "Meditar 10 min", icon: "🧘", category: "Personal", difficulty: "Facil", xpValue: 5, monthlyGoal: 20 },
    ],
  });

  return NextResponse.json({ ok: true });
}
