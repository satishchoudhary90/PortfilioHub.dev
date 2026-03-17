import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DashboardMode = "light" | "dark";
export type DashboardAccent = "indigo" | "emerald" | "rose" | "amber" | "cyan" | "violet";

export interface DashboardThemeState {
  mode: DashboardMode;
  accent: DashboardAccent;
  setMode: (mode: DashboardMode) => void;
  setAccent: (accent: DashboardAccent) => void;
  toggleMode: () => void;
}

export const useDashboardThemeStore = create<DashboardThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      accent: "indigo",
      setMode: (mode) => set({ mode }),
      setAccent: (accent) => set({ accent }),
      toggleMode: () => set((s) => ({ mode: s.mode === "dark" ? "light" : "dark" })),
    }),
    { name: "devportfolio-dashboard-theme" }
  )
);
