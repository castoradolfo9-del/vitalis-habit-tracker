import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const [user, habits, habitLogs, gymLogs, stats, badges] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, timezone: true, plan: true, createdAt: true },
    }),
    prisma.habit.findMany({ where: { userId } }),
    prisma.habitLog.findMany({ where: { userId } }),
    prisma.gymLog.findMany({ where: { userId } }),
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.userBadge.findMany({ where: { userId } }),
  ]);

  const exportData = {
    exportadoEl: new Date().toISOString(),
    cuenta: user,
    habitos: habits,
    registrosDeHabitos: habitLogs,
    registrosDeGimnasio: gymLogs,
    estadisticas: stats,
    logrosDesbloqueados: badges,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="vitalis-datos-${userId}.json"`,
    },
  });
}
