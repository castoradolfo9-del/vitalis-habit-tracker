import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIFICULTAD_XP } from "@/lib/gamification";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { nombre, icono, categoria, dificultad } = await req.json();
  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    return NextResponse.json({ error: "El hábito necesita un nombre" }, { status: 400 });
  }

  const dif = ["Facil", "Media", "Dificil"].includes(dificultad) ? dificultad : "Media";

  await prisma.habit.create({
    data: {
      userId: session.user.id,
      name: nombre.trim(),
      icon: icono || "⭐",
      category: categoria || "General",
      difficulty: dif,
      xpValue: DIFICULTAD_XP[dif] ?? 10,
    },
  });

  return NextResponse.json({ ok: true });
}
