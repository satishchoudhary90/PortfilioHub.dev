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
  {
    icon: Code2,
    title: "Smart Portfolio Builder",
    desc: "Create stunning portfolios with our intuitive dashboard. No coding required.",
  },
  {
    icon: Palette,
    title: "4 Beautiful Templates",
    desc: "Choose from Minimal, Dark Hacker, Modern Tech, or Creative Designer themes.",
  },
  {
    icon: BarChart3,
    title: "Built-in Analytics",
    desc: "Track portfolio views, project clicks, and visitor demographics.",
  },
  {
    icon: FileText,
    title: "Resume Generator",
    desc: "Automatically generate a professional PDF resume from your profile.",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    desc: "Import your repositories directly from GitHub with one click.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    desc: "Generate professional bios and project descriptions with AI.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Built with Next.js for optimal performance and SEO.",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    desc: "Email/password and Google OAuth authentication.",
  },
  {
    icon: Layout,
    title: "Fully Customizable",
    desc: "Customize colors, fonts, layout, and dark/light mode.",
  },
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
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-bold"
          >
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs sm:text-sm font-bold">
              D
            </div>
            <span className="hidden xs:inline">DevPortfolio</span>
            <span className="xs:hidden">Dev</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm px-1.5 sm:px-4 h-8 sm:h-9"
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="text-xs sm:text-sm px-1.5 sm:px-4 h-8 sm:h-9"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-14 sm:pt-16 px-3 sm:px-6">
        <div className="text-center max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-3 sm:mb-6 text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-4">
              <Sparkles className="h-2.5 sm:h-3.5 w-2.5 sm:w-3.5 mr-0.5 sm:mr-1.5" />
              <span className="hidden xs:inline">
                Build your developer portfolio in minutes
              </span>
              <span className="xs:hidden">Build portfolios in minutes</span>
            </Badge>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight px-2 xs:px-0">
              Create{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Beautiful
              </span>{" "}
              <span className="block xs:inline">Developer Portfolios</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mt-3 sm:mt-6 max-w-2xl mx-auto px-2 sm:px-0">
              Showcase your skills, projects, and experience with stunning
              portfolio websites. Choose from 4 themes, customize everything,
              and deploy instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-10 px-2 sm:px-0">
              <Link href="/register" className="w-full xs:w-auto">
                <Button
                  size="lg"
                  className="text-sm sm:text-base w-full xs:w-auto px-6 sm:px-8"
                >
                  Start Building{" "}
                  <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                </Button>
              </Link>
              <Link href="/register" className="w-full xs:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-sm sm:text-base w-full xs:w-auto px-6 sm:px-8"
                >
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
            className="mt-12 sm:mt-20 relative px-2 sm:px-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 sm:p-4 shadow-2xl">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500/60" />
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-yellow-500/60" />
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500/60" />
                <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2 truncate">
                  devportfolio.com/johndoe
                </span>
              </div>
              <div className="rounded-md sm:rounded-lg bg-slate-900 p-3 sm:p-8 text-left">
                <div className="space-y-2 sm:space-y-4">
                  <div className="h-3 sm:h-4 w-24 sm:w-32 bg-indigo-500/20 rounded animate-pulse" />
                  <div className="h-5 sm:h-8 w-40 sm:w-64 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 sm:h-4 w-full max-w-xs sm:max-w-md bg-white/5 rounded animate-pulse" />
                  <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-6">
                    <div className="h-7 sm:h-10 w-7 sm:w-10 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-7 sm:h-10 w-7 sm:w-10 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-7 sm:h-10 w-7 sm:w-10 rounded-full bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-24 px-3 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold px-2 sm:px-0">
              Everything You Need
            </h2>
            <p className="text-gray-400 mt-2 sm:mt-4 text-sm sm:text-lg px-2 sm:px-0">
              All the tools to build and manage your developer portfolio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-4 sm:p-6 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all"
              >
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-600/20 w-fit group-hover:bg-indigo-600/30 transition-colors">
                  <feature.icon className="h-5 sm:h-6 w-5 sm:w-6 text-indigo-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mt-3 sm:mt-4">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section className="py-12 sm:py-24 px-3 sm:px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold px-2 sm:px-0">
              4 Stunning Templates
            </h2>
            <p className="text-gray-400 mt-2 sm:mt-4 text-sm sm:text-lg px-2 sm:px-0">
              Choose the perfect look for your portfolio
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-12">
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
                className={`aspect-[3/4] rounded-lg sm:rounded-xl bg-gradient-to-b ${template.color} border border-white/10 p-2.5 sm:p-4 flex items-end`}
              >
                <p className="text-xs sm:text-sm font-medium text-white/80">
                  {template.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-24 px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold px-2 sm:px-0">
            Ready to build your{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              portfolio
            </span>
            ?
          </h2>
          <p className="text-gray-400 mt-3 sm:mt-4 text-sm sm:text-lg px-2 sm:px-0">
            Join developers who have built stunning portfolios with DevPortfolio
            Builder
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="mt-6 sm:mt-8 text-sm sm:text-base w-full xs:w-auto px-6 sm:px-8"
            >
              Get Started for Free{" "}
              <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-5 sm:w-6 h-5 sm:h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white">
                D
              </div>
              <span className="text-xs sm:text-sm">DevPortfolio Builder</span>
            </div>
            <p className="text-[10px] sm:text-sm text-gray-600 text-center sm:text-right">
              Built with Next.js, Tailwind CSS & Framer Motion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
