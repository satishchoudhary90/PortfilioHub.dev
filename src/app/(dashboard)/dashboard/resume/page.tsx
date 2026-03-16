"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/shared/motion-wrapper";
import { Download, FileText, Check, Pencil, Save, Sparkles, Loader2 } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import jsPDF from "jspdf";

import ProfessionalResume from "@/components/resume/professional";
import MinimalResume from "@/components/resume/minimal";
import CreativeResume from "@/components/resume/creative";
import TechnicalResume from "@/components/resume/technical";
import ExecutiveResume from "@/components/resume/executive";
import AcademicResume from "@/components/resume/academic";
import StartupResume from "@/components/resume/startup";
import ElegantResume from "@/components/resume/elegant";
import BoldResume from "@/components/resume/bold";
import CompactResume from "@/components/resume/compact";
import ModernSplitResume from "@/components/resume/modern-split";
import DeveloperResume from "@/components/resume/developer";
import InfographicResume from "@/components/resume/infographic";
import ClassicResume from "@/components/resume/classic";

const templates = [
  { id: "professional", name: "Professional", description: "Classic corporate with serif fonts", preview: "bg-white border-b-4 border-gray-800", category: "classic" },
  { id: "minimal", name: "Minimal", description: "Clean centered with whitespace", preview: "bg-white border-t border-gray-200", category: "clean" },
  { id: "creative", name: "Creative", description: "Two-column with indigo sidebar", preview: "bg-gradient-to-r from-indigo-900 from-35% to-white to-35%", category: "creative" },
  { id: "technical", name: "Technical", description: "Terminal-inspired dark theme", preview: "bg-gray-950 border border-green-500/30", category: "developer" },
  { id: "executive", name: "Executive", description: "Luxury with gold accents", preview: "bg-slate-800 border-b-2 border-yellow-600", category: "classic" },
  { id: "academic", name: "Academic", description: "Traditional academic CV style", preview: "bg-white border-b-2 border-blue-800", category: "classic" },
  { id: "startup", name: "Startup", description: "Modern gradient & playful pills", preview: "bg-gradient-to-r from-violet-600 to-fuchsia-500", category: "creative" },
  { id: "elegant", name: "Elegant", description: "Refined, magazine-inspired", preview: "bg-neutral-100 border border-neutral-200", category: "clean" },
  { id: "bold", name: "Bold", description: "High contrast black & red", preview: "bg-gradient-to-r from-gray-900 from-30% to-white to-30%", category: "creative" },
  { id: "compact", name: "Compact", description: "Maximum info, minimal space", preview: "bg-white border border-gray-300", category: "clean" },
  { id: "modern-split", name: "Modern Split", description: "Teal sidebar with progress bars", preview: "bg-gradient-to-r from-teal-600 from-35% to-white to-35%", category: "creative" },
  { id: "developer", name: "Developer", description: "Code editor Tokyo Night theme", preview: "bg-[#1a1b26] border border-[#7aa2f7]/30", category: "developer" },
  { id: "infographic", name: "Infographic", description: "Visual with charts & timeline", preview: "bg-white border-l-4 border-emerald-500", category: "creative" },
  { id: "classic", name: "Classic", description: "Timeless black & white ATS-friendly", preview: "bg-white border-t-2 border-b-2 border-black", category: "classic" },
];

const templateComponents: Record<string, React.ComponentType<{ data: any; editable?: boolean; onEdit?: (field: string, value: string) => void }>> = {
  professional: ProfessionalResume,
  minimal: MinimalResume,
  creative: CreativeResume,
  technical: TechnicalResume,
  executive: ExecutiveResume,
  academic: AcademicResume,
  startup: StartupResume,
  elegant: ElegantResume,
  bold: BoldResume,
  compact: CompactResume,
  "modern-split": ModernSplitResume,
  developer: DeveloperResume,
  infographic: InfographicResume,
  classic: ClassicResume,
};

const categories = [
  { id: "all", label: "All" },
  { id: "classic", label: "Classic" },
  { id: "clean", label: "Clean" },
  { id: "creative", label: "Creative" },
  { id: "developer", label: "Developer" },
];

