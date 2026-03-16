"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Code2, FolderKanban, Briefcase, GraduationCap, Mail, ChevronUp } from "lucide-react";

const navSections = [
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
];

export function PortfolioNav({ userName }: { userName: string }) {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    const sectionEls = navSections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    const ids = sectionEls.map((el) => el.id);
    setVisible(ids);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionEls.forEach((el) => observer.observe(el));

    function onScroll() {
      setScrolled(window.scrollY > 100);
      setShowTop(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const displaySections = navSections.filter((s) => visible.includes(s.id));

  if (displaySections.length === 0) return null;

  return (
    <>
      {/* Top Navigation Bar */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-black/60 border-b border-white/[0.06]"
          >
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/90 truncate max-w-[160px]">
                {userName}
              </span>
              <div className="flex items-center gap-1">
                {displaySections.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navPill"
                          className="absolute inset-0 rounded-full bg-white/10 border border-white/[0.08]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <Icon className="h-3.5 w-3.5 relative z-10" />
                      <span className="relative z-10 hidden sm:inline">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-[100] p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/20 transition-all shadow-lg shadow-black/20"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
