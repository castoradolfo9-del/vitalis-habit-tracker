import { prisma } from "@/lib/prisma";
import {
  todayForTimezone,
  daysAgoForTimezone,
  startOfMonthForTimezone,
  startOfNextMonthForTimezone,
  dateKey,
  DIAS_SEMANA,
} from "@/lib/dates";
import { BADGE_DEFS, checkNewlyUnlockedBadges, type BadgeDef } from "@/lib/gamification";

/** racha de hábitos: días consecutivos completando el 100% de los hábitos activos */
export async function recalcHabitStreak(userId: string, timezone: string): Promise<{ current: number; max: number }> {
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
  let cursor = todayForTimezone(timezone);
  if ((countByDate.get(dateKey(cursor)) ?? 0) < activeCount) {
    cursor = daysAgoForTimezone(1, timezone);
  }
  while ((countByDate.get(dateKey(cursor)) ?? 0) >= activeCount) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const max = Math.max(stats?.habitStreakMax ?? 0, streak);
  return { current: streak, max };
}

/** racha de gimnasio: días consecutivos con "entrenaste hoy" = true */
export async function recalcGymStreak(userId: string, timezone: string): Promise<{ current: number; max: number }> {
  const logs = await prisma.gymLog.findMany({ where: { userId, trained: true }, select: { date: true } });
  const trainedDates = new Set(logs.map((l) => dateKey(l.date)));
  const stats = await prisma.userStats.findUnique({ where: { userId } });

  let streak = 0;
  let cursor = todayForTimezone(timezone);
  if (!trainedDates.has(dateKey(cursor))) cursor = daysAgoForTimezone(1, timezone);
  while (trainedDates.has(dateKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const max = Math.max(stats?.gymStreakMax ?? 0, streak);
  return { current: streak, max };
}

/** recalcula ambas rachas + detecta y persiste badges nuevos. Devuelve los badges recién desbloqueados (para el toast). */
export async function recalcStreaksAndBadges(userId: string, timezone: string): Promise<BadgeDef[]> {
  const [habitStreak, gymStreak] = await Promise.all([
    recalcHabitStreak(userId, timezone),
    recalcGymStreak(userId, timezone),
  ]);

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

export async function getMonthlyCounts(userId: string, timezone: string): Promise<Record<string, number>> {
  const rows = await prisma.habitLog.groupBy({
    by: ["habitId"],
    where: {
      userId,
      completed: true,
      date: { gte: startOfMonthForTimezone(timezone), lt: startOfNextMonthForTimezone(timezone) },
    },
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  rows.forEach((r) => (out[r.habitId] = r._count._all));
  return out;
}

async function getWeeklyGymSeries(userId: string, timezone: string, metric: "calories" | "steps") {
  const from = daysAgoForTimezone(6, timezone);
  const rows = await prisma.gymLog.findMany({
    where: { userId, date: { gte: from } },
    select: { date: true, calories: true, steps: true },
  });
  const byDate = new Map(rows.map((r) => [dateKey(r.date), metric === "calories" ? r.calories : r.steps]));

  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = daysAgoForTimezone(i, timezone);
    out.push({ fecha: dateKey(d), dia: DIAS_SEMANA[d.getUTCDay()], valor: byDate.get(dateKey(d)) ?? 0 });
  }
  return out;
}

export async function getWeeklyCalories(userId: string, timezone: string) {
  const rows = await getWeeklyGymSeries(userId, timezone, "calories");
  return rows.map((r) => ({ fecha: r.fecha, dia: r.dia, calorias: r.valor }));
}

export async function getWeeklySteps(userId: string, timezone: string) {
  const rows = await getWeeklyGymSeries(userId, timezone, "steps");
  return rows.map((r) => ({ fecha: r.fecha, dia: r.dia, pasos: r.valor }));
}

export async function getMonthlyCalendar(userId: string, timezone: string, year: number, month: number) {
  const activeCount = await prisma.habit.count({ where: { userId, active: true } });
  const from = new Date(Date.UTC(year, month, 1));
  const to = new Date(Date.UTC(year, month + 1, 1));

  const [habitRows, gymRows] = await Promise.all([
    prisma.habitLog.groupBy({
      by: ["date"],
      where: { userId, completed: true, date: { gte: from, lt: to } },
      _count: { _all: true },
    }),
    prisma.gymLog.findMany({
      where: { userId, date: { gte: from, lt: to }, trained: true },
      select: { date: true },
    }),
  ]);

  const habitCountByDate = new Map(habitRows.map((r) => [dateKey(r.date), r._count._all]));
  const trainedDates = new Set(gymRows.map((r) => dateKey(r.date)));

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const todayKey = dateKey(todayForTimezone(timezone));

  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(Date.UTC(year, month, day));
    const key = dateKey(d);
    const completadas = habitCountByDate.get(key) ?? 0;
    days.push({
      fecha: key,
      dia: day,
      completadas,
      totalHabitos: activeCount,
      pct: activeCount === 0 ? 0 : Math.min(100, Math.round((completadas / activeCount) * 100)),
      entreno: trainedDates.has(key),
      esHoy: key === todayKey,
      esFuturo: key > todayKey,
    });
  }

  return days;
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
