import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildDashboardData } from "@/lib/dashboard";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const data = await buildDashboardData(session.user.id);
  return NextResponse.json(data);
}
