"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function NeonCyberTemplate({ data }: { data: { user: any } }) {
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
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <section className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-center z-10 max-w-7xl mx-auto w-full">
          {user.image && (
            <motion.img src={user.image} alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mx-auto mb-6 sm:mb-8 border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.3)] object-cover"
              animate={{ boxShadow: ["0 0 20px rgba(0,255,255,0.2)", "0 0 40px rgba(0,255,255,0.4)", "0 0 20px rgba(0,255,255,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-tight">
            {user.name}
          </h1>
          {user.headline && (
            <p className="text-base sm:text-lg md:text-xl text-cyan-300/70 mt-4 tracking-wider uppercase">&gt; {user.headline}</p>
          )}
          <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
            {user.socialLinks?.map((link: any) => {
              const Icon = socialIcons[link.platform] || Globe;
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300 hover:scale-110">
                  <Icon className="h-5 w-5 text-cyan-400" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      {user.bio && (
        <section id="about" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <FadeInView>
            <div className="max-w-7xl mx-auto w-full border border-cyan-500/20 rounded-xl p-6 sm:p-8 bg-cyan-500/[0.03]">
              <h2 className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-4">// about</h2>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{user.bio}</p>
            </div>
          </FadeInView>
        </section>
      )}

      {user.skills?.length > 0 && (
        <section id="skills" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="max-w-7xl mx-auto w-full">
            <FadeInView><h2 className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-8 sm:mb-10">// skills</h2></FadeInView>
            <StaggerContainer className="flex flex-wrap gap-2 sm:gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
              {user.skills.map((skill: any) => (
                <StaggerItem key={skill.id}>
                  <div className="border border-cyan-500/20 rounded-lg p-3 sm:p-4 bg-cyan-500/[0.02] hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300">
                    <p className="text-white font-medium text-sm sm:text-base">{skill.name}</p>
                    {skill.level && (
                      <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: 0.2 }} />
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {user.projects?.length > 0 && (
        <section id="projects" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="max-w-7xl mx-auto w-full">
            <FadeInView><h2 className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-8 sm:mb-10">// projects</h2></FadeInView>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {user.projects.map((project: any) => (
                <FadeInView key={project.id}>
                  <div className="border border-cyan-500/20 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-cyan-500/[0.03] to-transparent hover:border-cyan-400/40 hover:scale-[1.02] transition-all duration-300 group">
                    {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full max-w-full h-36 sm:h-44 object-cover rounded-lg mb-4 border border-cyan-500/10" />}
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    {project.description && <p className="text-gray-400 mt-2 text-sm">{project.description}</p>}
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.techStack.map((tech: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 border border-cyan-500/20 rounded text-cyan-300">{tech}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 mt-4">
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-cyan-400 flex items-center gap-1"><Github className="h-4 w-4" /> Code</a>}
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-cyan-400 flex items-center gap-1"><ExternalLink className="h-4 w-4" /> Live</a>}
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
          <div className="max-w-4xl mx-auto w-full">
            <FadeInView><h2 className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-8 sm:mb-10">// experience</h2></FadeInView>
            <div className="space-y-4 sm:space-y-6">
              {user.experiences.map((exp: any) => (
                <FadeInView key={exp.id}>
                  <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-6 bg-cyan-500/[0.02] overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-base sm:text-lg">{exp.position}</h3>
                        <p className="text-cyan-400 text-sm">@ {exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{formatDate(exp.startDate)} → {exp.current ? "now" : exp.endDate ? formatDate(exp.endDate) : ""}</span>
                    </div>
                    {exp.description && <p className="text-gray-400 mt-3 text-sm leading-relaxed break-words">{exp.description}</p>}
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.educations?.length > 0 && (
        <section id="education" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="max-w-4xl mx-auto w-full">
            <FadeInView><h2 className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-8 sm:mb-10">// education</h2></FadeInView>
            <div className="space-y-4">
              {user.educations.map((edu: any) => (
                <FadeInView key={edu.id}>
                  <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-cyan-500/[0.02] overflow-hidden">
                    <h3 className="font-bold text-base sm:text-lg">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</h3>
                    <p className="text-cyan-400 text-sm">{edu.institution}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(edu.startDate)} → {edu.current ? "now" : edu.endDate ? formatDate(edu.endDate) : ""}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-lg mx-auto w-full">
          <FadeInView>
            <h2 className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-6 sm:mb-8 text-center">// contact</h2>
            {sent ? (
              <div className="text-center py-12 text-cyan-400">Message transmitted successfully.</div>
            ) : (
              <form onSubmit={handleContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 [&>textarea]:sm:col-span-2 [&>button]:sm:col-span-2">
                <input value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" required className="w-full p-3 sm:p-4 rounded-lg bg-transparent border border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-400 outline-none font-mono transition-colors duration-300" />
                <input value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" type="email" required className="w-full p-3 sm:p-4 rounded-lg bg-transparent border border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-400 outline-none font-mono transition-colors duration-300" />
                <textarea value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Message" rows={4} required className="w-full p-3 sm:p-4 rounded-lg bg-transparent border border-cyan-500/20 text-white placeholder-gray-600 focus:border-cyan-400 outline-none resize-none font-mono transition-colors duration-300" />
                <button type="submit" disabled={sending} className="w-full py-3 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-mono">{sending ? "Transmitting..." : "Transmit"}</button>
              </form>
            )}
          </FadeInView>
        </div>
      </section>

      <footer className="py-6 text-center text-gray-700 text-xs font-mono border-t border-cyan-500/10">
        &lt;/&gt; {user.name} © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
