import { prisma } from "@/lib/prisma";

interface RateLimitConfig {
  limit: number;
  windowMinutes: number;
}

const CONFIGS: Record<string, RateLimitConfig> = {
  login: { limit: 10, windowMinutes: 15 },
  register: { limit: 5, windowMinutes: 60 },
};

/** true si sigue permitido, false si superó el límite de intentos */
export async function checkRateLimit(identifier: string, action: keyof typeof CONFIGS): Promise<boolean> {
  const { limit, windowMinutes } = CONFIGS[action];
  const since = new Date(Date.now() - windowMinutes * 60_000);

  const count = await prisma.rateLimitAttempt.count({
    where: { identifier, action, createdAt: { gte: since } },
  });

  return count < limit;
}

export async function recordAttempt(identifier: string, action: keyof typeof CONFIGS): Promise<void> {
  await prisma.rateLimitAttempt.create({ data: { identifier, action } });
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
