import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
  } catch (error: any) {
    if (error.issues) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
