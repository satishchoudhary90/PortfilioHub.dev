import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = skillSchema.parse(body);

    const count = await prisma.skill.count({ where: { userId: session.user.id } });

    const skill = await prisma.skill.create({
      data: { ...data, userId: session.user.id, order: count },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    if (error.issues) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
