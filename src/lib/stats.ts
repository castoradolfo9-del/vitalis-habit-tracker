import { prisma } from "@/lib/prisma";
import { todayUTC, daysAgoUTC, startOfMonthUTC, startOfNextMonthUTC, dateKey, DIAS_SEMANA } from "@/lib/dates";
import { BADGE_DEFS, checkNewlyUnlockedBadges, type BadgeDef } from "@/lib/gamification";

/** racha de hábitos: días consecutivos completando el 100% de los hábitos activos */
export async function recalcHabitStreak(userId: string): Promise<{ current: number; max: number }> {
  const activeCount = await prisma.habit.count({ where: { userId, active: true } });
  const stats = await prisma.userStats.findUnique({ where: { userId } });
  if (activeCount === 0) {
    return { current: 0, max: stats?.habitStreakMax ?? 0 };
  }

  const logs = await prisma.habitLog.groupBy({
    by: ["date"],
    where: { userId, completed: true },
    _count: { _all: true },
  });
  const countByDate = new Map<string, number>();
  logs.forEach((l) => countByDate.set(dateKey(l.date), l._count._all));

  let streak = 0;
  let cursor = todayUTC();
  if ((countByDate.get(dateKey(cursor)) ?? 0) < activeCount) {
    cursor = daysAgoUTC(1);
  }
  while ((countByDate.get(dateKey(cursor)) ?? 0) >= activeCount) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const max = Math.max(stats?.habitStreakMax ?? 0, streak);
  return { current: streak, max };
}

/** racha de gimnasio: días consecutivos con "entrenaste hoy" = true */
export async function recalcGymStreak(userId: string): Promise<{ current: number; max: number }> {
  const logs = await prisma.gymLog.findMany({ where: { userId, trained: true }, select: { date: true } });
  const trainedDates = new Set(logs.map((l) => dateKey(l.date)));
  const stats = await prisma.userStats.findUnique({ where: { userId } });

  let streak = 0;
  let cursor = todayUTC();
  if (!trainedDates.has(dateKey(cursor))) cursor = daysAgoUTC(1);
  while (trainedDates.has(dateKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const max = Math.max(stats?.gymStreakMax ?? 0, streak);
  return { current: streak, max };
}

/** recalcula ambas rachas + detecta y persiste badges nuevos. Devuelve los badges recién desbloqueados (para el toast). */
export async function recalcStreaksAndBadges(userId: string): Promise<BadgeDef[]> {
  const [habitStreak, gymStreak] = await Promise.all([recalcHabitStreak(userId), recalcGymStreak(userId)]);

  const stats = await prisma.userStats.update({
    where: { userId },
    data: {
      habitStreak: habitStreak.current,
      habitStreakMax: habitStreak.max,
      gymStreak: gymStreak.current,
      gymStreakMax: gymStreak.max,
    },
  });

  const unlockedRows = await prisma.userBadge.findMany({ where: { userId }, select: { badgeCode: true } });
  const alreadyUnlocked = new Set(unlockedRows.map((r) => r.badgeCode));

  const newlyUnlocked = checkNewlyUnlockedBadges(alreadyUnlocked, {
    xpTotal: stats.xpTotal,
    habitStreak: stats.habitStreak,
    gymStreak: stats.gymStreak,
    tasksCompleted: stats.tasksCompleted,
  });

  if (newlyUnlocked.length > 0) {
    await Promise.all(
      newlyUnlocked.map((b) =>
        prisma.userBadge.upsert({
          where: { userId_badgeCode: { userId, badgeCode: b.code } },
          update: {},
          create: { userId, badgeCode: b.code },
        })
      )
    );
  }

  return newlyUnlocked;
}

export async function getMonthlyCounts(userId: string): Promise<Record<string, number>> {
  const rows = await prisma.habitLog.groupBy({
    by: ["habitId"],
    where: { userId, completed: true, date: { gte: startOfMonthUTC(), lt: startOfNextMonthUTC() } },
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  rows.forEach((r) => (out[r.habitId] = r._count._all));
  return out;
}

async function getWeeklyGymSeries(userId: string, metric: "calories" | "steps") {
  const from = daysAgoUTC(6);
  const rows = await prisma.gymLog.findMany({
    where: { userId, date: { gte: from } },
    select: { date: true, calories: true, steps: true },
  });
  const byDate = new Map(rows.map((r) => [dateKey(r.date), metric === "calories" ? r.calories : r.steps]));

  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = daysAgoUTC(i);
    out.push({ fecha: dateKey(d), dia: DIAS_SEMANA[d.getUTCDay()], valor: byDate.get(dateKey(d)) ?? 0 });
  }
  return out;
}

export async function getWeeklyCalories(userId: string) {
  const rows = await getWeeklyGymSeries(userId, "calories");
  return rows.map((r) => ({ fecha: r.fecha, dia: r.dia, calorias: r.valor }));
}

export async function getWeeklySteps(userId: string) {
  const rows = await getWeeklyGymSeries(userId, "steps");
  return rows.map((r) => ({ fecha: r.fecha, dia: r.dia, pasos: r.valor }));
}

export function badgesForDisplay(unlockedCodes: Set<string>) {
  return BADGE_DEFS.map((b) => ({
    id: b.code,
    nombre: b.nombre,
    descripcion: b.descripcion,
    icono: b.icono,
    desbloqueado: unlockedCodes.has(b.code),
  }));
}
