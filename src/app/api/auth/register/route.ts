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
    if (error instanceof PrismaClientInitializationError) {
      return NextResponse.json(
        {
          error:
            "Database connection failed. Ensure DATABASE_URL is set and reachable (Neon: use pooled URL with -pooler, add ?connect_timeout=15).",
        },
        { status: 503 }
      );
    }
    const err = error as { code?: string; message?: string };
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }
    const message = err.message ?? (error instanceof Error ? error.message : "Internal server error");
    if (message.toLowerCase().includes("connect") || message.toLowerCase().includes("connection") || message.toLowerCase().includes("econnrefused") || message.toLowerCase().includes("p1001") || message.toLowerCase().includes("can't reach")) {
      return NextResponse.json(
        { error: "Database connection failed. Check DATABASE_URL and ensure the database is running (Neon may need a moment to wake from sleep)." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
