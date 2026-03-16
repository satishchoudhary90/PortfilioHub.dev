"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { Eye, MousePointerClick, FolderKanban, Zap, Briefcase, Users, Layers } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    views: 0,
    clicks: 0,
  });

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

  const statCards = [
    { title: "Portfolio Views", value: stats.views, icon: Eye, color: "from-blue-500 to-cyan-500" },
    { title: "Project Clicks", value: stats.clicks, icon: MousePointerClick, color: "from-purple-500 to-pink-500" },
    { title: "Projects", value: stats.projects, icon: FolderKanban, color: "from-indigo-500 to-purple-500" },
    { title: "Skills", value: stats.skills, icon: Zap, color: "from-amber-500 to-orange-500" },
    { title: "Experience", value: stats.experiences, icon: Briefcase, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Developer"}
          </h1>
          <p className="text-gray-400 mt-1">Here&apos;s an overview of your portfolio</p>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <StaggerItem key={stat.title}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
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
                  className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <action.icon className="h-8 w-8 text-indigo-400 mb-3" />
                  <h3 className="font-medium text-white">{action.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{action.desc}</p>
                </motion.a>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
