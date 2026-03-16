"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Palette,
  BarChart3,
  FileText,
  Github,
  Zap,
  Shield,
  Layout,
} from "lucide-react";

const features = [
  { icon: Code2, title: "Smart Portfolio Builder", desc: "Create stunning portfolios with our intuitive dashboard. No coding required." },
  { icon: Palette, title: "4 Beautiful Templates", desc: "Choose from Minimal, Dark Hacker, Modern Tech, or Creative Designer themes." },
  { icon: BarChart3, title: "Built-in Analytics", desc: "Track portfolio views, project clicks, and visitor demographics." },
  { icon: FileText, title: "Resume Generator", desc: "Automatically generate a professional PDF resume from your profile." },
  { icon: Github, title: "GitHub Integration", desc: "Import your repositories directly from GitHub with one click." },
  { icon: Sparkles, title: "AI-Powered", desc: "Generate professional bios and project descriptions with AI." },
  { icon: Zap, title: "Lightning Fast", desc: "Built with Next.js for optimal performance and SEO." },
  { icon: Shield, title: "Secure Auth", desc: "Email/password and Google OAuth authentication." },
  { icon: Layout, title: "Fully Customizable", desc: "Customize colors, fonts, layout, and dark/light mode." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              D
            </div>
            DevPortfolio
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-4xl relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 text-sm py-1.5 px-4">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Build your developer portfolio in minutes
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Create{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Beautiful
              </span>{" "}
              Developer Portfolios
            </h1>
            <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
              Showcase your skills, projects, and experience with stunning portfolio websites.
              Choose from 4 themes, customize everything, and deploy instantly.
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Building <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="text-base">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-gray-500 ml-2">devportfolio.com/johndoe</span>
              </div>
              <div className="rounded-lg bg-slate-900 p-8 text-left">
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-indigo-500/20 rounded animate-pulse" />
                  <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
                  <div className="flex gap-3 mt-6">
                    <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold">Everything You Need</h2>
            <p className="text-gray-400 mt-4 text-lg">
              All the tools to build and manage your developer portfolio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all"
              >
                <div className="p-3 rounded-xl bg-indigo-600/20 w-fit group-hover:bg-indigo-600/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">{feature.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold">4 Stunning Templates</h2>
            <p className="text-gray-400 mt-4 text-lg">Choose the perfect look for your portfolio</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { name: "Minimal", color: "from-slate-800 to-indigo-900" },
              { name: "Dark Hacker", color: "from-black to-green-950" },
              { name: "Modern Tech", color: "from-slate-900 to-purple-950" },
              { name: "Creative", color: "from-orange-50 to-amber-50" },
            ].map((template, i) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className={`aspect-[3/4] rounded-xl bg-gradient-to-b ${template.color} border border-white/10 p-4 flex items-end`}
              >
                <p className="text-sm font-medium text-white/80">{template.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to build your{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              portfolio
            </span>
            ?
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Join developers who have built stunning portfolios with DevPortfolio Builder
          </p>
          <Link href="/register">
            <Button size="lg" className="mt-8 text-base">
              Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
              D
            </div>
            DevPortfolio Builder
          </div>
          <p className="text-sm text-gray-600">Built with Next.js, Tailwind CSS & Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
