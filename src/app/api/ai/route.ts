import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, context } = await req.json();

    const prompts: Record<string, string> = {
      bio: `Generate a professional developer bio based on: ${context}. Keep it concise (2-3 sentences), professional, and engaging. Only return the bio text.`,
      project: `Generate a compelling project description based on: ${context}. Keep it concise (2-3 sentences) and highlight the technical aspects. Only return the description text.`,
    };

    const prompt = prompts[type];
    if (!prompt) {
      return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      const fallbacks: Record<string, string> = {
        bio: `Passionate developer with expertise in building modern web applications. Dedicated to writing clean, maintainable code and creating exceptional user experiences.`,
        project: `A well-crafted application built with modern technologies, featuring responsive design and intuitive user interface.`,
      };
      return NextResponse.json({ text: fallbacks[type] });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
