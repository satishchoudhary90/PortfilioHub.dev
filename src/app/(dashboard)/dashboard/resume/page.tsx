"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/shared/motion-wrapper";
import { Download, FileText, Check, Pencil, Save, Sparkles, Loader2, Camera, Upload, X, User } from "lucide-react";
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
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((data) => {
        setUserData(data);
        setEditedData(data);
      })
      .catch(() => {});
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 400 }, height: { ideal: 400 } },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      addToast({ title: "Could not access camera. Please check permissions.", variant: "error" });
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d")!;
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 300, 300);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopCamera();
    savePhoto(dataUrl);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast({ title: "Please select an image file", variant: "error" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast({ title: "Image must be under 2MB", variant: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d")!;
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        savePhoto(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function savePhoto(dataUrl: string) {
    setPhotoSaving(true);
    try {
      const res = await fetch("/api/profile/photo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: dataUrl }),
      });
      if (res.ok) {
        setUserData((prev: any) => ({ ...prev, image: dataUrl }));
        setEditedData((prev: any) => ({ ...prev, image: dataUrl }));
        addToast({ title: "Photo saved!", variant: "success" });
      } else {
        const json = await res.json();
        addToast({ title: json.error || "Failed to save photo", variant: "error" });
      }
    } catch {
      addToast({ title: "Failed to save photo", variant: "error" });
    }
    setPhotoSaving(false);
  }

  async function removePhoto() {
    setPhotoSaving(true);
    try {
      const res = await fetch("/api/profile/photo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: null }),
      });
      if (res.ok) {
        setUserData((prev: any) => ({ ...prev, image: null }));
        setEditedData((prev: any) => ({ ...prev, image: null }));
        addToast({ title: "Photo removed", variant: "success" });
      }
    } catch {
      addToast({ title: "Failed to remove photo", variant: "error" });
    }
    setPhotoSaving(false);
  }

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

    // Add photo to PDF if available
    if (data.image && typeof data.image === "string" && data.image.startsWith("data:image")) {
      try {
        if (isCreative) {
          doc.addImage(data.image, "JPEG", 15, 10, 20, 20);
        } else {
          doc.addImage(data.image, "JPEG", textX, y - 5, 18, 18);
        }
      } catch {}
    }

    const hasPhoto = data.image && typeof data.image === "string" && data.image.startsWith("data:image");
    const nameX = !isCreative && hasPhoto ? textX + 22 : textX;

    if (isCreative) {
      let sy = hasPhoto ? 34 : 30;
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
      const headerY = hasPhoto ? y + 2 : y;
      doc.setTextColor(...nameColor);
      doc.setFontSize(22);
      doc.setFont(isDark ? "courier" : "helvetica", "bold");
      doc.text(data.name || "Developer", nameX, headerY);

      let hy = headerY + 7;
      if (data.headline) {
        doc.setFontSize(11);
        doc.setFont(isDark ? "courier" : "helvetica", "normal");
        doc.setTextColor(...headlineColor);
        doc.text(data.headline, nameX, hy);
        hy += 6;
      }

      doc.setFontSize(8);
      doc.setTextColor(...subColor);
      const contact = [data.email, data.phone, data.location, data.website].filter(Boolean).join("  |  ");
      doc.text(contact, textX, hasPhoto ? Math.max(hy, y + 16) : hy);
      y = (hasPhoto ? Math.max(hy, y + 16) : hy) + 8;

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

      {/* Resume Photo */}
      <FadeIn delay={0.08}>
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Photo preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
                  {displayData?.image ? (
                    <img src={displayData.image} alt="Resume photo" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-gray-600" />
                  )}
                </div>
                {displayData?.image && (
                  <button
                    onClick={removePhoto}
                    disabled={photoSaving}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    title="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Camera / Upload controls */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-medium text-white mb-1">Resume Photo</h3>
                <p className="text-xs text-gray-500 mb-3">Take a photo with your camera or upload one. It will appear on your resume.</p>
                
                <AnimatePresence mode="wait">
                  {cameraOpen ? (
                    <motion.div
                      key="camera"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="relative w-48 h-48 mx-auto sm:mx-0 rounded-xl overflow-hidden border border-white/10 bg-black">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" style={{ transform: "scaleX(-1)" }} />
                      </div>
                      <div className="flex gap-2 justify-center sm:justify-start">
                        <Button size="sm" onClick={capturePhoto}>
                          <Camera className="h-3.5 w-3.5 mr-1.5" />
                          Capture
                        </Button>
                        <Button size="sm" variant="secondary" onClick={stopCamera}>
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 justify-center sm:justify-start flex-wrap">
                      <Button size="sm" variant="secondary" onClick={startCamera} disabled={photoSaving}>
                        <Camera className="h-3.5 w-3.5 mr-1.5" />
                        Camera
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={photoSaving}>
                        {photoSaving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}
                        Upload
                      </Button>
                      {displayData?.image && (
                        <Button size="sm" variant="secondary" onClick={removePhoto} disabled={photoSaving} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Remove
                        </Button>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </CardContent>
        </Card>
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
