"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "relative mb-4 break-inside-avoid rounded-2xl border border-line bg-panel p-5 transition-colors",
        hovering && "border-brand/50"
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            "radial-gradient(180px circle at 50% 0%, rgba(124,108,255,0.14), transparent 70%)",
        }}
      />
      <p className="relative z-10 text-sm leading-relaxed text-zinc-300">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="relative z-10 mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-glow text-xs font-semibold text-white">
          {initials(testimonial.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{testimonial.name}</p>
          <p className="text-xs text-zinc-500">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialWall({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  return (
    <div className={cn("columns-1 gap-4 sm:columns-3", className)}>
      {testimonials.map((t, i) => (
        <TestimonialCard key={t.name} testimonial={t} index={i} />
      ))}
    </div>
  );
}

const DEMO: Testimonial[] = [
  { name: "Ava Chen", role: "Founder, Nimbus", quote: "We shipped our landing page in a single afternoon. The polish is unreal." },
  { name: "Marcus Reed", role: "CTO, Fjord", quote: "Every component feels art-directed. Our design team stopped asking for custom builds." },
  { name: "Sofia Lima", role: "PM, Orbital", quote: "The animations are subtle enough to feel premium, not gimmicky." },
  { name: "Jonah Park", role: "Design Lead, Vessel", quote: "Best component library we've used for fast, credible-looking MVPs." },
  { name: "Priya Nair", role: "Founder, Kindle Labs", quote: "Dropped this straight into production. Zero rework needed." },
  { name: "Elliot Cross", role: "Eng, Northstar", quote: "Tailwind tokens made re-theming trivial across our whole app." },
];

export default function Demo() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#050508] p-6">
      <TestimonialWall testimonials={DEMO} />
    </div>
  );
}
