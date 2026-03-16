"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function NatureGreenTemplate({ data }: { data: { user: any } }) {
  const { user } = data;
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contactForm, userId: user.id }),
    });
    setSending(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 text-gray-800 overflow-hidden">
      {/* Leaf-like decorative SVG elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-10 right-10 w-32 h-32 text-emerald-200/60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.6 4 17c2.2-2.6 3.5-5.2 3-8-1.5-.8-2 1.2-2 2.5s.5 4 3 5.5z" />
        </svg>
        <svg className="absolute bottom-20 left-10 w-24 h-24 text-green-200/50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.6 4 17c2.2-2.6 3.5-5.2 3-8-1.5-.8-2 1.2-2 2.5s.5 4 3 5.5z" transform="rotate(-45 12 12)" />
        </svg>
        <svg className="absolute top-1/3 left-20 w-20 h-20 text-teal-200/40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.6 4 17c2.2-2.6 3.5-5.2 3-8-1.5-.8-2 1.2-2 2.5s.5 4 3 5.5z" transform="rotate(90 12 12)" />
        </svg>
      </div>

      {/* Hero */}
      <section className="min-h-screen flex items-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z' fill='%2310b981' fill-opacity='0.15'/%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-6xl mx-auto w-full z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {user.image && (
              <img src={user.image} alt={user.name} className="w-32 h-32 rounded-3xl mx-auto mb-8 object-cover border-4 border-emerald-200 shadow-lg" />
            )}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
              {user.name || "Developer"}
            </h1>
            <p className="text-xl text-emerald-600 mt-4 max-w-xl">{user.headline || "Building digital experiences"}</p>
            {user.location && (
              <p className="text-gray-600 mt-2">{user.location}</p>
            )}
            <div className="flex gap-4 mt-10">
              {user.socialLinks?.map((link: any) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 rounded-2xl bg-white/80 border border-emerald-100 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-all shadow-sm"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
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
              <div className="rounded-3xl bg-white/60 backdrop-blur border border-emerald-100 p-10 shadow-sm">
                <h2 className="text-3xl font-bold text-emerald-600 mb-6">About</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{user.bio}</p>
              </div>
            </FadeInView>
          </div>
        </section>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <section id="skills" className="py-24 px-4 scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <FadeInView>
              <h2 className="text-3xl font-bold text-emerald-600 mb-12">Skills</h2>
            </FadeInView>
            <StaggerContainer className="flex flex-wrap gap-3">
              {user.skills.map((skill: any) => (
                <StaggerItem key={skill.id}>
                  <span className="inline-block px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 font-medium border border-emerald-200 hover:bg-emerald-200/80 transition-colors">
                    {skill.name}
                  </span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <section id="projects" className="py-24 px-4 bg-white/30 scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <FadeInView>
              <h2 className="text-3xl font-bold text-emerald-600 mb-12">Projects</h2>
            </FadeInView>
            <div className="grid md:grid-cols-2 gap-8">
              {user.projects.map((project: any, i: number) => (
                <FadeInView key={project.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-3xl bg-white border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="w-full aspect-video object-cover" />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                      <p className="text-gray-600 mt-2">{project.description}</p>
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.techStack.map((tech: string) => (
                            <span key={tech} className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 mt-6">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
                            <Github className="h-4 w-4" /> Source
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
                            <ExternalLink className="h-4 w-4" /> Live
                          </a>
                        )}
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
        <section id="experience" className="py-24 px-4 scroll-mt-16">
          <div className="max-w-4xl mx-auto">
            <FadeInView>
              <h2 className="text-3xl font-bold text-emerald-600 mb-12">Experience</h2>
            </FadeInView>
            <div className="space-y-0">
              {user.experiences.map((exp: any, i: number) => (
                <FadeInView key={exp.id} delay={i * 0.1}>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 shrink-0" />
                      {i < user.experiences.length - 1 && (
                        <div className="w-0.5 flex-1 bg-emerald-200 min-h-[60px]" />
                      )}
                    </div>
                    <div className="pb-12">
                      <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                      <p className="text-emerald-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                      </p>
                      {exp.description && <p className="text-gray-600 mt-3">{exp.description}</p>}
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
        <section id="education" className="py-24 px-4 bg-white/30 scroll-mt-16">
          <div className="max-w-4xl mx-auto">
            <FadeInView>
              <h2 className="text-3xl font-bold text-emerald-600 mb-12">Education</h2>
            </FadeInView>
            <div className="space-y-8">
              {user.educations.map((edu: any, i: number) => (
                <FadeInView key={edu.id} delay={i * 0.1}>
                  <div className="rounded-2xl bg-white/80 border border-emerald-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </h3>
                    <p className="text-emerald-600 font-medium">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}
                    </p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-24 px-4 scroll-mt-16">
        <div className="max-w-2xl mx-auto">
          <FadeInView>
            <h2 className="text-3xl font-bold text-emerald-600 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-10">I&apos;d love to hear from you. Send me a message!</p>
            {sent ? (
              <div className="py-12 text-center rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-xl text-emerald-600 font-bold">Thanks for reaching out!</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Name"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-emerald-100 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                  <input
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-emerald-100 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>
                <input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Subject"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-emerald-100 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-emerald-100 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </FadeInView>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500 border-t border-emerald-100">
        © {new Date().getFullYear()} {user.name}
      </footer>
    </div>
  );
}
