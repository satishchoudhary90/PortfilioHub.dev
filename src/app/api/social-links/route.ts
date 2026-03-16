import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { socialLinkSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await prisma.socialLink.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(links);
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
    const data = socialLinkSchema.parse(body);

    if (data.platform === "email" && !data.url.startsWith("mailto:")) {
      data.url = `mailto:${data.url}`;
    } else if (!data.url.startsWith("http://") && !data.url.startsWith("https://") && !data.url.startsWith("mailto:")) {
      data.url = `https://${data.url}`;
    }

    const count = await prisma.socialLink.count({ where: { userId: session.user.id } });

    const link = await prisma.socialLink.create({
      data: { ...data, userId: session.user.id, order: count },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error: any) {
    if (error.issues) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
