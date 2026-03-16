"use client";

import { Github, Linkedin, Twitter, Globe, Mail, Heart } from "lucide-react";
import { motion } from "framer-motion";

const socialIcons: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  email: Mail,
};

interface FooterProps {
  userName: string;
  socialLinks?: { id: string; platform: string; url: string }[];
}

export function PortfolioFooter({ userName, socialLinks }: FooterProps) {
  return (
    <footer className="relative border-t border-white/[0.06] bg-black/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {userName}. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 justify-center sm:justify-start">
              Built with <Heart className="h-3 w-3 text-red-500/60" /> using{" "}
              <span className="text-indigo-400/80 font-medium">DevPortfolio</span>
            </p>
          </div>
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
