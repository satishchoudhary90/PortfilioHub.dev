import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE = 500_000; // ~500KB base64 limit

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photo } = await req.json();

    if (photo && typeof photo === "string" && photo.length > MAX_SIZE) {
      return NextResponse.json({ error: "Photo too large. Please use a smaller image." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: photo || null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 });
  }
}
