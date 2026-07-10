import { prisma } from "@/lib/prisma";
import { todayUTC, dateKey } from "@/lib/dates";
import { levelFromXP } from "@/lib/gamification";
import { getMonthlyCounts, getWeeklyCalories, getWeeklySteps, badgesForDisplay } from "@/lib/stats";
import { getDailyQuote } from "@/lib/quotes";
import type { DashboardData } from "@/types";

export async function buildDashboardData(userId: string): Promise<DashboardData> {
  const today = todayUTC();

  const [habits, todayLogs, monthlyCounts, stats, unlockedBadges, gymToday, weeklyCalories, weeklySteps] = await Promise.all([
    prisma.habit.findMany({ where: { userId, active: true }, orderBy: { createdAt: "asc" } }),
    prisma.habitLog.findMany({ where: { userId, date: today, completed: true }, select: { habitId: true } }),
    getMonthlyCounts(userId),
    prisma.userStats.upsert({ where: { userId }, update: {}, create: { userId } }),
    prisma.userBadge.findMany({ where: { userId }, select: { badgeCode: true } }),
    prisma.gymLog.findUnique({ where: { userId_date: { userId, date: today } } }),
    getWeeklyCalories(userId),
    getWeeklySteps(userId),
  ]);

  const completedTodayIds = new Set(todayLogs.map((l) => l.habitId));

  const habitsOut = habits.map((h) => ({
    id: h.id,
    nombre: h.name,
    icono: h.icon,
    categoria: h.category,
    dificultad: h.difficulty,
    xp: h.xpValue,
    completado: completedTodayIds.has(h.id),
    meta: h.monthlyGoal,
    progresoMes: monthlyCounts[h.id] ?? 0,
  }));

  const totalHoy = habitsOut.length;
  const hechasHoy = habitsOut.filter((h) => h.completado).length;
  const completionPct = totalHoy === 0 ? 0 : Math.round((hechasHoy / totalHoy) * 100);

  const levelInfo = levelFromXP(stats.xpTotal);
  const unlockedSet = new Set(unlockedBadges.map((b) => b.badgeCode));
  const weeklyCaloriesTotal = weeklyCalories.reduce((sum, d) => sum + d.calorias, 0);
  const weeklyStepsTotal = weeklySteps.reduce((sum, d) => sum + d.pasos, 0);

  return {
    habits: habitsOut,
    stats: {
      xpTotal: stats.xpTotal,
      level: levelInfo.level,
      xpIntoLevel: levelInfo.xpIntoLevel,
      xpForNext: levelInfo.xpForNext,
      levelPct: levelInfo.levelPct,
      racha: stats.habitStreak,
      rachaMaxima: stats.habitStreakMax,
      hechasHoy,
      totalHoy,
      completionPct,
      tareasTotales: stats.tasksCompleted,
    },
    badges: badgesForDisplay(unlockedSet),
    gym: {
      entreno: gymToday?.trained ?? false,
      calificacion: gymToday?.rating ?? 0,
      cardio: gymToday?.cardio ?? false,
      cardioMinutos: gymToday?.cardioMinutes ?? 0,
      cardioIntensidad: gymToday?.cardioIntensity ?? "Media",
      calorias: gymToday?.calories ?? 0,
      pasos: gymToday?.steps ?? 0,
      racha: stats.gymStreak,
      rachaMaxima: stats.gymStreakMax,
    },
    weeklyCalories,
    weeklyCaloriesTotal,
    weeklySteps,
    weeklyStepsTotal,
    quote: getDailyQuote(),
    todayKey: dateKey(today),
  };
}
