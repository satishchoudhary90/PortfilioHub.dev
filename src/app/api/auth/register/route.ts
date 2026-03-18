import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { name, email, password, username } = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? "Email already exists" : "Username already taken" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
        themeSettings: {
          create: {
            template: "minimal",
            primaryColor: "#6366f1",
            secondaryColor: "#8b5cf6",
            accentColor: "#06b6d4",
            backgroundColor: "#0f172a",
            textColor: "#f8fafc",
            fontFamily: "inter",
            layout: "standard",
            darkMode: true,
          },
        },
      },
    });

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, username: user.username } },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error && Array.isArray((error as { issues: unknown[] }).issues)) {
      return NextResponse.json(
        { error: (error as { issues: { message: string }[] }).issues[0].message },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    const err = error as { code?: string; message?: string };
    const isConnectionError =
      error instanceof PrismaClientInitializationError ||
      err.code?.startsWith("P10") ||
      (typeof err.message === "string" &&
        /connect|connection|econnrefused|p1001|can't reach|timed out/i.test(err.message));

    if (error instanceof PrismaClientInitializationError || isConnectionError) {
      const body: Record<string, string> = {
        error:
          "Database connection failed. Ensure DATABASE_URL is set and reachable (Neon: use pooled URL with -pooler, add ?connect_timeout=15).",
      };
      if (process.env.NODE_ENV !== "production") {
        const code = err.code ?? (error as { errorCode?: string }).errorCode;
        const msg = (err.message ?? (error instanceof Error ? error.message : "")).slice(0, 200);
        body.debug = code ? `Prisma ${code}: ${msg}` : msg || "Unknown connection error";
      }
      return NextResponse.json(body, { status: 503 });
    }
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
