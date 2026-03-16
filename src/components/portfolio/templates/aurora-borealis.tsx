"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function AuroraBorealisTemplate({ data }: { data: { user: any } }) {
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
    setContactForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
          animate={{ background: ["radial-gradient(circle, #22d3ee, transparent)", "radial-gradient(circle, #a78bfa, transparent)", "radial-gradient(circle, #34d399, transparent)", "radial-gradient(circle, #22d3ee, transparent)"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
          animate={{ background: ["radial-gradient(circle, #a78bfa, transparent)", "radial-gradient(circle, #f472b6, transparent)", "radial-gradient(circle, #22d3ee, transparent)", "radial-gradient(circle, #a78bfa, transparent)"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]"
          animate={{ background: ["radial-gradient(circle, #34d399, transparent)", "radial-gradient(circle, #22d3ee, transparent)", "radial-gradient(circle, #a78bfa, transparent)", "radial-gradient(circle, #34d399, transparent)"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
      </div>

      <div className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center max-w-3xl">
            {user.image && (
              <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full mx-auto mb-8 border-2 border-white/10 object-cover shadow-lg shadow-teal-500/20" />
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-teal-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            {user.headline && <p className="text-base sm:text-lg md:text-xl text-gray-300/70 mt-4">{user.headline}</p>}
            {user.location && <p className="text-sm text-gray-500 mt-2">{user.location}</p>}
            <div className="flex justify-center gap-3 mt-8">
              {user.socialLinks?.map((link: any) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-400/30 transition-all">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </section>

        {user.bio && (
          <section id="about" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
            <FadeInView>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-sm uppercase tracking-[0.3em] text-teal-300/50 mb-6">About</h2>
                <p className="text-xl text-gray-300 leading-relaxed">{user.bio}</p>
              </div>
            </FadeInView>
          </section>
        )}

        {user.skills?.length > 0 && (
          <section id="skills" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
            <div className="max-w-5xl mx-auto">
              <FadeInView><h2 className="text-sm uppercase tracking-[0.3em] text-violet-300/50 mb-12 text-center">Skills</h2></FadeInView>
              <StaggerContainer className="flex flex-wrap justify-center gap-3">
                {user.skills.map((skill: any) => (
                  <StaggerItem key={skill.id}>
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm bg-white/5 border border-white/10 hover:border-teal-400/30 transition-all duration-200">
                      {skill.name}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {user.projects?.length > 0 && (
          <section id="projects" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
            <div className="max-w-6xl mx-auto">
              <FadeInView><h2 className="text-sm uppercase tracking-[0.3em] text-pink-300/50 mb-12 text-center">Projects</h2></FadeInView>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {user.projects.map((project: any) => (
                <FadeInView key={project.id}>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-6 hover:border-teal-400/20 hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
                      {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-44 object-cover rounded-xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />}
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {project.description && <p className="text-gray-400 mt-2 text-sm">{project.description}</p>}
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.techStack.map((tech: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-md bg-white/5 text-teal-200/70">{tech}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 mt-4">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-teal-300 flex items-center gap-1"><Github className="h-4 w-4" /> Code</a>}
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-teal-300 flex items-center gap-1"><ExternalLink className="h-4 w-4" /> Live</a>}
                      </div>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </section>
        )}

        {user.experiences?.length > 0 && (
          <section id="experience" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
            <div className="max-w-7xl mx-auto w-full">
              <FadeInView><h2 className="text-sm uppercase tracking-[0.3em] text-teal-300/50 mb-12 text-center">Experience</h2></FadeInView>
              <div className="space-y-8 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-teal-400/50 before:via-violet-400/50 before:to-pink-400/50 pl-12">
                {user.experiences.map((exp: any) => (
                  <FadeInView key={exp.id}>
                    <div className="relative">
                      <div className="absolute -left-12 top-1 w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-violet-400 ring-4 ring-gray-950" />
                      <h3 className="text-lg font-bold">{exp.position}</h3>
                      <p className="text-teal-300/70">{exp.company}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}</p>
                      {exp.description && <p className="text-gray-400 mt-3 text-sm leading-relaxed">{exp.description}</p>}
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </section>
        )}

        {user.educations?.length > 0 && (
          <section id="education" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
            <div className="max-w-7xl mx-auto w-full">
              <FadeInView><h2 className="text-sm uppercase tracking-[0.3em] text-violet-300/50 mb-12 text-center">Education</h2></FadeInView>
              <div className="space-y-6">
                {user.educations.map((edu: any) => (
                  <FadeInView key={edu.id}>
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
                      <h3 className="font-bold text-lg">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                      <p className="text-violet-300/70">{edu.institution}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}</p>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="max-w-2xl mx-auto w-full">
            <FadeInView>
              <h2 className="text-sm uppercase tracking-[0.3em] text-pink-300/50 mb-8 text-center">Get in Touch</h2>
              {sent ? (
                <div className="text-center py-12 text-teal-300">Message sent successfully!</div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-teal-400/50 outline-none transition-all duration-200" />
                    <input value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" type="email" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-teal-400/50 outline-none transition-all duration-200" />
                  </div>
                  <input value={contactForm.subject} onChange={(e) => setContactForm(p => ({ ...p, subject: e.target.value }))} placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-teal-400/50 outline-none transition-all duration-200" />
                  <textarea value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Message" rows={4} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-teal-400/50 outline-none resize-none transition-all duration-200" />
                  <button type="submit" disabled={sending} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-violet-500 font-semibold hover:opacity-90 transition-opacity">{sending ? "Sending..." : "Send Message"}</button>
                </form>
              )}
            </FadeInView>
          </div>
        </section>

        <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
          © {new Date().getFullYear()} {user.name}. Built with DevPortfolio.
        </footer>
      </div>
    </div>
  );
}
