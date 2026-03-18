"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/shared/motion-wrapper";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Save,
  FolderKanban,
  Zap,
  Briefcase,
  GraduationCap,
  Share2,
  ChevronDown,
  ChevronUp,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Sparkles,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const platformIcons: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  email: Mail,
};
const skillCategories = [
  "frontend",
  "backend",
  "database",
  "devops",
  "mobile",
  "design",
  "general",
];
const socialPlatforms = ["github", "linkedin", "twitter", "website", "email"];

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 sm:w-6 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
      >
        <GripVertical className="h-5 w-5 sm:h-4 sm:w-4 text-theme-muted" />
      </div>
      <div className="pl-8 sm:pl-8">{children}</div>
    </div>
  );
}

type SectionKey =
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "socialLinks";

const sectionConfig: {
  key: SectionKey;
  label: string;
  icon: any;
  color: string;
}[] = [
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    color: "text-blue-400",
  },
  { key: "skills", label: "Skills", icon: Zap, color: "text-yellow-400" },
  {
    key: "experience",
    label: "Experience",
    icon: Briefcase,
    color: "text-green-400",
  },
  {
    key: "education",
    label: "Education",
    icon: GraduationCap,
    color: "text-purple-400",
  },
  {
    key: "socialLinks",
    label: "Social Links",
    icon: Share2,
    color: "text-pink-400",
  },
];

