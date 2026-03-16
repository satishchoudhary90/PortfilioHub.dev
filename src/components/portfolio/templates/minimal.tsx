"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink, MapPin, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { TrackedLink } from "@/components/portfolio/tracked-link";
import { SkillTooltip } from "@/components/portfolio/skill-tooltip";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function MinimalTemplate({ data }: { data: { user: any } }) {
  const { user } = data;
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setContactStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, userId: user.id }),
      });
      if (res.ok) {
        setContactStatus("success");
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        <div className="text-center z-10 w-full max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {user.image && (
              <img src={user.image} alt={user.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-6 border-4 border-indigo-500/30 object-cover" />
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              {user.name || "Developer"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mt-4 max-w-lg mx-auto">{user.headline || "Full Stack Developer"}</p>
            {user.location && (
              <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
                <MapPin className="h-4 w-4" /> {user.location}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 mt-8">
              {user.socialLinks?.map((link: any) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, y: -2 }} className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="mt-16">
            <a href="#about" className="text-gray-500 hover:text-white transition-colors">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ArrowRight className="h-5 w-5 rotate-90 mx-auto" />
              </motion.div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* About */}
      {user.bio && (
        <section id="about" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
          <FadeInView>
            <h2 className="text-3xl font-bold mb-8">About Me</h2>
            <p className="text-lg text-gray-400 leading-relaxed">{user.bio}</p>
          </FadeInView>
        </section>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <section id="skills" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
          <FadeInView>
            <h2 className="text-3xl font-bold mb-12">Skills</h2>
          </FadeInView>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.skills.map((skill: any) => (
              <StaggerItem key={skill.id}>
                <SkillTooltip name={skill.name} level={skill.level} category={skill.category}>
                  <div className="space-y-2 cursor-default">
                    <div className="flex justify-between text-sm">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </SkillTooltip>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <section id="projects" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
          <FadeInView>
            <h2 className="text-3xl font-bold mb-12">Projects</h2>
          </FadeInView>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {user.projects.map((project: any) => (
              <StaggerItem key={project.id}>
                <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.3 }} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group transition-all duration-300">
                  {project.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full max-w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack?.map((tech: string) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{tech}</span>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                      {project.githubUrl && (
                        <TrackedLink href={project.githubUrl} userId={user.id} projectId={project.id} label="github" className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
                          <Github className="h-4 w-4" /> Code
                        </TrackedLink>
                      )}
                      {project.liveUrl && (
                        <TrackedLink href={project.liveUrl} userId={user.id} projectId={project.id} label="live" className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" /> Live
                        </TrackedLink>
                      )}
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
        <section id="experience" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
          <FadeInView>
            <h2 className="text-3xl font-bold mb-12">Experience</h2>
          </FadeInView>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent" />
            <div className="space-y-12">
              {user.experiences.map((exp: any, i: number) => (
                <FadeInView key={exp.id} delay={i * 0.1}>
                  <div className="relative pl-12">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
                    <div>
                      <h3 className="font-semibold text-white text-base sm:text-lg">{exp.position}</h3>
                      <p className="text-indigo-400">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                      </p>
                      {exp.description && <p className="text-sm text-gray-400 mt-3">{exp.description}</p>}
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {user.educations?.length > 0 && (
        <section id="education" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
          <FadeInView>
            <h2 className="text-3xl font-bold mb-12">Education</h2>
          </FadeInView>
          <StaggerContainer className="space-y-6">
            {user.educations.map((edu: any) => (
              <StaggerItem key={edu.id}>
                <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="font-semibold text-white">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                  <p className="text-purple-400">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}
                    {edu.grade && ` · GPA: ${edu.grade}`}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
        <FadeInView>
          <h2 className="text-3xl font-bold mb-2 text-center">Get In Touch</h2>
          <p className="text-gray-500 text-center mb-8">Have a question or want to work together?</p>
          {contactStatus === "success" ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-emerald-400">Message sent!</p>
              <p className="text-gray-400 mt-2">Thanks for reaching out. I{"'"}ll get back to you soon.</p>
              <button onClick={() => setContactStatus("idle")} className="mt-6 text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-4">
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleContact} className="space-y-4 max-w-2xl mx-auto">
              {contactStatus === "error" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Something went wrong. Please try again.
                </motion.div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your name" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all" />
                <input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} type="email" placeholder="your@email.com" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all" />
              </div>
              <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Subject (optional)" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all" />
              <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Your message..." rows={5} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none resize-none transition-all" />
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Sending...
                  </span>
                ) : "Send Message"}
              </motion.button>
            </form>
          )}
        </FadeInView>
      </section>
    </div>
  );
}
