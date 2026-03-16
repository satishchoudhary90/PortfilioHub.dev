"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillTooltipProps {
  name: string;
  level?: number;
  category?: string;
  children: React.ReactNode;
}

export function SkillTooltip({ name, level, category, children }: SkillTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (level || category) && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 shadow-xl shadow-black/30 whitespace-nowrap z-50 pointer-events-none"
          >
            <div className="text-center">
              <p className="text-xs font-medium text-white">{name}</p>
              {level != null && (
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{level}%</span>
                </div>
              )}
              {category && (
                <p className="text-[10px] text-gray-500 mt-0.5">{category}</p>
              )}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-2 h-2 bg-slate-800 border-r border-b border-white/10 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
