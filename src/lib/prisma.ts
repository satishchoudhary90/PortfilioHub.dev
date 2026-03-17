import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Append Neon/serverless-friendly params to DATABASE_URL for Vercel deployments */
function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  const params = "connect_timeout=15&connection_limit=1&pool_timeout=15";
  return url.includes("?") ? `${url}&${params}` : `${url}?${params}`;
}

const dbUrl = getDatabaseUrl();
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined,
  );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
