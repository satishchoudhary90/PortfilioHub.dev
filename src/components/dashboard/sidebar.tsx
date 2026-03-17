"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Layers,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Copy,
  CheckCheck,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Portfolio Builder", href: "/dashboard/portfolio-builder", icon: Layers },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Resume", href: "/dashboard/resume", icon: FileText },
  { title: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  function getPortfolioUrl() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/${session?.user?.username}`;
  }

  async function copyLink() {
    const url = getPortfolioUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 md:w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-3 md:px-6 justify-center md:justify-start">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            D
          </div>
          <span className="text-lg font-bold text-white hidden md:block">DevPortfolio</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 md:p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.title}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative justify-center md:justify-start",
                  isActive
                    ? "text-white bg-indigo-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-indigo-600/20 border border-indigo-500/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="h-4 w-4 relative z-10 shrink-0" />
                <span className="relative z-10 hidden md:block">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-2 md:p-4 space-y-3">
          {/* View Portfolio - full on md+, icon-only below */}
          {session?.user?.username && (
            <>
              {/* Full version (md+) */}
              <div className="hidden md:block space-y-1.5">
                <div className="flex items-center gap-1">
                  <a
                    href={getPortfolioUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    View Portfolio
                  </a>
                  <button
                    onClick={copyLink}
                    className={cn(
                      "p-2 rounded-lg text-sm transition-all",
                      copied
                        ? "text-green-400 bg-green-500/10"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                    title="Copy shareable link"
                  >
                    {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="mx-3 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10">
                  <p className="text-[11px] text-gray-500 truncate font-mono">
                    {getPortfolioUrl()}
                  </p>
                </div>
              </div>

              {/* Icon-only version (below md) */}
              <div className="flex md:hidden justify-center">
                <a
                  href={getPortfolioUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Portfolio"
                  className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </>
          )}

          {/* User info */}
          <div className="flex items-center gap-3 px-1 md:px-3 justify-center md:justify-start">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>{getInitials(session?.user?.name || "U")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 hidden md:block">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-500 hover:text-white transition-colors hidden md:block"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Logout icon-only (below md) */}
          <div className="flex md:hidden justify-center">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
