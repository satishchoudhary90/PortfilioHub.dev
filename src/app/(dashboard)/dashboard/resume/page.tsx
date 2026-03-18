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
import {
  Download,
  FileText,
  Check,
  Pencil,
  Save,
  Sparkles,
  Loader2,
  Camera,
  Upload,
  X,
  User,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  {
    id: "professional",
    name: "Professional",
    description: "Classic corporate with serif fonts",
    preview: "bg-white border-b-4 border-gray-800",
    category: "classic",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean centered with whitespace",
    preview: "bg-white border-t border-gray-200",
    category: "clean",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Two-column with indigo sidebar",
    preview: "bg-gradient-to-r from-indigo-900 from-35% to-white to-35%",
    category: "creative",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Terminal-inspired dark theme",
    preview: "bg-gray-950 border border-green-500/30",
    category: "developer",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Luxury with gold accents",
    preview: "bg-slate-800 border-b-2 border-yellow-600",
    category: "classic",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Traditional academic CV style",
    preview: "bg-white border-b-2 border-blue-800",
    category: "classic",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Modern gradient & playful pills",
    preview: "bg-gradient-to-r from-violet-600 to-fuchsia-500",
    category: "creative",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined, magazine-inspired",
    preview: "bg-neutral-100 border border-neutral-200",
    category: "clean",
  },
  {
    id: "bold",
    name: "Bold",
    description: "High contrast black & red",
    preview: "bg-gradient-to-r from-gray-900 from-30% to-white to-30%",
    category: "creative",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Maximum info, minimal space",
    preview: "bg-white border border-gray-300",
    category: "clean",
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Teal sidebar with progress bars",
    preview: "bg-gradient-to-r from-teal-600 from-35% to-white to-35%",
    category: "creative",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Code editor Tokyo Night theme",
    preview: "bg-[#1a1b26] border border-[#7aa2f7]/30",
    category: "developer",
  },
  {
    id: "infographic",
    name: "Infographic",
    description: "Visual with charts & timeline",
    preview: "bg-white border-l-4 border-emerald-500",
    category: "creative",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless black & white ATS-friendly",
    preview: "bg-white border-t-2 border-b-2 border-black",
    category: "classic",
  },
];

const templateComponents: Record<
  string,
  React.ComponentType<{
    data: any;
    editable?: boolean;
    onEdit?: (field: string, value: string) => void;
  }>
