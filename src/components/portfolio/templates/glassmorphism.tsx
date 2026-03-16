"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function GlassmorphismTemplate({ data }: { data: { user: any } }) {
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

  const glass = "backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] shadow-xl";

  return (
    <div className="min-h-screen text-white relative">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className={`${glass} rounded-3xl p-10 md:p-16 text-center max-w-2xl w-full`}>
            {user.image && (
              <img src={user.image} alt={user.name} className="w-24 h-24 rounded-2xl mx-auto mb-6 border-2 border-white/10 object-cover" />
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{user.name}</h1>
            {user.headline && <p className="text-lg text-purple-200/70 mt-3">{user.headline}</p>}
            {user.location && <p className="text-sm text-gray-400 mt-2">{user.location}</p>}
            <div className="flex justify-center gap-3 mt-6">
              {user.socialLinks?.map((link: any) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <Icon className="h-4 w-4 text-purple-300" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </section>

        {user.bio && (
          <section id="about" className="py-20 px-6 scroll-mt-16">
            <FadeInView>
              <div className={`max-w-3xl mx-auto ${glass} rounded-2xl p-8`}>
                <h2 className="text-sm uppercase tracking-widest text-purple-300/60 mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed text-lg">{user.bio}</p>
              </div>
            </FadeInView>
          </section>
        )}

        {user.skills?.length > 0 && (
          <section id="skills" className="py-20 px-6 scroll-mt-16">
            <div className="max-w-5xl mx-auto">
              <FadeInView><h2 className="text-sm uppercase tracking-widest text-purple-300/60 mb-10 text-center">Skills</h2></FadeInView>
              <StaggerContainer className="flex flex-wrap justify-center gap-3">
                {user.skills.map((skill: any) => (
                  <StaggerItem key={skill.id}>
                    <div className={`${glass} rounded-xl px-5 py-3 hover:bg-white/[0.08] transition-all`}>
                      <span className="text-sm font-medium">{skill.name}</span>
                      {skill.level && <span className="ml-2 text-xs text-purple-300/50">{skill.level}%</span>}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {user.projects?.length > 0 && (
          <section id="projects" className="py-20 px-6 scroll-mt-16">
            <div className="max-w-6xl mx-auto">
              <FadeInView><h2 className="text-sm uppercase tracking-widest text-purple-300/60 mb-10 text-center">Projects</h2></FadeInView>
              <div className="grid md:grid-cols-2 gap-6">
                {user.projects.map((project: any) => (
                  <FadeInView key={project.id}>
                    <div className={`${glass} rounded-2xl p-6 hover:bg-white/[0.07] transition-all`}>
                      {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-44 object-cover rounded-xl mb-4" />}
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {project.description && <p className="text-gray-400 mt-2 text-sm">{project.description}</p>}
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.techStack.map((tech: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-md bg-white/5 text-purple-200">{tech}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3 mt-4">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-purple-300 flex items-center gap-1"><Github className="h-4 w-4" /> Code</a>}
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-purple-300 flex items-center gap-1"><ExternalLink className="h-4 w-4" /> Live</a>}
                      </div>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </section>
        )}

        {user.experiences?.length > 0 && (
          <section id="experience" className="py-20 px-6 scroll-mt-16">
            <div className="max-w-4xl mx-auto">
              <FadeInView><h2 className="text-sm uppercase tracking-widest text-purple-300/60 mb-10 text-center">Experience</h2></FadeInView>
              <div className="space-y-4">
                {user.experiences.map((exp: any) => (
                  <FadeInView key={exp.id}>
                    <div className={`${glass} rounded-xl p-6`}>
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-lg">{exp.position}</h3>
                          <p className="text-purple-300">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}</span>
                      </div>
                      {exp.description && <p className="text-gray-400 mt-3 text-sm">{exp.description}</p>}
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </section>
        )}

        {user.educations?.length > 0 && (
          <section id="education" className="py-20 px-6 scroll-mt-16">
            <div className="max-w-4xl mx-auto">
              <FadeInView><h2 className="text-sm uppercase tracking-widest text-purple-300/60 mb-10 text-center">Education</h2></FadeInView>
              <div className="space-y-4">
                {user.educations.map((edu: any) => (
                  <FadeInView key={edu.id}>
                    <div className={`${glass} rounded-xl p-6`}>
                      <h3 className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                      <p className="text-purple-300 text-sm">{edu.institution}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}</p>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="py-20 px-6 scroll-mt-16">
          <div className="max-w-lg mx-auto">
            <FadeInView>
              <div className={`${glass} rounded-2xl p-8`}>
                <h2 className="text-sm uppercase tracking-widest text-purple-300/60 mb-6 text-center">Contact</h2>
                {sent ? (
                  <div className="text-center py-8 text-purple-300">Message sent!</div>
                ) : (
                  <form onSubmit={handleContact} className="space-y-4">
                    <input value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" required className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-400 outline-none" />
                    <input value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" type="email" required className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-400 outline-none" />
                    <textarea value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Message" rows={4} required className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-400 outline-none resize-none" />
                    <button type="submit" disabled={sending} className="w-full py-3 rounded-xl bg-purple-600/50 border border-purple-400/30 font-semibold hover:bg-purple-600/70 transition-all">{sending ? "Sending..." : "Send Message"}</button>
                  </form>
                )}
              </div>
            </FadeInView>
          </div>
        </section>

        <footer className="py-8 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} {user.name}
        </footer>
      </div>
    </div>
  );
}
