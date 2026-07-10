export const DIFICULTAD_XP: Record<string, number> = { Facil: 5, Media: 10, Dificil: 20 };
export const CARDIO_INTENSIDAD_XP: Record<string, number> = { Baja: 5, Media: 10, Alta: 15 };

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  levelPct: number;
}

export function levelFromXP(xp: number): LevelInfo {
  let level = 1;
  let remaining = xp;
  let xpForNext = 100;
  while (remaining >= xpForNext) {
    remaining -= xpForNext;
    level++;
    xpForNext = 100 + (level - 1) * 50;
  }
  return { level, xpIntoLevel: remaining, xpForNext, levelPct: Math.round((remaining / xpForNext) * 100) };
}

export function calcGymXP(
  entreno: boolean,
  calificacion: number,
  cardio: boolean,
  cardioMinutos: number,
  cardioIntensidad: string
): number {
  let xp = 0;
  if (entreno) xp += 15 + (Math.max(1, Math.min(5, calificacion)) - 1) * 5; // 15 a 35 XP
  if (cardio) {
    xp += CARDIO_INTENSIDAD_XP[cardioIntensidad] || 0;
    xp += Math.floor((cardioMinutos || 0) / 10) * 2;
  }
  return xp;
}

/** yyyy-MM-dd en UTC, para comparar días sin horas/zona horaria */
export function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayStr(): string {
  return dateStr(new Date());
}

export function yearMonth(d: Date): string {
  return d.toISOString().slice(0, 7); // yyyy-MM
}

export function dayOfYear(d: Date): number {
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0));
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export interface BadgeDef {
  code: string;
  nombre: string;
  descripcion: string;
  icono: string;
  tipo: "racha" | "nivel" | "tareas" | "racha_gym";
  umbral: number;
}

export const BADGE_DEFS: BadgeDef[] = [
  { code: "primer_paso", nombre: "Primer Paso", descripcion: "Completa tu primer hábito", icono: "🌱", tipo: "tareas", umbral: 1 },
  { code: "racha_3", nombre: "Encendiendo Motores", descripcion: "Racha de 3 días", icono: "🔥", tipo: "racha", umbral: 3 },
  { code: "racha_7", nombre: "Una Semana Fuerte", descripcion: "Racha de 7 días", icono: "⚡", tipo: "racha", umbral: 7 },
  { code: "racha_30", nombre: "Imparable", descripcion: "Racha de 30 días", icono: "👑", tipo: "racha", umbral: 30 },
  { code: "nivel_5", nombre: "Subiendo de Nivel", descripcion: "Alcanza el nivel 5", icono: "⭐", tipo: "nivel", umbral: 5 },
  { code: "nivel_10", nombre: "Veterano", descripcion: "Alcanza el nivel 10", icono: "🏆", tipo: "nivel", umbral: 10 },
  { code: "tareas_50", nombre: "Constancia", descripcion: "50 tareas completadas", icono: "💪", tipo: "tareas", umbral: 50 },
  { code: "tareas_200", nombre: "Leyenda", descripcion: "200 tareas completadas", icono: "🐉", tipo: "tareas", umbral: 200 },
  { code: "gym_racha_7", nombre: "Semana de Hierro", descripcion: "Racha de gym de 7 días", icono: "🏋️", tipo: "racha_gym", umbral: 7 },
  { code: "gym_racha_30", nombre: "Máquina de Entrenar", descripcion: "Racha de gym de 30 días", icono: "🦾", tipo: "racha_gym", umbral: 30 },
];

export function checkNewlyUnlockedBadges(
  alreadyUnlocked: Set<string>,
  stats: { xpTotal: number; habitStreak: number; gymStreak: number; tasksCompleted: number }
): BadgeDef[] {
  const level = levelFromXP(stats.xpTotal).level;
  return BADGE_DEFS.filter((b) => {
    if (alreadyUnlocked.has(b.code)) return false;
    if (b.tipo === "racha") return stats.habitStreak >= b.umbral;
    if (b.tipo === "nivel") return level >= b.umbral;
    if (b.tipo === "tareas") return stats.tasksCompleted >= b.umbral;
    if (b.tipo === "racha_gym") return stats.gymStreak >= b.umbral;
    return false;
  });
}
