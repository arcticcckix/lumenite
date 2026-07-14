"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = ["Home", "Products", "Pricing", "About"];

export function GlassNav({ className }: { className?: string }) {
  const [active, setActive] = useState("Home");

  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-full p-1.5",
        "bg-white/10 backdrop-blur-xl backdrop-saturate-150",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.12), 0 16px 40px -16px rgba(0,0,0,0.7)",
      }}
    >
      {LINKS.map((l) => (
        <button
          key={l}
          onClick={() => setActive(l)}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active === l ? "text-white" : "text-white/60 hover:text-white"
          )}
        >
          {active === l && (
            <motion.span
              layoutId="glass-nav-pill"
              className="absolute inset-0 rounded-full bg-white/20"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{l}</span>
        </button>
      ))}
    </nav>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-8">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#22d3ee] blur-[80px]" />
        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-[#7c6cff] blur-[80px]" />
        <div className="absolute bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[#ff5f8f] blur-[80px]" />
      </div>
      <div className="relative">
        <GlassNav />
      </div>
    </div>
  );
}
