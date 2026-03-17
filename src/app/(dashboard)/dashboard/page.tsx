"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { Eye, MousePointerClick, FolderKanban, Zap, Briefcase, Users, Layers, Sparkles, Loader2, X, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    views: 0,
    clicks: 0,
  });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projects, skills, experiences, analytics] = await Promise.all([
          fetch("/api/projects").then((r) => r.json()),
          fetch("/api/skills").then((r) => r.json()),
          fetch("/api/experience").then((r) => r.json()),
          fetch("/api/analytics").then((r) => r.json()),
        ]);

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          experiences: Array.isArray(experiences) ? experiences.length : 0,
          views: analytics?.totalViews || 0,
          clicks: analytics?.totalClicks || 0,
        });
      } catch {}
    }
    fetchStats();
  }, []);

  async function runAiReview() {
    setReviewOpen(true);
    setReviewLoading(true);
    setReviewText("");
    try {
      const [profile, projects, skills, experiences, educations] = await Promise.all([
        fetch("/api/profile").then(r => r.json()).catch(() => ({})),
        fetch("/api/projects").then(r => r.json()).catch(() => []),
        fetch("/api/skills").then(r => r.json()).catch(() => []),
        fetch("/api/experience").then(r => r.json()).catch(() => []),
        fetch("/api/education").then(r => r.json()).catch(() => []),
      ]);

      const context = [
        `Name: ${profile.name || "not set"}`,
        `Headline: ${profile.headline || "not set"}`,
        `Bio: ${profile.bio || "not set"}`,
        `Location: ${profile.location || "not set"}`,
        `Website: ${profile.website || "not set"}`,
        `Projects (${Array.isArray(projects) ? projects.length : 0}): ${Array.isArray(projects) ? projects.map((p: any) => `${p.title} [${p.techStack?.join(",")}]`).join("; ") : "none"}`,
        `Skills (${Array.isArray(skills) ? skills.length : 0}): ${Array.isArray(skills) ? skills.map((s: any) => s.name).join(", ") : "none"}`,
        `Experience (${Array.isArray(experiences) ? experiences.length : 0}): ${Array.isArray(experiences) ? experiences.map((e: any) => `${e.position} at ${e.company}`).join("; ") : "none"}`,
        `Education (${Array.isArray(educations) ? educations.length : 0}): ${Array.isArray(educations) ? educations.map((e: any) => `${e.degree} at ${e.institution}`).join("; ") : "none"}`,
      ].join(". ");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "portfolio-review", context }),
      });
      const data = await res.json();
      setReviewText(data.text || "Could not generate review at this time.");
    } catch {
      setReviewText("Failed to generate portfolio review. Please try again.");
    }
    setReviewLoading(false);
  }

  const statCards = [
    { title: "Portfolio Views", value: stats.views, icon: Eye, color: "from-blue-500 to-cyan-500" },
    { title: "Project Clicks", value: stats.clicks, icon: MousePointerClick, color: "from-purple-500 to-pink-500" },
    { title: "Projects", value: stats.projects, icon: FolderKanban, color: "from-indigo-500 to-purple-500" },
    { title: "Skills", value: stats.skills, icon: Zap, color: "from-amber-500 to-orange-500" },
    { title: "Experience", value: stats.experiences, icon: Briefcase, color: "from-emerald-500 to-teal-500" },
  ];

  const reviewLines = reviewText.split("\n").filter(l => l.trim());

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-theme-text">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Developer"}
            </h1>
            <p className="text-theme-text-secondary mt-1">Here&apos;s an overview of your portfolio</p>
          </div>
          <Button
            onClick={runAiReview}
            disabled={reviewLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-500/20"
          >
            {reviewLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            AI Portfolio Review
          </Button>
        </div>
      </FadeIn>

      {/* AI Review Modal */}
      <AnimatePresence>
        {reviewOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-theme-accent/20 bg-theme-accent-soft backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-theme-accent" />
                    AI Portfolio Review
                  </CardTitle>
                  <button onClick={() => setReviewOpen(false)} className="p-1.5 rounded-lg hover:bg-theme-accent-soft text-theme-text-secondary hover:text-theme-text transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {reviewLoading ? (
                  <div className="flex items-center gap-3 py-8 justify-center text-theme-text-secondary">
                    <Loader2 className="h-5 w-5 animate-spin text-theme-accent" />
                    <span>Analyzing your portfolio...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviewLines.map((line, i) => {
                      const cleaned = line.replace(/^[\d\-\.\*]+\s*/, "").trim();
                      if (!cleaned) return null;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-theme-card border border-theme-border"
                        >
                          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-theme-text-secondary leading-relaxed">{cleaned}</p>
                        </motion.div>
                      );
                    })}
                    <div className="flex justify-end pt-2">
                      <Button size="sm" variant="ghost" onClick={runAiReview} disabled={reviewLoading}>
                        <Sparkles className="h-3.5 w-3.5 mr-1" /> Regenerate
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <StaggerItem key={stat.title}>
            <Card className="border-theme-border bg-theme-card backdrop-blur-xl hover:bg-theme-accent-soft transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-theme-text-secondary">{stat.title}</p>
                    <p className="text-3xl font-bold text-theme-text mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <stat.icon className="h-5 w-5 text-theme-text" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Edit Profile", desc: "Update your personal information", href: "/dashboard/profile", icon: Users },
                { title: "Portfolio Builder", desc: "Add projects, skills, experience & more", href: "/dashboard/portfolio-builder", icon: Layers },
                { title: "View Analytics", desc: "Track your portfolio performance", href: "/dashboard/analytics", icon: Eye },
              ].map((action) => (
                <motion.a
                  key={action.href}
                  href={action.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-accent-soft transition-all group"
                >
                  <action.icon className="h-8 w-8 text-theme-accent mb-3" />
                  <h3 className="font-medium text-theme-text">{action.title}</h3>
                  <p className="text-sm text-theme-text-secondary mt-1">{action.desc}</p>
                </motion.a>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