> = {
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
  const resumeRef = useRef<HTMLDivElement>(null);

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
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 400 },
          height: { ideal: 400 },
        },
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
      addToast({
        title: "Could not access camera. Please check permissions.",
        variant: "error",
      });
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
        addToast({
          title: json.error || "Failed to save photo",
          variant: "error",
        });
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
        addToast({
          title: "Resume summary generated! Review and save.",
          variant: "success",
        });
      }
    } catch {
      addToast({ title: "Failed to generate summary", variant: "error" });
    }
    setAiSummaryLoading(false);
  }

  const displayData = editMode ? editedData : userData;
  const TemplateComponent =
    templateComponents[activeTemplate] || ProfessionalResume;
  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  async function generatePDF() {
    if (!displayData || !resumeRef.current) return;
    setIsGenerating(true);
    try {
      // Temporarily remove any overflow restrictions for capture
      const originalOverflow = resumeRef.current.style.overflow;
      const originalMaxHeight = resumeRef.current.style.maxHeight;
      const originalWidth = resumeRef.current.style.width;
      const originalMinHeight = resumeRef.current.style.minHeight;

      // Set A4 dimensions for capture (794x1123px = A4 at 96 DPI)
      resumeRef.current.style.overflow = "visible";
      resumeRef.current.style.maxHeight = "none";
      resumeRef.current.style.width = "794px";
      resumeRef.current.style.minHeight = "1123px";

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capture the resume component as canvas with A4 dimensions
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // High quality for crisp text
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794, // A4 width in pixels
        height: 1123, // A4 height in pixels
        scrollX: 0,
        scrollY: 0,
      });

      // Restore original styles
      resumeRef.current.style.overflow = originalOverflow;
      resumeRef.current.style.maxHeight = originalMaxHeight;
      resumeRef.current.style.width = originalWidth;
      resumeRef.current.style.minHeight = originalMinHeight;

      // Create PDF with exact A4 dimensions
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      // Add small margins (5mm on each side)
      const margin = 5;
      const contentWidth = a4Width - margin * 2;
      const contentHeight = a4Height - margin * 2;

      // Calculate scaling to fit content within margins
      const scaleX = contentWidth / (canvas.width / (canvas.width / a4Width));
      const scaleY =
        contentHeight / (canvas.height / (canvas.height / a4Height));
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = a4Width * scale;
      const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

      if (scaledHeight <= a4Height) {
        // Single page - center the content
        const xOffset = (a4Width - scaledWidth) / 2;
        const yOffset = (a4Height - scaledHeight) / 2;
        pdf.addImage(
          imgData,
          "PNG",
          xOffset,
          yOffset,
          scaledWidth,
          scaledHeight,
        );
      } else {
        // Multiple pages - fit to width with margins
        const finalWidth = contentWidth;
        const finalHeight = (canvas.height * finalWidth) / canvas.width;
        let position = margin;
        let heightLeft = finalHeight;

        // Add first page
        pdf.addImage(imgData, "PNG", margin, position, finalWidth, finalHeight);
        heightLeft -= a4Height - margin;

        // Add additional pages if needed
        while (heightLeft >= margin) {
          position = heightLeft - finalHeight;
          pdf.addPage();
          pdf.addImage(
            imgData,
            "PNG",
            margin,
            position,
            finalWidth,
            finalHeight,
          );
          heightLeft -= a4Height;
        }
      }

      pdf.save(`${displayData.name || "resume"}-${activeTemplate}.pdf`);
      addToast({ title: "Resume downloaded!", variant: "success" });
    } catch (error) {
      console.error("PDF generation failed:", error);
      addToast({ title: "Failed to generate PDF", variant: "error" });
    }
    setIsGenerating(false);
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-theme-text">
                Resume Generator
              </h1>
              <p className="text-sm sm:text-base text-theme-text-secondary mt-1">
                {templates.length} templates ·{" "}
                <span className="hidden xs:inline">Choose, edit, and d</span>
                <span className="xs:hidden">D</span>ownload as PDF
              </p>
            </div>
            <div className="flex flex-row items-center gap-1 md:gap-3 overflow-x-auto">
              <Button
                variant="outline"
                onClick={aiGenerateSummary}
                disabled={aiSummaryLoading || !userData}
                className="text-theme-text hover:text-white border border-theme-border bg-transparent hover:bg-[#6366F1] text-xs md:text-sm min-h-[36px] md:min-h-[44px] min-w-[36px] md:min-w-auto px-2 md:px-4 whitespace-nowrap transition-all"
              >
                {aiSummaryLoading ? (
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-0 md:mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-0 md:mr-2" />
                )}
                <span className="hidden md:inline">AI Summary</span>
                <span className="md:hidden">AI</span>
              </Button>
              {editMode && (
                <Button
                  variant="outline"
                  onClick={saveEdits}
                  className="text-theme-text hover:text-white border border-theme-border bg-transparent hover:bg-[#6366F1] text-xs md:text-sm min-h-[36px] md:min-h-[44px] min-w-[36px] md:min-w-auto px-2 md:px-4 whitespace-nowrap transition-all"
                >
                  <Save className="h-3 w-3 md:h-4 md:w-4 mr-0 md:mr-2" />
                  <span className="hidden md:inline">Save Edits</span>
                  <span className="md:hidden">Save</span>
                </Button>
              )}
              <div className="flex items-center gap-0.5 md:gap-2 px-0 md:px-3 py-0 md:py-2 md:rounded-lg md:bg-theme-card md:border md:border-theme-border min-h-[36px] md:min-h-[44px]">
                {/* Mobile: Pencil Icon Button */}
                <Button
                  variant="outline"
                  onClick={() => setEditMode(!editMode)}
                  className={`md:hidden min-h-[36px] min-w-[36px] p-0 border transition-all ${
                    editMode
                      ? "bg-[#6366F1] text-white border-[#6366F1] hover:bg-[#6366F1]/90"
                      : "bg-transparent text-theme-text border-theme-border hover:bg-[#6366F1] hover:text-white hover:border-[#6366F1]"
                  }`}
                >
                  <Pencil className="h-3 w-3" />
                </Button>

                {/* Desktop: Switch with Label */}
                <Pencil className="h-3.5 w-3.5 text-theme-text-secondary hidden md:inline" />
                <Label className="text-[8px] md:text-xs cursor-pointer hidden md:inline">
                  Edit Mode
                </Label>
                <Switch
                  checked={editMode}
                  onCheckedChange={setEditMode}
                  className="hidden md:flex"
                />
              </div>
              <Button
                variant="outline"
                onClick={generatePDF}
                disabled={isGenerating || !displayData}
                className="text-theme-text hover:text-white border border-theme-border bg-transparent hover:bg-[#6366F1] text-xs md:text-sm min-h-[36px] md:min-h-[44px] min-w-[36px] md:min-w-auto px-2 md:px-4 whitespace-nowrap transition-all"
              >
                <Download className="h-3 w-3 md:h-4 md:w-4 mr-0 md:mr-2" />
                <span className="hidden md:inline">
                  {isGenerating ? "Generating..." : "Download PDF"}
                </span>
                <span className="md:hidden">
                  {isGenerating ? "..." : "PDF"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Category Filter */}
      <FadeIn delay={0.05}>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[44px] sm:min-h-auto",
                activeCategory === cat.id
                  ? "bg-theme-accent text-theme-text"
                  : "bg-theme-card text-theme-text-secondary hover:bg-theme-accent-soft hover:text-theme-text",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Resume Photo */}
      <FadeIn delay={0.08}>
        <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Photo preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-theme-border bg-theme-card flex items-center justify-center">
                  {displayData?.image ? (
                    <img
                      src={displayData.image}
                      alt="Resume photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-theme-muted" />
                  )}
                </div>
                {displayData?.image && (
                  <button
                    onClick={removePhoto}
                    disabled={photoSaving}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500/90 text-theme-text opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    title="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Camera / Upload controls */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-medium text-theme-text mb-1">
                  Resume Photo
                </h3>
                <p className="text-xs text-theme-muted mb-3">
                  Take a photo with your camera or upload one. It will appear on
                  your resume.
                </p>

                <AnimatePresence mode="wait">
                  {cameraOpen ? (
                    <motion.div
                      key="camera"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="relative w-48 h-48 mx-auto sm:mx-0 rounded-xl overflow-hidden border border-theme-border bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover mirror"
                          style={{ transform: "scaleX(-1)" }}
                        />
                      </div>
                      <div className="flex gap-2 justify-center sm:justify-start">
                        <Button size="sm" onClick={capturePhoto}>
                          <Camera className="h-3.5 w-3.5 mr-1.5" />
                          Capture
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={stopCamera}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 justify-center sm:justify-start flex-wrap"
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={startCamera}
                        disabled={photoSaving}
                      >
                        <Camera className="h-3.5 w-3.5 mr-1.5" />
                        Camera
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={photoSaving}
                      >
                        {photoSaving ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Upload
                      </Button>
                      {displayData?.image && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={removePhoto}
                          disabled={photoSaving}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Remove
                        </Button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {filteredTemplates.map((tmpl) => (
            <motion.button
              key={tmpl.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTemplate(tmpl.id)}
              className={cn(
                "relative p-3 rounded-xl border-2 text-left transition-all min-h-[120px] sm:min-h-auto",
                activeTemplate === tmpl.id
                  ? "border-theme-accent bg-theme-accent-soft"
                  : "border-theme-border bg-theme-card hover:border-theme-accent/50",
              )}
            >
              {activeTemplate === tmpl.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-theme-text" />
                </div>
              )}
              <div
                className={cn("w-full h-12 rounded-md mb-2", tmpl.preview)}
              />
              <h3 className="font-medium text-theme-text text-xs sm:text-sm">
                {tmpl.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-theme-muted mt-0.5 line-clamp-2">
                {tmpl.description}
              </p>
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {editMode && (
        <FadeIn delay={0.15}>
          <div className="flex items-start sm:items-center gap-2 px-3 sm:px-4 py-3 rounded-lg bg-theme-accent-soft border border-theme-accent/20">
            <Pencil className="h-4 w-4 text-theme-accent shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm text-theme-accent">
              <strong>Edit mode active</strong> —{" "}
              <span className="hidden sm:inline">
                Click on the name, headline, or bio text in the preview below to
                edit directly. Click &quot;Save Edits&quot; to persist changes.
              </span>
              <span className="sm:hidden">
                Tap text in preview to edit. Tap Save to keep changes.
              </span>
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
                <FileText className="h-5 w-5 text-theme-accent" />
                {templates.find((t) => t.id === activeTemplate)?.name} Resume
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  A4
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {displayData ? (
              <div className="overflow-x-auto pb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    ref={resumeRef}
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
              <div className="text-center py-12 text-theme-text-secondary">
                Loading profile data...
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
