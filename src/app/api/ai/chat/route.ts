import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are DevPortfolio AI — a helpful assistant built into a developer portfolio builder app. You help developers with:
- Writing bios, headlines, project descriptions, cover letters
- Suggesting skills, technologies, and career advice
- Generating code snippets, explaining concepts
- Reviewing and improving resume content
- Any other creative or technical writing tasks

Be concise, professional, and helpful. Use markdown formatting when appropriate (bold, lists, code blocks). Keep responses focused and actionable.`;

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your-gemini-api-key" || apiKey.length < 10) {
      return NextResponse.json({
        reply: "AI chat is not configured yet. Please add your `GEMINI_API_KEY` in the environment variables to enable this feature. You can get a free key at [Google AI Studio](https://aistudio.google.com/apikey).",
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: "System instruction: " + SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood! I'm DevPortfolio AI, ready to help you with your developer portfolio, resume, career, and any technical questions. What can I help you with?" }] },
          ...history,
        ],
      });

      const lastMessage = messages[messages.length - 1].content;
      const result = await chat.sendMessage(lastMessage);
      const reply = result.response.text().trim();

      return NextResponse.json({ reply });
    } catch (aiError) {
      console.error("Gemini chat error:", aiError);
      return NextResponse.json({
        reply: "Sorry, I encountered an error processing your request. Please try again.",
      });
    }
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
