import { create } from "zustand";

export interface ThemeState {
  template: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  layout: string;
  darkMode: boolean;
  customCss: string;
  setTheme: (theme: Partial<ThemeState>) => void;
  resetTheme: () => void;
}

const defaultTheme = {
  template: "minimal",
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  accentColor: "#06b6d4",
  backgroundColor: "#0f172a",
  textColor: "#f8fafc",
  fontFamily: "inter",
  layout: "standard",
  darkMode: true,
  customCss: "",
};

export const useThemeStore = create<ThemeState>((set) => ({
  ...defaultTheme,
  setTheme: (theme) => set((state) => ({ ...state, ...theme })),
  resetTheme: () => set(defaultTheme),
}));
