"use client";

import { motion } from "framer-motion";
import { FadeInView } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

export default function RetroTerminalTemplate({ data }: { data: { user: any } }) {
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
    <div className="min-h-screen bg-black text-[#00ff41] font-mono relative overflow-hidden">
      {/* Scanline overlay effect */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative px-4 pt-20">
        <FadeInView>
          <div className="max-w-2xl w-full p-6 rounded border-2 border-[#00ff41]/40 shadow-[0_0_20px_rgba(0,255,65,0.15)] bg-black/90">
            <div className="space-y-2 text-sm">
              <p className="text-[#33ff57]/80">&gt; whoami</p>
              <p className="text-2xl font-bold text-[#00ff41]">{user.name || "Developer"}</p>
              <p className="text-[#33ff57]/80">&gt; echo $ROLE</p>
              <p className="text-[#00ff41]">{user.headline || "Full Stack Developer"}</p>
              {user.location && (
                <>
                  <p className="text-[#33ff57]/80">&gt; echo $LOCATION</p>
                  <p className="text-[#00ff41]">{user.location}</p>
                </>
              )}
              {user.image && (
                <div className="py-4">
                  <img src={user.image} alt={user.name} className="w-24 h-24 rounded border border-[#00ff41]/50 object-cover" />
                </div>
              )}
              {user.socialLinks?.length > 0 && (
                <>
                  <p className="text-[#33ff57]/80">&gt; ls social/</p>
                  <div className="flex gap-4 mt-2">
                    {user.socialLinks.map((link: any) => {
                      const Icon = socialIcons[link.platform] || Globe;
                      return (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00ff41] hover:text-[#33ff57] transition-colors"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </FadeInView>
      </section>

      {/* About */}
      {user.bio && (
        <section className="py-16 px-4 max-w-3xl mx-auto">
          <FadeInView>
            <div className="p-6 rounded border-2 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] bg-black/80">
              <p className="text-[#33ff57]/70 text-xs mb-3">$ cat about.txt</p>
              <div className="space-y-2 text-[#00ff41]/90 leading-relaxed">{user.bio}</div>
            </div>
          </FadeInView>
        </section>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <section className="py-16 px-4 max-w-3xl mx-auto">
          <FadeInView>
            <div className="p-6 rounded border-2 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] bg-black/80">
              <p className="text-[#33ff57]/70 text-xs mb-4">$ ls skills/</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {user.skills.map((skill: any) => (
                  <div key={skill.id} className="p-2 border border-[#00ff41]/20 rounded">
                    <span className="text-[#00ff41]">{skill.name}</span>
                    {skill.level != null && <span className="text-[#33ff57]/70 text-xs ml-2">[{skill.level}%]</span>}
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </section>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <FadeInView>
            <div className="p-6 rounded border-2 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] bg-black/80">
              <p className="text-[#33ff57]/70 text-xs mb-4">$ ls -la projects/</p>
              <div className="space-y-4">
                {user.projects.map((project: any) => (
                  <div key={project.id} className="p-4 border border-[#00ff41]/20 rounded hover:border-[#00ff41]/50 transition-colors">
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-36 object-cover rounded mb-3 border border-[#00ff41]/20" />
                    )}
                    <h3 className="font-bold text-[#00ff41] text-lg">./{project.title}</h3>
                    {project.description && <p className="text-[#33ff57]/80 text-sm mt-1">{project.description}</p>}
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.techStack.map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 text-xs border border-[#00ff41]/30 rounded text-[#33ff57]/90">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 mt-2 text-xs">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#00ff41] hover:text-[#33ff57] flex items-center gap-1">
                          <Github className="h-3 w-3" /> source
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#00ff41] hover:text-[#33ff57] flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> live
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </section>
      )}

      {/* Experience */}
      {user.experiences?.length > 0 && (
        <section className="py-16 px-4 max-w-3xl mx-auto">
          <FadeInView>
            <div className="p-6 rounded border-2 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] bg-black/80">
              <p className="text-[#33ff57]/70 text-xs mb-4">$ cat experience.log</p>
              <div className="space-y-4 font-mono">
                {user.experiences.map((exp: any) => (
                  <div key={exp.id} className="border-l-2 border-[#00ff41]/50 pl-4">
                    <h3 className="font-bold text-[#00ff41]">{exp.position}</h3>
                    <p className="text-[#33ff57]/80 text-sm">@{exp.company}</p>
                    <p className="text-[#33ff57]/60 text-xs mt-1">
                      {formatDate(exp.startDate)} — {exp.current ? "present" : exp.endDate ? formatDate(exp.endDate) : "—"}
                    </p>
                    {exp.description && <p className="text-[#00ff41]/80 text-sm mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </section>
      )}

      {/* Education */}
      {user.educations?.length > 0 && (
        <section className="py-16 px-4 max-w-3xl mx-auto">
          <FadeInView>
            <div className="p-6 rounded border-2 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] bg-black/80">
              <p className="text-[#33ff57]/70 text-xs mb-4">$ cat education.log</p>
              <div className="space-y-4 font-mono">
                {user.educations.map((edu: any) => (
                  <div key={edu.id} className="border-l-2 border-[#00ff41]/50 pl-4">
                    <h3 className="font-bold text-[#00ff41]">
                      {edu.degree}
                      {edu.field ? ` — ${edu.field}` : ""}
                    </h3>
                    <p className="text-[#33ff57]/80 text-sm">{edu.institution}</p>
                    <p className="text-[#33ff57]/60 text-xs mt-1">
                      {formatDate(edu.startDate)} — {edu.current ? "present" : edu.endDate ? formatDate(edu.endDate) : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </section>
      )}

      {/* Contact */}
      <section className="py-16 px-4 max-w-xl mx-auto">
        <FadeInView>
          <div className="p-6 rounded border-2 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] bg-black/80">
            <p className="text-[#33ff57]/70 text-xs mb-4">$ nano contact.txt</p>
            {sent ? (
              <div className="text-center py-8 text-[#00ff41]">
                <p className="text-lg">&gt; Message transmitted successfully.</p>
                <p className="text-[#33ff57]/70 text-sm mt-2">[Written to contact.log]</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="text-[#33ff57]/70 text-xs block mb-1">name:</label>
                  <input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="your_name"
                    required
                    className="w-full px-3 py-2 rounded bg-black border border-[#00ff41]/40 text-[#00ff41] placeholder:text-[#00ff41]/30 focus:border-[#00ff41] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#33ff57]/70 text-xs block mb-1">email:</label>
                  <input
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    type="email"
                    placeholder="user@host.com"
                    required
                    className="w-full px-3 py-2 rounded bg-black border border-[#00ff41]/40 text-[#00ff41] placeholder:text-[#00ff41]/30 focus:border-[#00ff41] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#33ff57]/70 text-xs block mb-1">subject:</label>
                  <input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="RE:"
                    className="w-full px-3 py-2 rounded bg-black border border-[#00ff41]/40 text-[#00ff41] placeholder:text-[#00ff41]/30 focus:border-[#00ff41] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#33ff57]/70 text-xs block mb-1">message:</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Enter your message..."
                    rows={5}
                    required
                    className="w-full px-3 py-2 rounded bg-black border border-[#00ff41]/40 text-[#00ff41] placeholder:text-[#00ff41]/30 focus:border-[#00ff41] focus:outline-none font-mono resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded border-2 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors disabled:opacity-50 font-mono font-bold"
                >
                  {sending ? "> sending..." : "> send --message"}
                </button>
              </form>
            )}
          </div>
        </FadeInView>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[#33ff57]/50 text-xs font-mono border-t border-[#00ff41]/10">
        © {new Date().getFullYear()} {user.name || "Developer"}. All rights reserved.
      </footer>
    </div>
  );
}
