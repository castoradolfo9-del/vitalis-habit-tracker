export interface HabitDTO {
  id: string;
  nombre: string;
  icono: string;
  categoria: string;
  dificultad: string;
  xp: number;
  completado: boolean;
  meta: number;
  progresoMes: number;
}

export interface BadgeDTO {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  desbloqueado: boolean;
}

export interface GymDTO {
  entreno: boolean;
  calificacion: number;
  cardio: boolean;
  cardioMinutos: number;
  cardioIntensidad: string;
  calorias: number;
  pasos: number;
  racha: number;
  rachaMaxima: number;
}

export interface StatsDTO {
  xpTotal: number;
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  levelPct: number;
  racha: number;
  rachaMaxima: number;
  hechasHoy: number;
  totalHoy: number;
  completionPct: number;
  tareasTotales: number;
}

export interface WeeklyCalorieDay {
  fecha: string;
  dia: string;
  calorias: number;
}

export interface WeeklyStepDay {
  fecha: string;
  dia: string;
  pasos: number;
}

export interface CalendarDay {
  fecha: string;
  dia: number;
  completadas: number;
  totalHabitos: number;
  pct: number;
  entreno: boolean;
  esHoy: boolean;
  esFuturo: boolean;
}

export interface CalendarResponse {
  year: number;
  month: number; // 1-12
  days: CalendarDay[];
}

export interface DashboardData {
  habits: HabitDTO[];
  stats: StatsDTO;
  badges: BadgeDTO[];
  gym: GymDTO;
  weeklyCalories: WeeklyCalorieDay[];
  weeklyCaloriesTotal: number;
  weeklySteps: WeeklyStepDay[];
  weeklyStepsTotal: number;
  quote: { texto: string; autor: string };
  todayKey: string;
}
