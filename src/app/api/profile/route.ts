import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        projects: { orderBy: { order: "asc" } },
        skills: { orderBy: { order: "asc" } },
        experiences: { orderBy: { order: "asc" } },
        educations: { orderBy: { order: "asc" } },
        socialLinks: { orderBy: { order: "asc" } },
        themeSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = profileSchema.parse(body);

    if (data.username) {
      const existing = await prisma.user.findFirst({
        where: { username: data.username, NOT: { id: session.user.id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.issues) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
