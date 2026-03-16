interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  fork: boolean;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=30&type=owner`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const repos: GitHubRepo[] = await response.json();
  return repos.filter((repo) => !repo.fork);
}

export function repoToProject(repo: GitHubRepo) {
  return {
    title: repo.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description || "",
    techStack: [repo.language, ...repo.topics].filter(Boolean) as string[],
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || "",
    featured: repo.stargazers_count > 5,
  };
}
