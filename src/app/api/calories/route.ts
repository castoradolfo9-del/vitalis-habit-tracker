import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayForTimezone } from "@/lib/dates";
import { getUserTimezone } from "@/lib/user";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { calorias } = await req.json();
  const value = Math.max(0, Number(calorias) || 0);
  const today = todayForTimezone(await getUserTimezone(userId));

  await prisma.gymLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { calories: value },
    create: { userId, date: today, calories: value },
  });

  return NextResponse.json({ ok: true });
}
