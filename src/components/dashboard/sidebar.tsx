"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useDashboardThemeStore } from "@/stores/use-dashboard-theme-store";
import { clearChatHistory } from "@/lib/chat-history";

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  {
    title: "Portfolio Builder",
    href: "/dashboard/portfolio-builder",
    icon: Layers,
  },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Resume", href: "/dashboard/resume", icon: FileText },
  { title: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { mode, toggleMode } = useDashboardThemeStore();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function handleLogout() {
    clearChatHistory();
    signOut({ callbackUrl: "/login" });
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Close mobile menu when clicking outside or pressing escape
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-theme-bg-secondary/95 backdrop-blur-xl border-b border-theme-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-theme-accent flex items-center justify-center text-sm font-bold text-white shrink-0">
              D
            </div>
            <span className="text-lg font-bold text-theme-text">
              DevPortfolio
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-card transition-all"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-theme-border bg-theme-bg-secondary/95 backdrop-blur-xl transition-all duration-300",
          // Mobile: slide in from left, desktop: always visible
          "lg:translate-x-0",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo - Hidden on mobile (shown in top bar) */}
          <div className="hidden lg:flex h-16 items-center gap-2 border-b border-theme-border px-6">
            <div className="w-8 h-8 rounded-lg bg-theme-accent flex items-center justify-center text-sm font-bold text-white shrink-0">
              D
            </div>
            <span className="text-lg font-bold text-theme-text">
              DevPortfolio
            </span>
          </div>

          {/* Mobile padding for top bar */}
          <div className="h-14 lg:h-0" />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative",
                    isActive
                      ? "text-theme-text bg-theme-accent-soft"
                      : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-card",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-theme-accent-soft border border-theme-accent/30"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <item.icon className="h-4 w-4 relative z-10 shrink-0" />
                  <span className="relative z-10">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-theme-border p-4 space-y-4">
            {/* Theme toggle */}
            <div className="flex justify-start">
              <button
                onClick={toggleMode}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-card transition-all text-sm font-medium w-full"
                title={
                  mode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {mode === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span>{mode === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>

            {/* View Portfolio */}
            {session?.user?.username && (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <a
                    href={getPortfolioUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-theme-text-secondary hover:text-theme-text hover:bg-theme-card transition-all"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    View Portfolio
                  </a>
                  <button
                    onClick={copyLink}
                    className={cn(
                      "p-2.5 rounded-lg text-sm transition-all",
                      copied
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-theme-muted hover:text-theme-text hover:bg-theme-card",
                    )}
                    title="Copy shareable link"
                  >
                    {copied ? (
                      <CheckCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <div className="mx-3 px-3 py-2 rounded-md bg-theme-card border border-theme-border">
                  <p className="text-[11px] text-theme-muted truncate font-mono">
                    {getPortfolioUrl()}
                  </p>
                </div>
              </div>
            )}

            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-theme-card/50">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>
                  {getInitials(session?.user?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-theme-text truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-theme-muted truncate">
                  {session?.user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-theme-muted hover:text-theme-text transition-colors p-1"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
