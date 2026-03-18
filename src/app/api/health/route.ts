import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.trim() === "") {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        hint: "DATABASE_URL is not set. Add it to .env (local) or Vercel env vars.",
        message: "Database connection failed. Ensure DATABASE_URL is set and reachable (Neon: use pooled URL with -pooler, add ?connect_timeout=15).",
      },
      { status: 503 }
    );
  }

  const usesPooler = dbUrl.includes("-pooler");
  const isNeon = dbUrl.includes("neon.tech");

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check error:", error);
    const hint =
      isNeon && !usesPooler
        ? "Neon requires pooled URL (-pooler in hostname) for serverless. Get it from Neon Console → Connection details."
        : "Check credentials, network, and that the database is running.";
    const body: Record<string, unknown> = {
      status: "error",
      database: "disconnected",
      hint,
      message: "Database connection failed. Ensure DATABASE_URL is set and reachable (Neon: use pooled URL with -pooler, add ?connect_timeout=15).",
    };
    if (process.env.NODE_ENV !== "production" && error instanceof Error) {
      body.debug = { code: (error as { code?: string }).code, message: error.message };
    }
    return NextResponse.json(body, { status: 503 });
  }
}
