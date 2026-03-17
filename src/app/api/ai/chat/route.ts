import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SYSTEM_PROMPT = `You are DevPortfolio AI — a helpful assistant built into a developer portfolio builder app. You help developers with:
- Writing bios, headlines, project descriptions, cover letters
- Suggesting skills, technologies, and career advice
- Generating code snippets, explaining concepts
- Reviewing and improving resume content
- Any other creative or technical writing tasks

Be concise, professional, and helpful. Use markdown formatting when appropriate (bold, lists, code blocks). Keep responses focused and actionable.`;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey || groqKey === "your-groq-api-key" || groqKey.length < 10) {
      return NextResponse.json({
        reply: "AI chat is not configured yet. Please add your `GROQ_API_KEY` in the environment variables. Get a free key at [Groq Console](https://console.groq.com/keys).",
      });
    }

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      ];

      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const code = res.status;
        const msg = err?.error?.message || "";

        if (code === 429) {
          return NextResponse.json({
            reply: "**Rate limit reached.** Please wait a moment and try again. Groq free-tier allows ~30 requests/minute.",
          });
        }
        if (code === 401 || code === 403) {
          return NextResponse.json({
            reply: "**Invalid API key.** Your `GROQ_API_KEY` is invalid or revoked. Get a new one at [Groq Console](https://console.groq.com/keys).",
          });
        }

        console.error("Groq API error:", code, msg);
        return NextResponse.json({
          reply: "Sorry, the AI service returned an error. Please try again in a moment.",
        });
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || "No response generated.";

      return NextResponse.json({ reply });
    } catch (aiError) {
      console.error("Groq chat error:", aiError);
      return NextResponse.json({
        reply: "**Network error.** Could not reach the AI service. Please check your connection and try again.",
      });
    }
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
