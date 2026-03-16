"use client";

import { motion } from "framer-motion";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { formatDate } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe, email: Mail };

function TypeWriter({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <span>{displayed}<span className="animate-pulse">_</span></span>;
}

export default function DarkHackerTemplate({ data }: { data: { user: any } }) {
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
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Matrix background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute text-green-500 text-xs whitespace-nowrap" style={{ left: `${i * 5}%` }}
            initial={{ y: -100 }} animate={{ y: "100vh" }} transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}>
            {Array.from({ length: 30 }, () => String.fromCharCode(0x30A0 + Math.random() * 96)).join("")}
          </motion.div>
        ))}
      </div>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative px-4">
        <div className="max-w-3xl w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-green-500/30 bg-black/80 backdrop-blur p-8">
            <div className="flex items-center gap-2 mb-4 text-green-600 text-xs">
              <Terminal className="h-4 w-4" />
              <span>terminal — bash</span>
              <div className="flex gap-1 ml-auto">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-green-600">$</span> whoami</p>
              <p className="text-green-300 text-2xl font-bold"><TypeWriter text={user.name || "Developer"} /></p>
              <p><span className="text-green-600">$</span> cat role.txt</p>
              <p className="text-green-300">{user.headline || "Full Stack Developer"}</p>
              {user.location && (<><p><span className="text-green-600">$</span> echo $LOCATION</p><p className="text-green-300">{user.location}</p></>)}
              <p><span className="text-green-600">$</span> ls ./social-links/</p>
              <div className="flex gap-3 mt-2">
                {user.socialLinks?.map((link: any) => {
                  const Icon = socialIcons[link.platform] || Globe;
                  return <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-300"><Icon className="h-5 w-5" /></a>;
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      {user.bio && (
        <section id="about" className="py-20 px-4 max-w-3xl mx-auto scroll-mt-16">
          <FadeInView>
            <div className="rounded-xl border border-green-500/20 bg-black/60 p-6">
              <p className="text-green-600 text-xs mb-3">{"/* about.md */"}</p>
              <h2 className="text-2xl font-bold text-green-300 mb-4"># About</h2>
              <p className="text-green-400/80 leading-relaxed">{user.bio}</p>
            </div>
          </FadeInView>
        </section>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <section id="skills" className="py-20 px-4 max-w-3xl mx-auto scroll-mt-16">
          <FadeInView>
            <h2 className="text-2xl font-bold text-green-300 mb-8"># Skills</h2>
          </FadeInView>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {user.skills.map((skill: any) => (
              <StaggerItem key={skill.id}>
                <motion.div whileHover={{ scale: 1.05 }} className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-green-300">{skill.name}</span>
                    <span className="text-green-600">[{skill.level}%]</span>
                  </div>
                  <div className="h-1 bg-green-900/50 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-green-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <section id="projects" className="py-20 px-4 max-w-5xl mx-auto scroll-mt-16">
          <FadeInView>
            <h2 className="text-2xl font-bold text-green-300 mb-8"># Projects</h2>
          </FadeInView>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.projects.map((project: any) => (
              <StaggerItem key={project.id}>
                <motion.div whileHover={{ borderColor: "rgba(34, 197, 94, 0.5)" }} className="rounded-xl border border-green-500/20 bg-black/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Terminal className="h-3 w-3" />
                    <span>project/{project.title.toLowerCase().replace(/\s+/g, "-")}</span>
                  </div>
                  <h3 className="font-bold text-green-300 text-lg">{project.title}</h3>
                  <p className="text-sm text-green-400/60">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 text-[10px] rounded border border-green-500/30 text-green-400">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-2">
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-400 text-xs flex items-center gap-1"><Github className="h-3 w-3" /> source</a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-400 text-xs flex items-center gap-1"><ExternalLink className="h-3 w-3" /> demo</a>}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Experience */}
      {user.experiences?.length > 0 && (
        <section id="experience" className="py-20 px-4 max-w-3xl mx-auto scroll-mt-16">
          <FadeInView><h2 className="text-2xl font-bold text-green-300 mb-8"># Experience</h2></FadeInView>
          <div className="space-y-6">
            {user.experiences.map((exp: any, i: number) => (
              <FadeInView key={exp.id} delay={i * 0.1}>
                <div className="p-5 rounded-xl border border-green-500/20 bg-black/60">
                  <p className="text-xs text-green-600 mb-2">{`// ${formatDate(exp.startDate)} - ${exp.current ? "present" : exp.endDate ? formatDate(exp.endDate) : ""}`}</p>
                  <h3 className="font-bold text-green-300">{exp.position}</h3>
                  <p className="text-green-500 text-sm">@{exp.company}</p>
                  {exp.description && <p className="text-sm text-green-400/60 mt-3">{exp.description}</p>}
                </div>
              </FadeInView>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 px-4 max-w-2xl mx-auto scroll-mt-16">
        <FadeInView>
          <h2 className="text-2xl font-bold text-green-300 mb-8 text-center"># Contact</h2>
          {sent ? (
            <div className="text-center py-8 text-green-400">
              <p className="text-lg">&gt; Message transmitted successfully</p>
            </div>
          ) : (
            <form onSubmit={handleContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="name" required className="w-full px-4 py-3 rounded-lg bg-black border border-green-500/30 text-green-400 placeholder:text-green-800 focus:border-green-500 focus:outline-none font-mono" />
                <input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} type="email" placeholder="email" required className="w-full px-4 py-3 rounded-lg bg-black border border-green-500/30 text-green-400 placeholder:text-green-800 focus:border-green-500 focus:outline-none font-mono" />
              </div>
              <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="subject" className="w-full px-4 py-3 rounded-lg bg-black border border-green-500/30 text-green-400 placeholder:text-green-800 focus:border-green-500 focus:outline-none font-mono" />
              <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="message" rows={5} required className="w-full px-4 py-3 rounded-lg bg-black border border-green-500/30 text-green-400 placeholder:text-green-800 focus:border-green-500 focus:outline-none font-mono resize-none" />
              <button type="submit" disabled={sending} className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-black font-bold transition-colors disabled:opacity-50 font-mono">
                {sending ? "transmitting..." : "$ send --message"}
              </button>
            </form>
          )}
        </FadeInView>
      </section>

      <footer className="py-8 text-center text-xs text-green-800 border-t border-green-500/10">
        {"// powered by DevPortfolio Builder"}
      </footer>
    </div>
  );
}
