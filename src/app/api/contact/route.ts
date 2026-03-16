import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = contactSchema.parse(body);
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message, userId },
    });

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error: any) {
    if (error.issues) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
