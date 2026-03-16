"use client";

import { motion } from "framer-motion";
import { FadeInView } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function ElegantSerifTemplate({ data }: { data: { user: any } }) {
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
    <div className="min-h-screen bg-[#faf8f5] text-gray-800" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <section className="min-h-[80vh] flex items-center justify-center relative px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(180,160,130,0.1),transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center z-10 max-w-3xl">
          {user.image && (
            <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-amber-200/60 object-cover" />
          )}
          <h1 className="text-5xl md:text-7xl font-normal italic text-gray-900 tracking-tight">{user.name}</h1>
          {user.headline && <p className="text-xl text-amber-700/70 mt-4 tracking-wide">{user.headline}</p>}
          <div className="w-24 h-px bg-amber-600/40 mx-auto mt-8" />
          <div className="flex justify-center gap-4 mt-6">
            {user.socialLinks?.map((link: any) => {
              const Icon = socialIcons[link.platform] || Globe;
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-amber-700/50 hover:text-amber-800 transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      {user.bio && (
        <section id="about" className="py-20 px-6 scroll-mt-16">
          <FadeInView>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xs uppercase tracking-[0.4em] text-amber-700/50 mb-8">About</h2>
              <p className="text-xl text-gray-600 leading-relaxed italic">&ldquo;{user.bio}&rdquo;</p>
            </div>
          </FadeInView>
        </section>
      )}

      {user.skills?.length > 0 && (
        <section id="skills" className="py-20 px-6 bg-white/50 scroll-mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.4em] text-amber-700/50 mb-10">Expertise</h2></FadeInView>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {user.skills.map((skill: any, i: number) => (
                <FadeInView key={skill.id}>
                  <span className="text-gray-600 text-lg">
                    {skill.name}{i < user.skills.length - 1 ? <span className="ml-8 text-amber-600/30">·</span> : ""}
                  </span>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.projects?.length > 0 && (
        <section id="projects" className="py-20 px-6 scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.4em] text-amber-700/50 mb-12 text-center">Selected Works</h2></FadeInView>
            <div className="grid md:grid-cols-2 gap-8">
              {user.projects.map((project: any) => (
                <FadeInView key={project.id}>
                  <div className="group">
                    {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-52 object-cover rounded-sm mb-4 grayscale group-hover:grayscale-0 transition-all duration-500" />}
                    <h3 className="text-2xl font-normal italic">{project.title}</h3>
                    {project.description && <p className="text-gray-500 mt-2 text-sm leading-relaxed">{project.description}</p>}
                    {project.techStack?.length > 0 && (
                      <p className="text-xs text-amber-700/50 mt-3 tracking-wider">{project.techStack.join(" · ")}</p>
                    )}
                    <div className="flex gap-4 mt-3">
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-700/60 hover:text-amber-800 flex items-center gap-1"><Github className="h-3.5 w-3.5" /> Source</a>}
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-700/60 hover:text-amber-800 flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" /> Visit</a>}
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.experiences?.length > 0 && (
        <section id="experience" className="py-20 px-6 bg-white/50 scroll-mt-16">
          <div className="max-w-3xl mx-auto">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.4em] text-amber-700/50 mb-12 text-center">Experience</h2></FadeInView>
            <div className="space-y-10">
              {user.experiences.map((exp: any) => (
                <FadeInView key={exp.id}>
                  <div className="border-l-2 border-amber-200 pl-6">
                    <p className="text-sm text-amber-700/50 tracking-wider">{formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}</p>
                    <h3 className="text-xl mt-1 italic">{exp.position}</h3>
                    <p className="text-amber-700/70">{exp.company}</p>
                    {exp.description && <p className="text-gray-500 mt-3 text-sm leading-relaxed">{exp.description}</p>}
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.educations?.length > 0 && (
        <section id="education" className="py-20 px-6 scroll-mt-16">
          <div className="max-w-3xl mx-auto">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.4em] text-amber-700/50 mb-12 text-center">Education</h2></FadeInView>
            <div className="space-y-8">
              {user.educations.map((edu: any) => (
                <FadeInView key={edu.id}>
                  <div className="text-center">
                    <h3 className="text-xl italic">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                    <p className="text-amber-700/70">{edu.institution}</p>
                    <p className="text-sm text-gray-400 mt-1">{formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 px-6 bg-white/50 scroll-mt-16">
        <div className="max-w-lg mx-auto">
          <FadeInView>
            <h2 className="text-xs uppercase tracking-[0.4em] text-amber-700/50 mb-8 text-center">Correspondence</h2>
            {sent ? (
              <div className="text-center py-12 text-amber-700 italic">Thank you for your message.</div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <input value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="w-full p-3 bg-transparent border-b border-amber-200 text-gray-800 placeholder-gray-400 focus:border-amber-500 outline-none" style={{ fontFamily: "Georgia, serif" }} />
                <input value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="Your email" type="email" required className="w-full p-3 bg-transparent border-b border-amber-200 text-gray-800 placeholder-gray-400 focus:border-amber-500 outline-none" style={{ fontFamily: "Georgia, serif" }} />
                <textarea value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Your message" rows={4} required className="w-full p-3 bg-transparent border-b border-amber-200 text-gray-800 placeholder-gray-400 focus:border-amber-500 outline-none resize-none" style={{ fontFamily: "Georgia, serif" }} />
                <button type="submit" disabled={sending} className="w-full py-3 bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors tracking-wider text-sm">{sending ? "Sending..." : "Send"}</button>
              </form>
            )}
          </FadeInView>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-400 text-sm italic border-t border-amber-100">
        © {new Date().getFullYear()} {user.name}
      </footer>
    </div>
  );
}
