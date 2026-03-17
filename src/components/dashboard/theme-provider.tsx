"use client";

import { useEffect } from "react";
import { useDashboardThemeStore } from "@/stores/use-dashboard-theme-store";

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, accent } = useDashboardThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-light", "theme-dark");
    html.classList.add(mode === "light" ? "theme-light" : "theme-dark");

    const accents = ["accent-indigo", "accent-emerald", "accent-rose", "accent-amber", "accent-cyan", "accent-violet"] as const;
    accents.forEach((c) => html.classList.remove(c));
    html.classList.add(`accent-${accent}`);
  }, [mode, accent]);

  return <>{children}</>;
}
