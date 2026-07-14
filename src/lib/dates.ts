export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/**
 * "Hoy" para un usuario se calcula según SU zona horaria, no UTC — si no,
 * cualquier cosa marcada después de las 6pm en México (UTC-6) ya cuenta
 * como "el día siguiente" en UTC, y el checklist no avanza hasta la
 * mañana siguiente en horario UTC (~medianoche hora local).
 *
 * El resultado sigue siendo un Date a medianoche UTC — así encaja tal
 * cual con las columnas @db.Date de Postgres — pero representa el día
 * calendario correcto según la hora local del usuario.
 */
export function todayForTimezone(timezone: string): Date {
  return dateForTimezone(new Date(), timezone);
}

export function dateForTimezone(date: Date, timezone: string): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(date);
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function daysAgoForTimezone(n: number, timezone: string): Date {
  const d = todayForTimezone(timezone);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

export function addDaysUTC(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setUTCDate(copy.getUTCDate() + n);
  return copy;
}

export function startOfMonthForTimezone(timezone: string, year?: number, month?: number): Date {
  const today = todayForTimezone(timezone);
  const y = year ?? today.getUTCFullYear();
  const m = month ?? today.getUTCMonth();
  return new Date(Date.UTC(y, m, 1));
}

export function startOfNextMonthForTimezone(timezone: string, year?: number, month?: number): Date {
  const today = todayForTimezone(timezone);
  const y = year ?? today.getUTCFullYear();
  const m = month ?? today.getUTCMonth();
  return new Date(Date.UTC(y, m + 1, 1));
}

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}
