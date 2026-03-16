"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/shared/motion-wrapper";
import { useThemeStore, type ThemeState } from "@/stores/use-theme-store";
import { Palette, Save, ChevronDown, Check, GripVertical } from "lucide-react";

const templates = [
  { value: "minimal", label: "Minimal Developer", desc: "Clean with starfield hero", colors: ["#0f172a", "#6366f1", "#818cf8"] },
  { value: "dark-hacker", label: "Dark Hacker", desc: "Terminal-inspired dark theme", colors: ["#000000", "#22c55e", "#16a34a"] },
  { value: "modern-tech", label: "Modern Tech", desc: "Bold gradient tech vibe", colors: ["#0f172a", "#3b82f6", "#8b5cf6"] },
  { value: "creative-designer", label: "Creative Designer", desc: "Colorful and artistic", colors: ["#f8fafc", "#ec4899", "#f59e0b"] },
  { value: "gradient-wave", label: "Gradient Wave", desc: "Violet-fuchsia animated waves", colors: ["#030712", "#8b5cf6", "#d946ef"] },
  { value: "neon-cyber", label: "Neon Cyber", desc: "Cyberpunk cyan grid aesthetic", colors: ["#0a0a0f", "#22d3ee", "#3b82f6"] },
  { value: "elegant-serif", label: "Elegant Serif", desc: "Refined serif typography", colors: ["#faf8f5", "#b45309", "#d4a574"] },
  { value: "glassmorphism", label: "Glassmorphism", desc: "Frosted glass on purple", colors: ["#1e1b4b", "#7c3aed", "#a78bfa"] },
  { value: "retro-terminal", label: "Retro Terminal", desc: "Green-on-black CRT style", colors: ["#000000", "#00ff41", "#33ff57"] },
  { value: "nature-green", label: "Nature Green", desc: "Fresh organic green theme", colors: ["#f0fdf4", "#059669", "#10b981"] },
  { value: "sunset-warm", label: "Sunset Warm", desc: "Warm orange-rose palette", colors: ["#fff7ed", "#f97316", "#f43f5e"] },
  { value: "ocean-blue", label: "Ocean Blue", desc: "Deep blue ocean with waves", colors: ["#172554", "#3b82f6", "#06b6d4"] },
  { value: "monochrome", label: "Monochrome", desc: "Bold black & white editorial", colors: ["#ffffff", "#000000", "#6b7280"] },
  { value: "aurora-borealis", label: "Aurora Borealis", desc: "Animated northern lights", colors: ["#030712", "#2dd4bf", "#a78bfa"] },
];

const fonts = [
  { value: "inter", label: "Inter" },
  { value: "fira-code", label: "Fira Code" },
  { value: "space-grotesk", label: "Space Grotesk" },
  { value: "poppins", label: "Poppins" },
  { value: "jetbrains-mono", label: "JetBrains Mono" },
];

const layouts = [
  { value: "standard", label: "Standard" },
  { value: "sidebar", label: "Sidebar" },
  { value: "centered", label: "Centered" },
];

function ColorSwatch({ colors }: { colors: string[] }) {
  return (
    <div className="flex -space-x-1">
      {colors.map((c, i) => (
        <div
          key={i}
          className="h-5 w-5 rounded-full border-2 border-slate-800 ring-1 ring-white/10"
          style={{ background: c, zIndex: colors.length - i }}
        />
      ))}
    </div>
  );
}

function TemplateDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, side: true });
  const selected = templates.find((t) => t.value === value);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const isMd = window.innerWidth >= 1024;
    if (isMd) {
      setPos({ top: rect.top, left: rect.right + 10, width: 288, side: true });
    } else {
      setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width, side: false });
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  function toggle() {
    if (!open) updatePosition();
    setOpen((p) => !p);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-indigo-400" />
          Template
        </CardTitle>
        <CardDescription>Choose a portfolio template</CardDescription>
      </CardHeader>
      <CardContent>
        <button
          ref={triggerRef}
          type="button"
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all hover:border-indigo-500/40 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          {selected ? (
            <>
              <div
                className="h-10 w-10 shrink-0 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${selected.colors[0]}, ${selected.colors[1]}, ${selected.colors[2]})`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{selected.label}</p>
                <p className="text-xs text-gray-400 truncate">{selected.desc}</p>
              </div>
              <ColorSwatch colors={selected.colors} />
            </>
          ) : (
            <span className="text-sm text-gray-500">Select a template</span>
          )}
          <ChevronDown
            className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200"
            style={{ transform: open ? (pos.side ? "rotate(-90deg)" : "rotate(180deg)") : undefined }}
          />
        </button>

        {typeof document !== "undefined" &&
          createPortal(
            <AnimatePresence>
              {open && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, ...(pos.side ? { x: -12 } : { y: -8 }), scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, ...(pos.side ? { x: -12 } : { y: -8 }), scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="fixed max-h-[70vh] overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40"
                  style={{ top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
                >
                  <div className="p-1.5 space-y-0.5">
                    {templates.map((t) => {
                      const isActive = t.value === value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => {
                            onChange(t.value);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                            isActive
                              ? "bg-indigo-500/15 border border-indigo-500/30"
                              : "border border-transparent hover:bg-white/[0.06]"
                          }`}
                        >
                          <div
                            className="h-9 w-9 shrink-0 rounded-lg shadow-inner"
                            style={{
                              background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}, ${t.colors[2]})`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isActive ? "text-indigo-300" : "text-gray-200"}`}>
                              {t.label}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{t.desc}</p>
                          </div>
                          <ColorSwatch colors={t.colors} />
                          {isActive && <Check className="h-4 w-4 shrink-0 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </CardContent>
    </Card>
  );
}

function SortableSection({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3 top-1/2 -translate-y-1/2 -translate-x-full p-1.5 rounded-lg bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white/10"
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>
      {children}
    </div>
  );
}

function TemplateSection({ theme }: { theme: ThemeState }) {
  return (
    <TemplateDropdown value={theme.template} onChange={(v) => theme.setTheme({ template: v })} />
  );
}

function ColorsSection({ theme }: { theme: ThemeState }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Colors</CardTitle>
        <CardDescription>Customize your portfolio colors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Primary Color", key: "primaryColor" as const },
            { label: "Secondary Color", key: "secondaryColor" as const },
            { label: "Accent Color", key: "accentColor" as const },
            { label: "Background", key: "backgroundColor" as const },
            { label: "Text Color", key: "textColor" as const },
          ].map((color) => (
            <div key={color.key} className="space-y-2">
              <Label>{color.label}</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme[color.key]}
                  onChange={(e) => theme.setTheme({ [color.key]: e.target.value })}
                  className="h-10 w-10 rounded-lg cursor-pointer border-0"
                />
                <Input
                  value={theme[color.key]}
                  onChange={(e) => theme.setTheme({ [color.key]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TypographySection({ theme }: { theme: ThemeState }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography & Layout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={theme.fontFamily} onValueChange={(v) => theme.setTheme({ fontFamily: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {fonts.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Layout Style</Label>
            <Select value={theme.layout} onValueChange={(v) => theme.setTheme({ layout: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {layouts.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
          <div>
            <Label>Dark Mode</Label>
            <p className="text-xs text-gray-500 mt-1">Toggle dark/light mode for your portfolio</p>
          </div>
          <Switch checked={theme.darkMode} onCheckedChange={(v) => theme.setTheme({ darkMode: v })} />
        </div>
      </CardContent>
    </Card>
  );
}

const sectionRenderers: Record<string, (theme: ThemeState) => React.ReactNode> = {
  template: (theme) => <TemplateSection theme={theme} />,
  colors: (theme) => <ColorsSection theme={theme} />,
  typography: (theme) => <TypographySection theme={theme} />,
};

export default function SettingsPage() {
  const { addToast } = useToast();
  const theme = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sectionOrder, setSectionOrder] = useState(["template", "colors", "typography"]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    fetch("/api/theme")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          theme.setTheme({
            template: data.template || "minimal",
            primaryColor: data.primaryColor || "#6366f1",
            secondaryColor: data.secondaryColor || "#8b5cf6",
            accentColor: data.accentColor || "#06b6d4",
            backgroundColor: data.backgroundColor || "#0f172a",
            textColor: data.textColor || "#f8fafc",
            fontFamily: data.fontFamily || "inter",
            layout: data.layout || "standard",
            darkMode: data.darkMode ?? true,
            customCss: data.customCss || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSectionOrder((prev) => {
      const oldIdx = prev.indexOf(active.id as string);
      const newIdx = prev.indexOf(over.id as string);
      return arrayMove(prev, oldIdx, newIdx);
    });
  }

  async function saveTheme() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: theme.template,
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          accentColor: theme.accentColor,
          backgroundColor: theme.backgroundColor,
          textColor: theme.textColor,
          fontFamily: theme.fontFamily,
          layout: theme.layout,
          darkMode: theme.darkMode,
          customCss: theme.customCss || "",
        }),
      });
      if (res.ok) {
        addToast({ title: "Theme saved! Refresh your portfolio to see changes.", variant: "success" });
      } else {
        const err = await res.json().catch(() => ({}));
        addToast({ title: err.error || "Failed to save theme", variant: "error" });
      }
    } catch {
      addToast({ title: "Failed to save", variant: "error" });
    }
    setIsLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-6 pl-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Theme Settings</h1>
            <p className="text-gray-400 mt-1">Customize your portfolio appearance — drag to reorder sections</p>
          </div>
          <Button onClick={saveTheme} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      </FadeIn>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {sectionOrder.map((id) => (
              <SortableSection key={id} id={id}>
                {sectionRenderers[id](theme)}
              </SortableSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
