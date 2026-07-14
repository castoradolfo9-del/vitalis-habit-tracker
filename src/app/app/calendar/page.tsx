import { auth } from "@/lib/auth";
import { getMonthlyCalendar } from "@/lib/stats";
import { getUserTimezone } from "@/lib/user";
import { todayForTimezone } from "@/lib/dates";
import CalendarView from "@/components/CalendarView";

export default async function CalendarPage() {
  const session = await auth();
  const userId = session!.user.id;
  const timezone = await getUserTimezone(userId);
  const today = todayForTimezone(timezone);

  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();
  const days = await getMonthlyCalendar(userId, timezone, year, month);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Calendario</h1>
      <CalendarView initialData={{ year, month: month + 1, days }} />
    </div>
  );
}
