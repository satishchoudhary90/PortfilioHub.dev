import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { status: "error", database: "disconnected", message: "Database connection failed. Verify DATABASE_URL and DIRECT_URL in Vercel environment variables." },
      { status: 503 }
    );
  }
}
