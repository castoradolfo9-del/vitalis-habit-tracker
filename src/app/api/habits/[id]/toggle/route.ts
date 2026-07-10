import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/dates";
import { recalcStreaksAndBadges } from "@/lib/stats";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const { id } = await params;

  const habit = await prisma.habit.findUnique({ where: { id } });
  if (!habit || habit.userId !== userId) return NextResponse.json({ error: "not found" }, { status: 404 });

  const today = todayUTC();
  const existing = await prisma.habitLog.findUnique({ where: { habitId_date: { habitId: id, date: today } } });

  let nowCompleted: boolean;
  if (!existing) {
    await prisma.habitLog.create({ data: { habitId: id, userId, date: today, completed: true } });
    nowCompleted = true;
  } else {
    nowCompleted = !existing.completed;
    await prisma.habitLog.update({ where: { id: existing.id }, data: { completed: nowCompleted, completedAt: new Date() } });
  }

  const xpDelta = nowCompleted ? habit.xpValue : -habit.xpValue;
  const tasksDelta = nowCompleted ? 1 : -1;

  await prisma.userStats.upsert({
    where: { userId },
    update: { xpTotal: { increment: xpDelta }, tasksCompleted: { increment: tasksDelta } },
    create: { userId, xpTotal: Math.max(0, xpDelta), tasksCompleted: Math.max(0, tasksDelta) },
  });

  const newlyUnlocked = await recalcStreaksAndBadges(userId);
  return NextResponse.json({ ok: true, newlyUnlockedBadges: newlyUnlocked });
}