export default function PortfolioBuilderPage() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    projects: false,
    skills: false,
    experience: false,
    education: false,
    socialLinks: false,
  });
  const [editingItem, setEditingItem] = useState<{
    section: SectionKey;
    id: string | null;
  } | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [pRes, sRes, eRes, edRes, slRes] = await Promise.all([
      fetch("/api/projects")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/skills")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/experience")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/education")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/social-links")
        .then((r) => r.json())
        .catch(() => []),
    ]);
    setProjects(Array.isArray(pRes) ? pRes : []);
    setSkills(Array.isArray(sRes) ? sRes : []);
    setExperiences(Array.isArray(eRes) ? eRes : []);
    setEducations(Array.isArray(edRes) ? edRes : []);
    setSocialLinks(Array.isArray(slRes) ? slRes : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function toggleSection(key: SectionKey) {
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));
  }

  function startAdd(section: SectionKey) {
    const defaults: Record<SectionKey, any> = {
      projects: {
        title: "",
        description: "",
        techStack: [],
        githubUrl: "",
        liveUrl: "",
        imageUrl: "",
        featured: false,
        _techInput: "",
      },
      skills: { name: "", level: 70, category: "frontend" },
      experience: {
        company: "",
        position: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
      },
      education: {
        institution: "",
        degree: "",
        field: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
        grade: "",
      },
      socialLinks: { platform: "github", url: "" },
    };
    setEditingItem({ section, id: null });
    setFormData(defaults[section]);
  }

  function startEdit(section: SectionKey, item: any) {
    const data = { ...item };
    if (section === "projects") data._techInput = "";
    if (data.startDate) data.startDate = data.startDate.split("T")[0];
    if (data.endDate) data.endDate = data.endDate.split("T")[0];
    setEditingItem({ section, id: item.id });
    setFormData(data);
  }

  function cancelEdit() {
    setEditingItem(null);
    setFormData({});
  }

  function apiEndpoint(section: SectionKey): string {
    const map: Record<SectionKey, string> = {
      projects: "/api/projects",
      skills: "/api/skills",
      experience: "/api/experience",
      education: "/api/education",
      socialLinks: "/api/social-links",
    };
    return map[section];
  }

  async function saveItem() {
    if (!editingItem) return;
    const { section, id } = editingItem;
    const endpoint = apiEndpoint(section);
    const body = { ...formData };
    delete body._techInput;
    delete body.id;
    delete body.userId;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.order;

    try {
      const res = await fetch(id ? `${endpoint}/${id}` : endpoint, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        addToast({ title: id ? "Updated!" : "Added!", variant: "success" });
        cancelEdit();
        fetchAll();
      } else {
        const err = await res.json().catch(() => ({}));
        addToast({ title: err.error || "Failed to save", variant: "error" });
      }
    } catch {
      addToast({ title: "Failed to save", variant: "error" });
    }
  }

  async function deleteItem(section: SectionKey, id: string) {
    const endpoint = apiEndpoint(section);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast({ title: "Deleted", variant: "success" });
        fetchAll();
      }
    } catch {
      addToast({ title: "Failed to delete", variant: "error" });
    }
  }

  function handleDragEnd(section: SectionKey, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const setter = {
      projects: setProjects,
      skills: setSkills,
      experience: setExperiences,
      education: setEducations,
      socialLinks: setSocialLinks,
    }[section];
    const items = {
      projects,
      skills,
      experience: experiences,
      education: educations,
      socialLinks,
    }[section];
    const oldIndex = items.findIndex((i: any) => i.id === active.id);
    const newIndex = items.findIndex((i: any) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setter(arrayMove(items, oldIndex, newIndex));
    }
  }

  function addTechTag() {
    const tag = formData._techInput?.trim();
    if (tag && !formData.techStack.includes(tag)) {
      setFormData((p: any) => ({
        ...p,
        techStack: [...p.techStack, tag],
        _techInput: "",
      }));
    }
  }

  function removeTechTag(tag: string) {
    setFormData((p: any) => ({
      ...p,
      techStack: p.techStack.filter((t: string) => t !== tag),
    }));
  }

  async function aiGenerate(type: string, context: string) {
    setAiGenerating(type);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      });
      const data = await res.json();
      if (data.text) return data.text;
    } catch {}
    setAiGenerating(null);
    return null;
  }

  async function aiGenerateProjectDesc() {
    const title = formData.title || "";
    const tech = formData.techStack?.join(", ") || "";
    const text = await aiGenerate("project", `Title: ${title}, Tech: ${tech}`);
    if (text) {
      setFormData((p: any) => ({ ...p, description: text }));
      addToast({ title: "Description generated!", variant: "success" });
    }
    setAiGenerating(null);
  }

  async function aiGenerateExpDesc() {
    const position = formData.position || "";
    const company = formData.company || "";
    const text = await aiGenerate(
      "experience",
      `Position: ${position} at ${company}`,
    );
    if (text) {
      setFormData((p: any) => ({ ...p, description: text }));
      addToast({ title: "Description generated!", variant: "success" });
    }
    setAiGenerating(null);
  }

  async function aiSuggestSkills() {
    const projectContext = projects
      .map((p) => `${p.title} (${p.techStack?.join(", ")})`)
      .join("; ");
    const existingSkills = skills.map((s) => s.name).join(", ");
    const text = await aiGenerate(
      "skill-suggest",
      `Projects: ${projectContext}. Existing skills: ${existingSkills}`,
    );
    if (text) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          const existing = new Set(skills.map((s) => s.name.toLowerCase()));
          setSuggestedSkills(
            parsed.filter((s: string) => !existing.has(s.toLowerCase())),
          );
        }
      } catch {
        addToast({
          title: "Could not parse skill suggestions",
          variant: "error",
        });
      }
    }
    setAiGenerating(null);
  }

  async function addSuggestedSkill(name: string) {
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category: "general", level: 70 }),
      });
      if (res.ok) {
        setSuggestedSkills((prev) => prev.filter((s) => s !== name));
        fetchAll();
        addToast({ title: `"${name}" added!`, variant: "success" });
      }
    } catch {
      addToast({ title: "Failed to add skill", variant: "error" });
    }
  }

  function getItems(section: SectionKey): any[] {
    return {
      projects,
      skills,
      experience: experiences,
      education: educations,
      socialLinks,
    }[section];
  }

  function renderForm(section: SectionKey) {
    switch (section) {
      case "projects":
        return (
          <div className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <Label className="text-xs">Title *</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Project name"
                />
              </div>
              <div>
                <Label className="text-xs">Image URL</Label>
                <Input
                  value={formData.imageUrl || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      imageUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:justify-between">
                <Label className="text-xs">Description</Label>
                <button
                  type="button"
                  onClick={aiGenerateProjectDesc}
                  disabled={aiGenerating === "project"}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors self-start xs:self-auto"
                >
                  {aiGenerating === "project" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  AI Generate
                </button>
              </div>
              <Textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                placeholder="What does this project do?"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">GitHub URL</Label>
                <Input
                  value={formData.githubUrl || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      githubUrl: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <Label className="text-xs">Live URL</Label>
                <Input
                  value={formData.liveUrl || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, liveUrl: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Tech Stack</Label>
              <div className="flex flex-col xs:flex-row gap-1.5 sm:gap-2 mt-1">
                <Input
                  value={formData._techInput || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      _techInput: e.target.value,
                    }))
                  }
                  placeholder="React, Node.js, MongoDB..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && formData._techInput?.trim()) {
                      e.preventDefault();
                      const tech = formData._techInput.trim();
                      const current = formData.techStack || [];
                      if (!current.includes(tech)) {
                        setFormData((p: any) => ({
                          ...p,
                          techStack: [...current, tech],
                          _techInput: "",
                        }));
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (formData._techInput?.trim()) {
                      const tech = formData._techInput.trim();
                      const current = formData.techStack || [];
                      if (!current.includes(tech)) {
                        setFormData((p: any) => ({
                          ...p,
                          techStack: [...current, tech],
                          _techInput: "",
                        }));
                      }
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              {formData.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.techStack.map((t: string) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => {
                        const current = formData.techStack || [];
                        setFormData((p: any) => ({
                          ...p,
                          techStack: current.filter(
                            (item: string) => item !== t,
                          ),
                        }));
                      }}
                    >
                      {t} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.featured || false}
                onCheckedChange={(v) =>
                  setFormData((p: any) => ({ ...p, featured: v }))
                }
              />
              <Label className="text-xs">Featured project</Label>
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <Label className="text-xs">Skill Name *</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="React, Python..."
                />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <select
                  value={formData.category || "frontend"}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      category: e.target.value,
                    }))
                  }
                  className="w-full h-10 rounded-md border border-theme-border bg-transparent px-3 text-sm text-theme-text"
                >
                  {skillCategories.map((c) => (
                    <option key={c} value={c} className="bg-gray-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">
                  Level: {formData.level || 70}%
                </Label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={formData.level || 70}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      level: Number(e.target.value),
                    }))
                  }
                  className="w-full mt-2 accent-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      case "experience":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Position *</Label>
                <Input
                  value={formData.position || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      position: e.target.value,
                    }))
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label className="text-xs">Company *</Label>
                <Input
                  value={formData.company || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, company: e.target.value }))
                  }
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, endDate: e.target.value }))
                  }
                  disabled={formData.current}
                />
              </div>
              <div className="flex items-end pb-2 gap-2">
                <Switch
                  checked={formData.current || false}
                  onCheckedChange={(v) =>
                    setFormData((p: any) => ({
                      ...p,
                      current: v,
                      endDate: v ? "" : p.endDate,
                    }))
                  }
                />
                <Label className="text-xs">Current</Label>
              </div>
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Input
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData((p: any) => ({ ...p, location: e.target.value }))
                }
                placeholder="City, Country"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Description</Label>
                <button
                  type="button"
                  onClick={aiGenerateExpDesc}
                  disabled={aiGenerating === "experience"}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                >
                  {aiGenerating === "experience" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  AI Generate
                </button>
              </div>
              <Textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                rows={2}
                placeholder="What did you do?"
              />
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Degree *</Label>
                <Input
                  value={formData.degree || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, degree: e.target.value }))
                  }
                  placeholder="B.Tech, M.Sc..."
                />
              </div>
              <div>
                <Label className="text-xs">Institution *</Label>
                <Input
                  value={formData.institution || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      institution: e.target.value,
                    }))
                  }
                  placeholder="University name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Field</Label>
                <Input
                  value={formData.field || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, field: e.target.value }))
                  }
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <Label className="text-xs">Grade</Label>
                <Input
                  value={formData.grade || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, grade: e.target.value }))
                  }
                  placeholder="3.8/4.0"
                />
              </div>
              <div className="flex items-end pb-2 gap-2">
                <Switch
                  checked={formData.current || false}
                  onCheckedChange={(v) =>
                    setFormData((p: any) => ({
                      ...p,
                      current: v,
                      endDate: v ? "" : p.endDate,
                    }))
                  }
                />
                <Label className="text-xs">Current</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, endDate: e.target.value }))
                  }
                  disabled={formData.current}
                />
              </div>
            </div>
          </div>
        );
      case "socialLinks":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Platform</Label>
                <select
                  value={formData.platform || "github"}
                  onChange={(e) =>
                    setFormData((p: any) => ({
                      ...p,
                      platform: e.target.value,
                    }))
                  }
                  className="w-full h-10 rounded-md border border-theme-border bg-transparent px-3 text-sm text-theme-text"
                >
                  {socialPlatforms.map((p) => (
                    <option key={p} value={p} className="bg-gray-900">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">URL *</Label>
                <Input
                  value={formData.url || ""}
                  onChange={(e) =>
                    setFormData((p: any) => ({ ...p, url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        );
    }
  }

  function renderItem(section: SectionKey, item: any) {
    switch (section) {
      case "projects":
        return (
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h4 className="font-semibold text-sm sm:text-base text-theme-text">
                {item.title}
              </h4>
              {item.featured && (
                <Badge
                  variant="secondary"
                  className="text-[9px] sm:text-[10px] px-1 py-0.5"
                >
                  Featured
                </Badge>
              )}
            </div>
            {item.description && (
              <p className="text-xs sm:text-sm text-theme-text-secondary mt-0.5 line-clamp-1">
                {item.description}
              </p>
            )}
            {item.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-1 sm:mt-1.5">
                {item.techStack.map((t: string) => (
                  <span
                    key={t}
                    className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-theme-card text-theme-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case "skills":
        return (
          <div className="flex flex-col xs:flex-row xs:items-center gap-1.5 xs:gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 xs:gap-2 min-w-0">
              <span className="font-medium text-xs sm:text-sm text-theme-text truncate">
                {item.name}
              </span>
              <Badge
                variant="secondary"
                className="text-[8px] sm:text-[9px] lg:text-[10px] shrink-0 px-1 py-0.5"
              >
                {item.category}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2">
              <div className="flex-1 h-1.5 xs:h-2 bg-theme-card rounded-full min-w-[60px] sm:min-w-[80px] max-w-[100px] sm:max-w-[120px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${item.level}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-theme-muted shrink-0">
                {item.level}%
              </span>
            </div>
          </div>
        );
      case "experience":
        return (
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-theme-text">
              {item.position}
            </h4>
            <p className="text-xs sm:text-sm text-indigo-400">
              {item.company}
              {item.location ? ` · ${item.location}` : ""}
            </p>
            <p className="text-[10px] sm:text-xs text-theme-muted mt-0.5">
              {formatDate(item.startDate)} —{" "}
              {item.current
                ? "Present"
                : item.endDate
                  ? formatDate(item.endDate)
                  : ""}
            </p>
          </div>
        );
      case "education":
        return (
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-theme-text">
              {item.degree}
              {item.field ? ` in ${item.field}` : ""}
            </h4>
            <p className="text-xs sm:text-sm text-purple-400">
              {item.institution}
              {item.grade ? ` · GPA: ${item.grade}` : ""}
            </p>
            <p className="text-[10px] sm:text-xs text-theme-muted mt-0.5">
              {formatDate(item.startDate)} —{" "}
              {item.current
                ? "Present"
                : item.endDate
                  ? formatDate(item.endDate)
                  : ""}
            </p>
          </div>
        );
      case "socialLinks": {
        const Icon = platformIcons[item.platform] || Globe;
        return (
          <div className="flex items-center gap-2 sm:gap-3">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-400" />
            <span className="font-medium text-xs sm:text-sm text-theme-text capitalize">
              {item.platform}
            </span>
            <span className="text-[11px] sm:text-sm text-theme-text-secondary truncate">
              {item.url}
            </span>
          </div>
        );
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 max-w-4xl">
      <FadeIn>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-theme-text">
              Portfolio Builder
            </h1>
            <p className="text-sm sm:text-base text-theme-text-secondary mt-1">
              Manage all your portfolio content in one place.{" "}
              <span className="hidden sm:inline">Drag to reorder.</span>
            </p>
          </div>
        </div>
      </FadeIn>

      {sectionConfig.map((section, idx) => {
        const items = getItems(section.key);
        const Icon = section.icon;
        const isCollapsed = collapsed[section.key];
        const isEditing = editingItem?.section === section.key;

        return (
          <FadeIn key={section.key} delay={idx * 0.05}>
            <Card>
              <CardHeader
                className="pb-2 sm:pb-3 cursor-pointer px-3 sm:px-6 py-2 sm:py-4"
                onClick={() => toggleSection(section.key)}
              >
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-2">
                  <CardTitle className="flex items-center gap-1.5 xs:gap-2 text-base sm:text-lg">
                    <Icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${section.color}`}
                    />
                    <span className="hidden xs:inline text-sm sm:text-base">
                      {section.label}
                    </span>
                    <span className="xs:hidden text-sm">
                      {section.label.replace(/s$/, "")}
                    </span>
                    <Badge
                      variant="secondary"
                      className="ml-0.5 sm:ml-1 text-[9px] sm:text-[10px] px-1 sm:px-2"
                    >
                      {items.length}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-1 xs:gap-1.5">
                    {section.key === "skills" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          aiSuggestSkills();
                        }}
                        disabled={aiGenerating === "skill-suggest"}
                        className="text-indigo-400 hover:text-indigo-300 text-xs p-1.5 sm:p-2 h-8 sm:h-9"
                      >
                        {aiGenerating === "skill-suggest" ? (
                          <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                        )}
                        <span className="hidden xs:inline text-xs sm:text-sm">
                          AI
                        </span>
                        <span className="xs:hidden text-xs">AI</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        startAdd(section.key);
                        if (isCollapsed) toggleSection(section.key);
                      }}
                      className="text-xs p-1.5 sm:p-2 h-8 sm:h-9"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4 text-theme-muted" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-theme-muted" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 space-y-2 px-3 sm:px-6 pb-3 sm:pb-6">
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3"
                        >
                          <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:justify-between">
                            <p className="text-sm font-medium text-indigo-400">
                              {editingItem.id ? "Edit" : "Add"}{" "}
                              {section.label.replace(/s$/, "")}
                            </p>
                            <div className="flex gap-2 xs:gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={cancelEdit}
                                className="flex-1 xs:flex-none text-xs xs:text-sm"
                              >
                                <X className="h-3.5 w-3.5 mr-1" /> Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={saveItem}
                                className="flex-1 xs:flex-none text-xs xs:text-sm"
                              >
                                <Check className="h-3.5 w-3.5 mr-1" /> Save
                              </Button>
                            </div>
                          </div>
                          {renderForm(section.key)}
                        </motion.div>
                      )}

                      {section.key === "skills" &&
                        suggestedSkills.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20"
                          >
                            <p className="text-xs text-indigo-400 mb-2 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" /> AI Suggested
                              Skills — click to add
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {suggestedSkills.map((skill) => (
                                <button
                                  key={skill}
                                  onClick={() => addSuggestedSkill(skill)}
                                  className="px-2.5 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all"
                                >
                                  + {skill}
                                </button>
                              ))}
                              <button
                                onClick={() => setSuggestedSkills([])}
                                className="px-2 py-1 text-xs text-theme-muted hover:text-theme-text-secondary transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          </motion.div>
                        )}

                      {items.length === 0 && !isEditing ? (
                        <div className="text-center py-6 sm:py-8 text-theme-muted text-xs sm:text-sm">
                          No {section.label.toLowerCase()} yet. Click
                          &quot;Add&quot; to get started.
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(e) => handleDragEnd(section.key, e)}
                        >
                          <SortableContext
                            items={items.map((i: any) => i.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-1.5">
                              {items.map((item: any) => (
                                <SortableItem key={item.id} id={item.id}>
                                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-theme-card border border-theme-border hover:border-theme-border transition-all">
                                    <div className="flex-1 min-w-0">
                                      {renderItem(section.key, item)}
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                      {section.key !== "skills" &&
                                        section.key !== "socialLinks" && (
                                          <button
                                            onClick={() =>
                                              startEdit(section.key, item)
                                            }
                                            className="p-1.5 rounded-md hover:bg-theme-card text-theme-muted hover:text-theme-text transition-colors"
                                          >
                                            <Pencil className="h-3.5 w-3.5" />
                                          </button>
                                        )}
                                      <button
                                        onClick={() =>
                                          deleteItem(section.key, item.id)
                                        }
                                        className="p-1.5 rounded-md hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </SortableItem>
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </FadeIn>
        );
      })}
    </div>
  );
}
