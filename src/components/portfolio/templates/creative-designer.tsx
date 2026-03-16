"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink, Heart } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function CreativeDesignerTemplate({ data }: { data: { user: any } }) {
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
    <div className="min-h-screen bg-[#faf8f5] text-gray-900 overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute top-20 right-20 w-64 h-64 rounded-full border-2 border-orange-200" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute bottom-20 left-20 w-48 h-48 rounded-full border-2 border-purple-200" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      </div>

      {/* Hero */}
      <section className="min-h-screen flex items-center px-4 relative">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <p className="text-lg text-orange-500 font-medium mb-4">Hello, I&apos;m</p>
            <h1 className="text-6xl md:text-8xl font-black leading-none">
              {user.name?.split(" ").map((word: string, i: number) => (
                <span key={i} className={i % 2 === 0 ? "text-gray-900" : "text-orange-500"}>
                  {word}{" "}
                </span>
              )) || "Creative Developer"}
            </h1>
            <p className="text-xl text-gray-500 mt-6 max-w-xl">{user.headline || "Designer & Developer crafting digital experiences"}</p>
            <div className="flex gap-4 mt-10">
              {user.socialLinks?.map((link: any) => {
                const Icon = socialIcons[link.platform] || Globe;
                return <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, rotate: 5 }} className="p-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-600 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm"><Icon className="h-5 w-5" /></motion.a>;
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      {user.bio && (
        <section id="about" className="py-24 px-4 scroll-mt-16">
          <div className="max-w-4xl mx-auto">
            <FadeInView>
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                  <h2 className="text-5xl font-black text-orange-500">About</h2>
                </div>
                <div className="md:col-span-2">
                  <p className="text-lg text-gray-600 leading-relaxed">{user.bio}</p>
                </div>
              </div>
            </FadeInView>
          </div>
        </section>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <section id="skills" className="py-24 px-4 bg-gray-900 text-white scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <FadeInView><h2 className="text-5xl font-black mb-16 text-center">What I Do</h2></FadeInView>
            <StaggerContainer className="flex flex-wrap justify-center gap-4">
              {user.skills.map((skill: any, i: number) => {
                const colors = ["bg-orange-500", "bg-purple-500", "bg-cyan-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500"];
                return (
                  <StaggerItem key={skill.id}>
                    <motion.div whileHover={{ scale: 1.1, rotate: Math.random() * 6 - 3 }} className={`px-6 py-3 rounded-2xl ${colors[i % colors.length]} text-white font-bold shadow-lg`}>
                      {skill.name}
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <section id="projects" className="py-24 px-4 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeInView><h2 className="text-5xl font-black mb-16">Selected <span className="text-orange-500">Work</span></h2></FadeInView>
            <div className="space-y-16">
              {user.projects.map((project: any, i: number) => (
                <FadeInView key={project.id} delay={i * 0.1}>
                  <motion.div whileHover={{ x: 10 }} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:direction-rtl" : ""}`}>
                    {project.imageUrl && (
                      <div className="rounded-3xl overflow-hidden shadow-2xl">
                        <img src={project.imageUrl} alt={project.title} className="w-full aspect-video object-cover" />
                      </div>
                    )}
                    <div className={!project.imageUrl ? "md:col-span-2" : ""}>
                      <h3 className="text-3xl font-black">{project.title}</h3>
                      <p className="text-gray-500 mt-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.techStack?.map((tech: string) => (
                          <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">{tech}</span>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-6">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors"><Github className="h-4 w-4" /> Source</a>}
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors"><ExternalLink className="h-4 w-4" /> Live Demo</a>}
                      </div>
                    </div>
                  </motion.div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {user.experiences?.length > 0 && (
        <section id="experience" className="py-24 px-4 bg-orange-50 scroll-mt-16">
          <div className="max-w-4xl mx-auto">
            <FadeInView><h2 className="text-5xl font-black mb-16">Experience</h2></FadeInView>
            <div className="space-y-8">
              {user.experiences.map((exp: any, i: number) => (
                <FadeInView key={exp.id} delay={i * 0.1}>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                      <div className="w-0.5 flex-1 bg-orange-200" />
                    </div>
                    <div className="pb-8">
                      <h3 className="text-xl font-black">{exp.position}</h3>
                      <p className="text-orange-500 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-400 mt-1">{formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}</p>
                      {exp.description && <p className="text-gray-600 mt-3">{exp.description}</p>}
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-24 px-4 scroll-mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <FadeInView>
            <h2 className="text-5xl font-black">Say <span className="text-orange-500">Hello</span></h2>
            <p className="text-gray-500 mt-4">Got a cool project idea? Let&apos;s chat!</p>
            {sent ? (
              <div className="py-8"><p className="text-xl text-orange-500 font-bold">Thanks for reaching out!</p></div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4 mt-10 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Name" required className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none" />
                  <input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none" />
                </div>
                <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Subject" className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none" />
                <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Message" rows={5} required className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none resize-none" />
                <button type="submit" disabled={sending} className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50">
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </FadeInView>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100">
        Made with <Heart className="h-4 w-4 inline text-orange-500" /> using DevPortfolio Builder
      </footer>
    </div>
  );
}
