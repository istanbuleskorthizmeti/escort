"use client";

import React from "react";
import { motion } from "framer-motion";

interface UltraCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * 💎 ULTRA CARD v1.0
 * Premium glassmorphism with dynamic gradient borders and hover micro-interactions.
 */
export const UltraCard: React.FC<UltraCardProps> = ({ 
  children, 
  className = "", 
  glowColor = "rgba(225, 29, 72, 0.2)" 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`relative group bg-zinc-950/80 backdrop-blur-3xl border border-zinc-900 rounded-[2.5rem] p-8 overflow-hidden transition-all duration-500 hover:border-rose-600/50 ${className}`}
    >
      {/* Dynamic Glow Effect */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />
      
      {/* Gradient Border Overlay */}
      <div className="absolute inset-0 rounded-[2.5rem] p-px pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-transparent to-zinc-900 group-hover:from-rose-600/20 group-hover:to-rose-900/20 rounded-[2.5rem] transition-colors duration-700" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
