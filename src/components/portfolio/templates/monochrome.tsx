"use client";

import { motion } from "framer-motion";
import { FadeInView } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function MonochromeTemplate({ data }: { data: { user: any } }) {
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
    <div className="min-h-screen bg-white text-black">
      <section className="min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              {user.image && (
                <img src={user.image} alt={user.name} className="w-full max-w-md mx-auto aspect-square object-cover grayscale" />
              )}
            </div>
            <div className="order-1 md:order-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter uppercase">{user.name}</h1>
              {user.headline && <p className="text-base sm:text-lg md:text-xl text-gray-500 mt-4 sm:mt-6 font-light">{user.headline}</p>}
              {user.location && <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest">{user.location}</p>}
              <div className="flex gap-4 mt-8">
                {user.socialLinks?.map((link: any) => {
                  const Icon = socialIcons[link.platform] || Globe;
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors duration-200">
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {user.bio && (
        <section id="about" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100 scroll-mt-20">
          <FadeInView>
            <div className="max-w-7xl mx-auto w-full">
              <p className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed text-gray-700">{user.bio}</p>
            </div>
          </FadeInView>
        </section>
      )}

      {user.skills?.length > 0 && (
        <section id="skills" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto w-full">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 sm:mb-12">Skills</h2></FadeInView>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {user.skills.map((skill: any) => (
                <FadeInView key={skill.id}>
                  <span className="text-lg sm:text-xl lg:text-2xl font-light text-gray-800 hover:text-black transition-colors duration-200">{skill.name}</span>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.projects?.length > 0 && (
        <section id="projects" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto w-full">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-12">Projects</h2></FadeInView>
            <div className="space-y-16">
              {user.projects.map((project: any, index: number) => (
                <FadeInView key={project.id}>
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start hover:scale-[1.01] transition-transform duration-300">
                    <div className={index % 2 === 1 ? "md:order-2" : ""}>
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full max-w-full aspect-video object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-300 text-4xl sm:text-6xl font-black">{(index + 1).toString().padStart(2, "0")}</div>
                      )}
                    </div>
                    <div className={index % 2 === 1 ? "md:order-1" : ""}>
                      <span className="text-sm text-gray-400">{(index + 1).toString().padStart(2, "0")}</span>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight mt-2">{project.title}</h3>
                      {project.description && <p className="text-gray-500 mt-4 leading-relaxed">{project.description}</p>}
                      {project.techStack?.length > 0 && (
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-4">{project.techStack.join(" / ")}</p>
                      )}
                      <div className="flex gap-4 mt-4">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-black flex items-center gap-1 uppercase tracking-wider"><Github className="h-4 w-4" /> Code</a>}
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-black flex items-center gap-1 uppercase tracking-wider"><ExternalLink className="h-4 w-4" /> Live</a>}
                      </div>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.experiences?.length > 0 && (
        <section id="experience" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100 bg-gray-50 scroll-mt-20">
          <div className="max-w-7xl mx-auto w-full">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 sm:mb-12">Experience</h2></FadeInView>
            <div className="space-y-8 sm:space-y-12">
              {user.experiences.map((exp: any) => (
                <FadeInView key={exp.id}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
                    <div>
                      <p className="text-sm text-gray-400">{formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-lg sm:text-xl font-bold">{exp.position}</h3>
                      <p className="text-gray-500">{exp.company}</p>
                      {exp.description && <p className="text-gray-600 mt-3 text-sm leading-relaxed">{exp.description}</p>}
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.educations?.length > 0 && (
        <section id="education" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto w-full">
            <FadeInView><h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 sm:mb-12">Education</h2></FadeInView>
            <div className="space-y-6 sm:space-y-8">
              {user.educations.map((edu: any) => (
                <FadeInView key={edu.id}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
                    <p className="text-sm text-gray-400">{formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}</p>
                    <div className="md:col-span-2">
                      <h3 className="text-lg sm:text-xl font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                      <p className="text-gray-500">{edu.institution}</p>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100 bg-black text-white scroll-mt-20">
        <div className="max-w-2xl mx-auto w-full">
          <FadeInView>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8 sm:mb-10 text-center">Contact</h2>
            {sent ? (
              <div className="text-center py-12 text-gray-400">Message sent.</div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" required className="w-full px-4 py-3 sm:p-4 bg-transparent border-b border-gray-800 text-white placeholder-gray-600 focus:border-white outline-none transition-all duration-200" />
                  <input value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" type="email" required className="w-full px-4 py-3 sm:p-4 bg-transparent border-b border-gray-800 text-white placeholder-gray-600 focus:border-white outline-none transition-all duration-200" />
                </div>
                <input value={contactForm.subject} onChange={(e) => setContactForm(p => ({ ...p, subject: e.target.value }))} placeholder="Subject" className="w-full px-4 py-3 sm:p-4 bg-transparent border-b border-gray-800 text-white placeholder-gray-600 focus:border-white outline-none transition-all duration-200" />
                <textarea value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Message" rows={4} required className="w-full px-4 py-3 sm:p-4 bg-transparent border-b border-gray-800 text-white placeholder-gray-600 focus:border-white outline-none resize-none transition-all duration-200" />
                <button type="submit" disabled={sending} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 disabled:opacity-50">{sending ? "Sending..." : "Send"}</button>
              </form>
            )}
          </FadeInView>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-300 text-xs uppercase tracking-widest bg-black">
        © {new Date().getFullYear()} {user.name}
      </footer>
    </div>
  );
}
