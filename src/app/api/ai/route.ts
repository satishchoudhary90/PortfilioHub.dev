import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACKS: Record<string, string> = {
  bio: "Passionate developer with expertise in building modern web applications. Dedicated to writing clean, maintainable code and creating exceptional user experiences.",
  headline: "Full Stack Developer",
  project: "A well-crafted application built with modern technologies, featuring responsive design and intuitive user interface.",
  experience: "Led development initiatives, collaborated with cross-functional teams, and delivered high-quality software solutions on schedule.",
  "skill-suggest": '["TypeScript","React","Node.js","PostgreSQL","Docker","Git"]',
  "resume-summary": "Results-driven software developer with a strong foundation in full-stack development. Passionate about building scalable applications and delivering outstanding user experiences.",
  "portfolio-review": "Your portfolio is off to a great start! Consider adding more projects to showcase your range, writing a detailed bio, and including links to live demos.",
};

function buildPrompt(type: string, context: string): string {
  switch (type) {
    case "bio":
      return `Generate a professional developer bio based on: ${context}. Keep it concise (2-3 sentences), professional, and engaging. Only return the bio text, no quotes.`;
    case "headline":
      return `Generate a short professional headline/title for a developer named: ${context}. It should be 3-6 words like "Senior Full Stack Engineer" or "Frontend Developer & UI Designer". Only return the headline, no quotes.`;
    case "project":
      return `Generate a compelling project description based on: ${context}. Keep it concise (2-3 sentences) and highlight the technical aspects and impact. Only return the description, no quotes.`;
    case "experience":
      return `Generate 2-3 professional bullet points describing responsibilities and achievements for this role: ${context}. Keep each point concise and impactful. Return only the description text.`;
    case "skill-suggest":
      return `Based on these projects and tech stacks: ${context}, suggest 6-8 additional skills this developer should consider adding to their portfolio. Return ONLY a valid JSON array of strings like ["Skill1","Skill2"]. No explanation.`;
    case "resume-summary":
      return `Write a professional 2-3 sentence resume summary/objective for a developer with this background: ${context}. Make it compelling for recruiters. Only return the summary, no quotes.`;
    case "portfolio-review":
      return `Review this developer portfolio data and provide 4-5 specific, actionable suggestions to improve it. Portfolio data: ${context}. Format each suggestion as a single clear sentence. Separate suggestions with newlines. Be constructive and specific.`;
    default:
      return context;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, context } = await req.json();

    if (!type || !context) {
      return NextResponse.json({ error: "Missing type or context" }, { status: 400 });
    }

    if (!FALLBACKS[type]) {
      return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your-gemini-api-key" || apiKey.length < 10) {
      return NextResponse.json({ text: FALLBACKS[type] });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = buildPrompt(type, context);
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      return NextResponse.json({ text });
    } catch (aiError) {
      console.error("Gemini API error, returning fallback:", aiError);
      return NextResponse.json({ text: FALLBACKS[type] });
    }
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
