"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function SunsetWarmTemplate({ data }: { data: { user: any } }) {
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
    setContactForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 text-gray-900">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-rose-100/30 to-amber-100/50" />
        <div className="max-w-5xl mx-auto px-6 z-10 py-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            {user.image && (
              <img src={user.image} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-8 border-4 border-orange-200/80 object-cover shadow-lg shadow-orange-200/50" />
            )}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
              {user.name}
            </h1>
            {user.headline && <p className="text-xl md:text-2xl text-gray-700 mt-4 max-w-2xl mx-auto">{user.headline}</p>}
            {user.location && (
              <p className="flex items-center justify-center gap-2 text-gray-600 mt-4"><MapPin className="h-4 w-4" /> {user.location}</p>
            )}
            <div className="flex justify-center gap-3 mt-8">
              {user.socialLinks?.map((link: any) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/70 border border-orange-200/60 hover:bg-orange-100 hover:border-orange-400 transition-all hover:scale-110 text-gray-700 hover:text-orange-600">
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {user.bio && (
        <section className="py-24 px-6">
          <FadeInView>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-transparent bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text">About Me</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          </FadeInView>
        </section>
      )}

      {user.skills?.length > 0 && (
        <section className="py-24 px-6 bg-white/40">
          <div className="max-w-5xl mx-auto">
            <FadeInView><h2 className="text-3xl font-bold mb-12 text-transparent bg-gradient-to-r from-rose-500 to-amber-600 bg-clip-text">Skills</h2></FadeInView>
            <StaggerContainer className="flex flex-wrap gap-3">
              {user.skills.map((skill: any) => (
                <StaggerItem key={skill.id}>
                  <span className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-rose-100 border border-orange-300/50 text-orange-800 hover:border-orange-500 hover:bg-orange-50 transition-all">
                    {skill.name}
                    {skill.level && <span className="ml-2 text-xs text-amber-600">{skill.level}%</span>}
                  </span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {user.projects?.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <FadeInView><h2 className="text-3xl font-bold mb-12 text-transparent bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text">Projects</h2></FadeInView>
            <div className="grid md:grid-cols-2 gap-6">
              {user.projects.map((project: any) => (
                <FadeInView key={project.id}>
                  <div className="group rounded-2xl bg-white/60 border border-orange-200/60 p-6 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100 transition-all">
                    {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover rounded-xl mb-4" />}
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    {project.description && <p className="text-gray-600 mt-2 text-sm line-clamp-3">{project.description}</p>}
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.techStack.map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-1 text-xs rounded-md bg-amber-100 text-amber-800">{tech}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 mt-4">
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-orange-500 flex items-center gap-1"><Github className="h-4 w-4" /> Code</a>}
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-rose-500 flex items-center gap-1"><ExternalLink className="h-4 w-4" /> Live</a>}
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.experiences?.length > 0 && (
        <section className="py-24 px-6 bg-white/40">
          <div className="max-w-4xl mx-auto">
            <FadeInView><h2 className="text-3xl font-bold mb-12 text-transparent bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text">Experience</h2></FadeInView>
            <div className="space-y-8 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-orange-400 before:to-rose-400 pl-8">
              {user.experiences.map((exp: any) => (
                <FadeInView key={exp.id}>
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 ring-4 ring-orange-50" />
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-orange-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}</p>
                    {exp.description && <p className="text-gray-600 mt-3 text-sm leading-relaxed">{exp.description}</p>}
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {user.educations?.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <FadeInView><h2 className="text-3xl font-bold mb-12 text-transparent bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text">Education</h2></FadeInView>
            <div className="space-y-6">
              {user.educations.map((edu: any) => (
                <FadeInView key={edu.id}>
                  <div className="p-6 rounded-2xl bg-white/60 border border-orange-200/60">
                    <h3 className="font-bold text-lg text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                    <p className="text-rose-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-xl mx-auto">
          <FadeInView>
            <h2 className="text-3xl font-bold mb-8 text-transparent bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-center">Get in Touch</h2>
            {sent ? (
              <div className="text-center py-12 text-amber-600 font-medium">Message sent!</div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <input value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" required className="w-full p-3 rounded-xl bg-white/80 border border-orange-200/60 text-gray-900 placeholder-gray-500 focus:border-orange-500 outline-none" />
                <input value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" type="email" required className="w-full p-3 rounded-xl bg-white/80 border border-orange-200/60 text-gray-900 placeholder-gray-500 focus:border-orange-500 outline-none" />
                <input value={contactForm.subject} onChange={(e) => setContactForm(p => ({ ...p, subject: e.target.value }))} placeholder="Subject" className="w-full p-3 rounded-xl bg-white/80 border border-orange-200/60 text-gray-900 placeholder-gray-500 focus:border-orange-500 outline-none" />
                <textarea value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Message" rows={4} required className="w-full p-3 rounded-xl bg-white/80 border border-orange-200/60 text-gray-900 placeholder-gray-500 focus:border-orange-500 outline-none resize-none" />
                <button type="submit" disabled={sending} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-600 font-semibold text-white hover:opacity-90 transition-opacity">{sending ? "Sending..." : "Send Message"}</button>
              </form>
            )}
          </FadeInView>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-orange-200/60">
        © {new Date().getFullYear()} {user.name}. Built with DevPortfolio.
      </footer>
    </div>
  );
}
