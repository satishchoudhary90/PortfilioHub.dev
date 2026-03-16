import { create } from "zustand";

interface PortfolioSection {
  id: string;
  type: string;
  visible: boolean;
  order: number;
}

interface PortfolioState {
  sections: PortfolioSection[];
  activeTemplate: string;
  isPreviewMode: boolean;
  setSections: (sections: PortfolioSection[]) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  toggleSection: (id: string) => void;
  setTemplate: (template: string) => void;
  setPreviewMode: (mode: boolean) => void;
}

const defaultSections: PortfolioSection[] = [
  { id: "hero", type: "hero", visible: true, order: 0 },
  { id: "about", type: "about", visible: true, order: 1 },
  { id: "skills", type: "skills", visible: true, order: 2 },
  { id: "projects", type: "projects", visible: true, order: 3 },
  { id: "experience", type: "experience", visible: true, order: 4 },
  { id: "education", type: "education", visible: true, order: 5 },
  { id: "contact", type: "contact", visible: true, order: 6 },
];

export const usePortfolioStore = create<PortfolioState>((set) => ({
  sections: defaultSections,
  activeTemplate: "minimal",
  isPreviewMode: false,
  setSections: (sections) => set({ sections }),
  reorderSections: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.sections);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { sections: result.map((s, i) => ({ ...s, order: i })) };
    }),
  toggleSection: (id) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      ),
    })),
  setTemplate: (activeTemplate) => set({ activeTemplate }),
  setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
}));
