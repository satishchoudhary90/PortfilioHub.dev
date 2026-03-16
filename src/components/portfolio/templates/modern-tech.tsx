"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function ModernTechTemplate({ data }: { data: { user: any } }) {
  const { user } = data;
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...contactForm, userId: user.id }) });
    setSending(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Gradient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative px-4">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-400" /> Available for work
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user.name?.split(" ")[0] || "Developer"}
              </span>
            </h1>
            <p className="text-xl text-gray-400 mt-4">{user.headline || "Building the future with code"}</p>
            <div className="flex gap-3 mt-8">
              {user.socialLinks?.map((link: any) => {
                const Icon = socialIcons[link.platform] || Globe;
                return <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Icon className="h-5 w-5" /></motion.a>;
              })}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-20" />
              {user.image ? (
                <img src={user.image} alt={user.name} className="relative rounded-3xl w-full aspect-square object-cover border border-white/10" />
              ) : (
                <div className="relative rounded-3xl w-full aspect-square bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                  <span className="text-8xl font-bold text-white/20">{(user.name || "D")[0]}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      {user.bio && (
        <section className="py-24 px-4 max-w-4xl mx-auto relative">
          <FadeInView>
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">About Me</h2>
              <p className="text-gray-400 leading-relaxed text-lg">{user.bio}</p>
            </div>
          </FadeInView>
        </section>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <section className="py-24 px-4 max-w-5xl mx-auto">
          <FadeInView><h2 className="text-3xl font-bold mb-12 text-center">Tech Stack</h2></FadeInView>
          <StaggerContainer className="flex flex-wrap justify-center gap-3">
            {user.skills.map((skill: any) => (
              <StaggerItem key={skill.id}>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} className="px-5 py-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 backdrop-blur text-sm font-medium text-white">
                  {skill.name}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <FadeInView><h2 className="text-3xl font-bold mb-12 text-center">Featured Work</h2></FadeInView>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {user.projects.map((project: any) => (
              <StaggerItem key={project.id}>
                <motion.div whileHover={{ y: -8 }} className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                  {project.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <div className="flex gap-2">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Github className="h-4 w-4" /></a>}
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><ArrowUpRight className="h-4 w-4" /></a>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech: string) => (
                        <span key={tech} className="px-2.5 py-1 text-xs rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 text-gray-300">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Experience */}
      {user.experiences?.length > 0 && (
        <section className="py-24 px-4 max-w-4xl mx-auto">
          <FadeInView><h2 className="text-3xl font-bold mb-12 text-center">Career Journey</h2></FadeInView>
          <div className="space-y-6">
            {user.experiences.map((exp: any, i: number) => (
              <FadeInView key={exp.id} delay={i * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-white">{exp.position}</h3>
                      <p className="text-cyan-400">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 px-3 py-1 rounded-full bg-white/5">
                      {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                    </span>
                  </div>
                  {exp.description && <p className="text-sm text-gray-400 mt-4">{exp.description}</p>}
                </div>
              </FadeInView>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-24 px-4 max-w-2xl mx-auto relative">
        <FadeInView>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Let&apos;s Connect</h2>
            <p className="text-gray-400 mt-3">Got a project in mind? Let&apos;s build something amazing.</p>
          </div>
          {sent ? (
            <div className="text-center py-8"><p className="text-xl text-cyan-400">Message sent successfully!</p></div>
          ) : (
            <form onSubmit={handleContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your name" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none backdrop-blur" />
                <input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none backdrop-blur" />
              </div>
              <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none backdrop-blur" />
              <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Your message" rows={5} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none backdrop-blur resize-none" />
              <button type="submit" disabled={sending} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50">
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </FadeInView>
      </section>

      <footer className="py-8 text-center text-sm text-gray-600 border-t border-white/5">Built with DevPortfolio Builder</footer>
    </div>
  );
}
