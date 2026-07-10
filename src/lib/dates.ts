export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Medianoche UTC de hoy — usamos UTC en todo el backend para evitar ambigüedad de zona horaria en columnas @db.Date */
export function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function daysAgoUTC(n: number): Date {
  const d = todayUTC();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

export function addDaysUTC(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setUTCDate(copy.getUTCDate() + n);
  return copy;
}

export function startOfMonthUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function startOfNextMonthUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}
