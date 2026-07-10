import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/dates";
import { calcGymXP } from "@/lib/gamification";
import { recalcStreaksAndBadges } from "@/lib/stats";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { entreno, calificacion, cardio, cardioMinutos, cardioIntensidad } = await req.json();
  const today = todayUTC();

  const existing = await prisma.gymLog.findUnique({ where: { userId_date: { userId, date: today } } });
  const newXP = calcGymXP(!!entreno, Number(calificacion) || 0, !!cardio, Number(cardioMinutos) || 0, cardioIntensidad || "Media");
  const oldXP = existing?.xpEarned ?? 0;

  await prisma.gymLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: {
      trained: !!entreno,
      rating: Number(calificacion) || 0,
      cardio: !!cardio,
      cardioMinutes: Number(cardioMinutos) || 0,
      cardioIntensity: cardioIntensidad || "Media",
      xpEarned: newXP,
    },
    create: {
      userId,
      date: today,
      trained: !!entreno,
      rating: Number(calificacion) || 0,
      cardio: !!cardio,
      cardioMinutes: Number(cardioMinutos) || 0,
      cardioIntensity: cardioIntensidad || "Media",
      xpEarned: newXP,
    },
  });

  await prisma.userStats.upsert({
    where: { userId },
    update: { xpTotal: { increment: newXP - oldXP } },
    create: { userId, xpTotal: Math.max(0, newXP) },
  });

  const newlyUnlocked = await recalcStreaksAndBadges(userId);
  return NextResponse.json({ ok: true, newlyUnlockedBadges: newlyUnlocked });
}
