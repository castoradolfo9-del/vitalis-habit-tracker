import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/dates";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { pasos } = await req.json();
  const value = Math.max(0, Number(pasos) || 0);
  const today = todayUTC();

  await prisma.gymLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { steps: value },
    create: { userId, date: today, steps: value },
  });

  return NextResponse.json({ ok: true });
}
