"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  gradient: string;
}

function Avatar({
  initials,
  gradient,
  size = 44,
  ring = false,
}: {
  initials: string;
  gradient: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        ring && "ring-2 ring-void"
      )}
      style={{
        width: size,
        height: size,
        background: gradient,
      }}
    >
      {initials}
    </div>
  );
}

export function AnimatedTestimonials({
  testimonials,
  interval = 4000,
  className,
}: {
  testimonials: Testimonial[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(id);
  }, [testimonials.length, interval]);

  const active = testimonials[index];
  const words = active.quote.split(" ");

  return (
    <div
      className={cn(
        "relative w-full max-w-lg rounded-2xl border border-line bg-panel p-8",
        className
      )}
    >
      <div className="mb-6 flex -space-x-3">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setIndex(i)}
            aria-label={t.name}
            className="transition-transform duration-300"
            style={{
              transform: i === index ? "translateY(-4px) scale(1.1)" : "none",
              zIndex: i === index ? 10 : 1,
            }}
          >
            <Avatar initials={t.name.slice(0, 2).toUpperCase()} gradient={t.gradient} ring />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <p className="text-lg leading-relaxed text-zinc-200">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="mr-1.5 inline-block"
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
              >
                {word}
              </motion.span>
            ))}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Avatar initials={active.name.slice(0, 2).toUpperCase()} gradient={active.gradient} />
            <div>
              <div className="text-sm font-semibold text-white">{active.name}</div>
              <div className="text-xs text-zinc-500">{active.title}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const demoTestimonials: Testimonial[] = [
  {
    quote: "Lumenite cut our build time in half, every component just works, out of the box.",
    name: "Ava Chen",
    title: "Product Lead, Northstar",
    gradient: "linear-gradient(135deg, #7c6cff, #5b8cff)",
  },
  {
    quote: "The polish here is genuinely Aceternity-level. Our designers stopped filing tickets.",
    name: "Marcus Reed",
    title: "Design Director, Fluent",
    gradient: "linear-gradient(135deg, #ff8a5b, #ff5b9c)",
  },
  {
    quote: "We shipped a marketing site in a weekend. The motion defaults sell themselves.",
    name: "Priya Nair",
    title: "Founder, Kindred",
    gradient: "linear-gradient(135deg, #5bffb0, #5b8cff)",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <AnimatedTestimonials testimonials={demoTestimonials} />
    </div>
  );
}
