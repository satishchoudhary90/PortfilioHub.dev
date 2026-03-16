"use client";

import { Github, Linkedin, Twitter, Globe, Mail, Heart, ArrowUp } from "lucide-react";
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
    <footer className="relative border-t border-white/[0.06] bg-gradient-to-b from-black/30 to-black/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center gap-6">
          {/* Social links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.a>
                );
              })}
            </div>
          )}

          {/* Divider */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {userName}. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1 justify-center">
              Built with <Heart className="h-3 w-3 text-red-500/60 animate-pulse" /> using{" "}
              <span className="text-indigo-400/80 font-medium">DevPortfolio</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
