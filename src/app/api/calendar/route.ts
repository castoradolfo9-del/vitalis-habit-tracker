import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMonthlyCalendar } from "@/lib/stats";
import { getUserTimezone } from "@/lib/user";
import { todayForTimezone } from "@/lib/dates";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const timezone = await getUserTimezone(userId);
  const today = todayForTimezone(timezone);

  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year")) || today.getUTCFullYear();
  const monthParam = searchParams.get("month"); // 1-12
  const month = monthParam ? Number(monthParam) - 1 : today.getUTCMonth();

  const days = await getMonthlyCalendar(userId, timezone, year, month);

  return NextResponse.json({ year, month: month + 1, days });
}
