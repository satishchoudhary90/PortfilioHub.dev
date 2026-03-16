import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchGitHubRepos, repoToProject } from "@/lib/github";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "GitHub username is required" }, { status: 400 });
    }

    const repos = await fetchGitHubRepos(username);
    const projects = repos.map(repoToProject);

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch GitHub repos" }, { status: 500 });
  }
}