export default function ResumePage() {
  const { addToast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("professional");
  const [editMode, setEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [editedData, setEditedData] = useState<any>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((data) => {
        setUserData(data);
        setEditedData(data);
      })
      .catch(() => {});
  }, []);

  function handleEdit(field: string, value: string) {
    setEditedData((prev: any) => ({ ...prev, [field]: value }));
  }

  async function saveEdits() {
    if (!editedData) return;
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedData.name,
          username: editedData.username || userData.username,
          bio: editedData.bio,
          headline: editedData.headline,
          location: editedData.location,
          website: editedData.website,
          phone: editedData.phone,
        }),
      });
      if (res.ok) {
        setUserData(editedData);
        addToast({ title: "Changes saved!", variant: "success" });
      } else {
        addToast({ title: "Failed to save", variant: "error" });
      }
    } catch {
      addToast({ title: "Failed to save", variant: "error" });
    }
  }

  async function aiGenerateSummary() {
    if (!displayData) return;
    setAiSummaryLoading(true);
    try {
      const context = [
        `Name: ${displayData.name}`,
        `Headline: ${displayData.headline || ""}`,
        `Skills: ${displayData.skills?.map((s: any) => s.name).join(", ") || ""}`,
        `Experience: ${displayData.experiences?.map((e: any) => `${e.position} at ${e.company}`).join("; ") || ""}`,
        `Projects: ${displayData.projects?.map((p: any) => p.title).join(", ") || ""}`,
      ].join(". ");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "resume-summary", context }),
      });
      const data = await res.json();
      if (data.text) {
        setEditedData((prev: any) => ({ ...prev, bio: data.text }));
        if (!editMode) setEditMode(true);
        addToast({ title: "Resume summary generated! Review and save.", variant: "success" });
      }
    } catch {
      addToast({ title: "Failed to generate summary", variant: "error" });
    }
    setAiSummaryLoading(false);
  }

  const displayData = editMode ? editedData : userData;
  const TemplateComponent = templateComponents[activeTemplate] || ProfessionalResume;
  const filteredTemplates = activeCategory === "all" ? templates : templates.filter((t) => t.category === activeCategory);

  function generateGenericPDF(doc: jsPDF, data: any, templateId: string) {
    const isDark = ["technical", "developer"].includes(templateId);
    const isCreative = ["creative", "modern-split", "bold"].includes(templateId);

    if (isDark) {
      doc.setFillColor(15, 15, 20);
      doc.rect(0, 0, 210, 297, "F");
    }

    if (isCreative) {
      const colors: Record<string, [number, number, number]> = {
        creative: [49, 46, 129],
        "modern-split": [13, 148, 136],
        bold: [17, 17, 17],
      };
      const c = colors[templateId] || [49, 46, 129];
      doc.setFillColor(c[0], c[1], c[2]);
      doc.rect(0, 0, 70, 297, "F");
    }

    let y = 20;
    const textX = isCreative ? 78 : 20;
    const maxW = isCreative ? 110 : 170;

    if (isCreative) {
      let sy = 30;
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(data.name || "Developer", 35, sy, { align: "center" });
      sy += 6;
      if (data.headline) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(data.headline, 35, sy, { align: "center" });
        sy += 8;
      }
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("CONTACT", 10, sy);
      sy += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      [data.email, data.phone, data.location, data.website].filter(Boolean).forEach((item: string) => {
        doc.text(item, 10, sy);
        sy += 4;
      });
      sy += 4;
      if (data.skills?.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.text("SKILLS", 10, sy);
        sy += 5;
        doc.setFont("helvetica", "normal");
        data.skills.forEach((s: any) => {
          doc.text(s.name, 10, sy);
          sy += 4;
        });
      }
    }

    const nameColor: [number, number, number] = isDark ? [120, 170, 250] : [0, 0, 0];
    const headlineColor: [number, number, number] = isDark ? [158, 206, 106] : [100, 100, 100];
    const sectionColor: [number, number, number] = isDark ? [187, 154, 247] : [30, 30, 30];
    const bodyColor: [number, number, number] = isDark ? [180, 180, 190] : [60, 60, 60];
    const subColor: [number, number, number] = isDark ? [100, 100, 110] : [120, 120, 120];

    if (!isCreative) {
      doc.setTextColor(...nameColor);
      doc.setFontSize(22);
      doc.setFont(isDark ? "courier" : "helvetica", "bold");
      doc.text(data.name || "Developer", textX, y);
      y += 7;

      if (data.headline) {
        doc.setFontSize(11);
        doc.setFont(isDark ? "courier" : "helvetica", "normal");
        doc.setTextColor(...headlineColor);
        doc.text(data.headline, textX, y);
        y += 6;
      }

      doc.setFontSize(8);
      doc.setTextColor(...subColor);
      const contact = [data.email, data.phone, data.location, data.website].filter(Boolean).join("  |  ");
      doc.text(contact, textX, y);
      y += 8;

      if (!isDark) {
        doc.setDrawColor(200);
        doc.line(textX, y, textX + maxW, y);
        y += 6;
      }
    }

    doc.setTextColor(...(isDark ? nameColor : [0, 0, 0] as [number, number, number]));

    if (data.bio) {
      doc.setFontSize(10);
      doc.setFont(isDark ? "courier" : "helvetica", "bold");
      doc.setTextColor(...sectionColor);
      doc.text(isDark ? "# about" : "ABOUT", textX, y);
      y += 6;
      doc.setFontSize(8);
      doc.setFont(isDark ? "courier" : "helvetica", "normal");
      doc.setTextColor(...bodyColor);
      const lines = doc.splitTextToSize(data.bio, maxW);
      doc.text(lines, textX, y);
      y += lines.length * 4 + 6;
    }

    if (!isCreative && data.skills?.length) {
      doc.setFontSize(10);
      doc.setFont(isDark ? "courier" : "helvetica", "bold");
      doc.setTextColor(...sectionColor);
      doc.text(isDark ? "# skills" : "SKILLS", textX, y);
      y += 6;
      doc.setFontSize(8);
      doc.setFont(isDark ? "courier" : "helvetica", "normal");
      doc.setTextColor(...bodyColor);
      const skillStr = data.skills.map((s: any) => s.name).join(isDark ? "  |  " : "  •  ");
      const sLines = doc.splitTextToSize(skillStr, maxW);
      doc.text(sLines, textX, y);
      y += sLines.length * 4 + 6;
    }

    if (data.projects?.length) {
      doc.setFontSize(10);
      doc.setFont(isDark ? "courier" : "helvetica", "bold");
      doc.setTextColor(...sectionColor);
      doc.text(isDark ? "# projects" : "PROJECTS", textX, y);
      y += 6;
      for (const proj of data.projects) {
        if (y > 265) { doc.addPage(); if (isDark) { doc.setFillColor(15, 15, 20); doc.rect(0, 0, 210, 297, "F"); } if (isCreative) { const c: Record<string, [number, number, number]> = { creative: [49, 46, 129], "modern-split": [13, 148, 136], bold: [17, 17, 17] }; const clr = c[templateId] || [49, 46, 129]; doc.setFillColor(clr[0], clr[1], clr[2]); doc.rect(0, 0, 70, 297, "F"); } y = 20; }
        doc.setFontSize(10);
        doc.setFont(isDark ? "courier" : "helvetica", "bold");
        doc.setTextColor(isDark ? 255 : 0, isDark ? 255 : 0, isDark ? 255 : 0);
        doc.text(proj.title, textX, y);
        y += 4.5;
        if (proj.description) {
          doc.setTextColor(...bodyColor);
          doc.setFontSize(8);
          doc.setFont(isDark ? "courier" : "helvetica", "normal");
          const lines = doc.splitTextToSize(proj.description, maxW);
          doc.text(lines, textX, y);
          y += lines.length * 3.5 + 2;
        }
        if (proj.techStack?.length) {
          doc.setFontSize(7);
          doc.setTextColor(...subColor);
          doc.text(proj.techStack.join(" · "), textX, y);
          y += 4;
        }
        y += 3;
      }
    }

    if (data.experiences?.length) {
      doc.setFontSize(10);
      doc.setFont(isDark ? "courier" : "helvetica", "bold");
      doc.setTextColor(...sectionColor);
      doc.text(isDark ? "# experience" : "EXPERIENCE", textX, y);
      y += 6;
      for (const exp of data.experiences) {
        if (y > 265) { doc.addPage(); if (isDark) { doc.setFillColor(15, 15, 20); doc.rect(0, 0, 210, 297, "F"); } if (isCreative) { const c: Record<string, [number, number, number]> = { creative: [49, 46, 129], "modern-split": [13, 148, 136], bold: [17, 17, 17] }; const clr = c[templateId] || [49, 46, 129]; doc.setFillColor(clr[0], clr[1], clr[2]); doc.rect(0, 0, 70, 297, "F"); } y = 20; }
        doc.setFontSize(10);
        doc.setFont(isDark ? "courier" : "helvetica", "bold");
        doc.setTextColor(isDark ? 255 : 0, isDark ? 255 : 0, isDark ? 255 : 0);
        doc.text(exp.position, textX, y);
        y += 4.5;
        doc.setFontSize(8);
        doc.setFont(isDark ? "courier" : "helvetica", "normal");
        doc.setTextColor(...subColor);
        doc.text(`${exp.company}  ·  ${formatDate(exp.startDate)} — ${exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}`, textX, y);
        y += 5;
        if (exp.description) {
          doc.setTextColor(...bodyColor);
          doc.setFontSize(8);
          const lines = doc.splitTextToSize(exp.description, maxW);
          doc.text(lines, textX, y);
          y += lines.length * 3.5 + 3;
        }
        y += 3;
      }
    }

    if (data.educations?.length) {
      if (y > 250) { doc.addPage(); if (isDark) { doc.setFillColor(15, 15, 20); doc.rect(0, 0, 210, 297, "F"); } y = 20; }
      doc.setFontSize(10);
      doc.setFont(isDark ? "courier" : "helvetica", "bold");
      doc.setTextColor(...sectionColor);
      doc.text(isDark ? "# education" : "EDUCATION", textX, y);
      y += 6;
      for (const edu of data.educations) {
        doc.setFontSize(10);
        doc.setFont(isDark ? "courier" : "helvetica", "bold");
        doc.setTextColor(isDark ? 255 : 0, isDark ? 255 : 0, isDark ? 255 : 0);
        doc.text(`${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, textX, y);
        y += 4.5;
        doc.setFontSize(8);
        doc.setFont(isDark ? "courier" : "helvetica", "normal");
        doc.setTextColor(...subColor);
        doc.text(`${edu.institution}  ·  ${formatDate(edu.startDate)} — ${edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}`, textX, y);
        y += 7;
      }
    }
  }

  async function generatePDF() {
    if (!displayData) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      generateGenericPDF(doc, displayData, activeTemplate);
      doc.save(`${displayData.name || "resume"}-${activeTemplate}.pdf`);
      addToast({ title: "Resume downloaded!", variant: "success" });
    } catch {
      addToast({ title: "Failed to generate PDF", variant: "error" });
    }
    setIsGenerating(false);
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Resume Generator</h1>
            <p className="text-gray-400 mt-1">
              {templates.length} templates · Choose, edit, and download as PDF
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={aiGenerateSummary}
              disabled={aiSummaryLoading || !userData}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {aiSummaryLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              AI Summary
            </Button>
            {editMode && (
              <Button variant="secondary" onClick={saveEdits}>
                <Save className="h-4 w-4 mr-2" />
                Save Edits
              </Button>
            )}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <Pencil className="h-3.5 w-3.5 text-gray-400" />
              <Label className="text-xs cursor-pointer">Edit Mode</Label>
              <Switch checked={editMode} onCheckedChange={setEditMode} />
            </div>
            <Button onClick={generatePDF} disabled={isGenerating || !displayData}>
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Category Filter */}
      <FadeIn delay={0.05}>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Template Selector */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {filteredTemplates.map((tmpl) => (
            <motion.button
              key={tmpl.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTemplate(tmpl.id)}
              className={cn(
                "relative p-3 rounded-xl border-2 text-left transition-all",
                activeTemplate === tmpl.id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              {activeTemplate === tmpl.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <div className={cn("w-full h-12 rounded-md mb-2", tmpl.preview)} />
              <h3 className="font-medium text-white text-xs">{tmpl.name}</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{tmpl.description}</p>
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {editMode && (
        <FadeIn delay={0.15}>
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Pencil className="h-4 w-4 text-indigo-400" />
            <p className="text-sm text-indigo-300">
              <strong>Edit mode active</strong> — Click on the name, headline, or bio text in the preview below to edit directly. Click &quot;Save Edits&quot; to persist changes.
            </p>
          </div>
        </FadeIn>
      )}

      {/* Live Preview */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                {templates.find((t) => t.id === activeTemplate)?.name} Resume
                <Badge variant="secondary" className="ml-2 text-[10px]">A4</Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {displayData ? (
              <div className="overflow-x-auto pb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTemplate}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg overflow-hidden"
                  >
                    <TemplateComponent
                      data={displayData}
                      editable={editMode}
                      onEdit={handleEdit}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">Loading profile data...</div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
