import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Append Neon/serverless-friendly params to DATABASE_URL for Vercel deployments */
function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return url;

  // Optimized connection settings for Neon
  const params =
    "connect_timeout=60&connection_limit=10&pool_timeout=60&sslmode=require";
  return url.includes("?") ? `${url}&${params}` : `${url}?${params}`;
}

const dbUrl = getDatabaseUrl();
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
