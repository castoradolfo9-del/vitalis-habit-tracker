import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(userId: string, habitId: string) {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } });
  if (!habit || habit.userId !== userId) return null;
  return habit;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;

  const habit = await assertOwnership(session.user.id, id);
  if (!habit) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.nombre === "string" && body.nombre.trim()) data.name = body.nombre.trim();
  if (typeof body.icono === "string") data.icon = body.icono;
  if (typeof body.categoria === "string") data.category = body.categoria;
  if (typeof body.meta === "number") data.monthlyGoal = Math.max(0, Math.floor(body.meta));

  await prisma.habit.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;

  const habit = await assertOwnership(session.user.id, id);
  if (!habit) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.habit.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
