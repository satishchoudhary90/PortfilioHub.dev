"use client";

interface TrackedLinkProps {
  href: string;
  userId: string;
  projectId?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackedLink({ href, userId, projectId, label, children, className }: TrackedLinkProps) {
  function handleClick() {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        event: "project_click",
        path: href,
        metadata: { projectId, label },
      }),
    }).catch(() => {});
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
