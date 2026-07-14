"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 460, damping: 20, mass: 0.7 } as const;

const AMBER = "#f7bb42";
const AMBER_DEEP = "#f59e2e";

const round = (n: number, d = 0) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** CSS gradient used to fill the avatar disc. */
  gradient: string;
  /** Integer 1..5. Defaults to 5. */
  rating?: number;
}

function Stars({ rating, seed }: { rating: number; seed: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.05, ...SPRING }}
            style={{ display: "inline-flex" }}
            // seed forces a fresh mount per testimonial so the stars re-pop
            data-seed={seed}
          >
            <Star
              className="h-[15px] w-[15px]"
              strokeWidth={1.5}
              style={{
                color: filled ? AMBER_DEEP : "rgba(255,255,255,0.18)",
                fill: filled ? AMBER : "rgba(255,255,255,0.03)",
                filter: filled
                  ? "drop-shadow(0 1px 5px rgba(247,187,66,0.4))"
                  : undefined,
              }}
            />
          </motion.span>
        );
      })}
    </div>
  );
}

const personVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const avatarVariants: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: SPRING },
};
const textVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

export function TestimonialCarousel({
  testimonials,
  interval = 5200,
  className,
}: {
  testimonials: Testimonial[];
  interval?: number;
  className?: string;
}) {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const elapsed = useRef(0);
  const paused = useRef(false);
  const progress = useMotionValue(0);
  const fillWidth = useTransform(progress, (p) => `${round(p * 100)}%`);

  useAnimationFrame((_, delta) => {
    if (paused.current || count <= 1) return;
    elapsed.current += delta;
    const p = Math.min(1, elapsed.current / interval);
    progress.set(p);
    if (elapsed.current >= interval) {
      elapsed.current = 0;
      progress.set(0);
      setIndex((i) => (i + 1) % count);
    }
  });

  function go(next: number) {
    elapsed.current = 0;
    progress.set(0);
    setIndex(((next % count) + count) % count);
  }

  const active = testimonials[index];
  const rating = active.rating ?? 5;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      className={cn(
        "relative flex w-full max-w-lg flex-col overflow-hidden rounded-[22px] border border-white/10 bg-panel p-8",
        "shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)]",
        className
      )}
    >
      {/* slow idle brand wash, keeps the panel alive at rest */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.26), transparent 70%)",
        }}
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
        }}
      />

      {/* header: rating + decorative quote glyph */}
      <div className="relative flex items-start justify-between">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`stars-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Stars rating={rating} seed={index} />
          </motion.div>
        </AnimatePresence>
        <Quote
          aria-hidden
          className="h-8 w-8 -scale-x-100 text-brand-soft/25"
          strokeWidth={1.5}
        />
      </div>

      {/* quote body, fixed min-height so the controls never jump */}
      <div className="relative mt-6 flex min-h-[132px] flex-1 items-start">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={`quote-${index}`}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-[17px] font-medium leading-relaxed tracking-[-0.01em] text-zinc-100"
          >
            {active.quote}
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="relative mt-6 h-px bg-white/[0.07]" />

      {/* footer: person + controls */}
      <div className="relative mt-5 flex items-center justify-between gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`person-${index}`}
            variants={personVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="flex items-center gap-3"
          >
            <motion.div
              variants={avatarVariants}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
              style={{ background: active.gradient } as CSSProperties}
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20"
              />
              {initialsOf(active.name)}
            </motion.div>
            <motion.div variants={textVariants} className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                {active.name}
              </div>
              <div className="truncate text-xs text-zinc-500">{active.role}</div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-1.5">
            {testimonials.map((t, i) => {
              const isActive = i === index;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={isActive}
                  className="group relative flex h-3 items-center"
                >
                  {isActive ? (
                    <span className="relative block h-1.5 w-7 overflow-hidden rounded-full bg-white/12">
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: fillWidth,
                          background: "linear-gradient(90deg, #7c6cff, #5b8cff)",
                        }}
                      />
                    </span>
                  ) : (
                    <span className="block h-1.5 w-1.5 rounded-full bg-white/25 transition-colors group-hover:bg-white/45" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

const demoTestimonials: Testimonial[] = [
  {
    quote:
      "We rebuilt our billing dashboard on Lumenite and shipped it two sprints early. The spring defaults are tuned so well that our designers signed off without a single revision.",
    name: "Daniel Osei",
    role: "Head of Design, Cadence",
    gradient: "linear-gradient(135deg, #7c6cff, #5b8cff)",
    rating: 5,
  },
  {
    quote:
      "This is the first component library where I never had to fight the animations. Everything lands at a clean 60fps, even on the three-year-old phones in our test lab.",
    name: "Mira Kapoor",
    role: "Principal Engineer, Northwind",
    gradient: "linear-gradient(135deg, #5b8cff, #4bd6c9)",
    rating: 5,
  },
  {
    quote:
      "I have shipped with every major UI kit. Lumenite is the only one that feels designed rather than assembled. The restraint in the negative space is what sold my whole team.",
    name: "Sasha Romero",
    role: "Frontend Architect, Lumen Labs",
    gradient: "linear-gradient(135deg, #a678ff, #7c6cff)",
    rating: 5,
  },
  {
    quote:
      "Our marketing site felt premium overnight and trial signups climbed within the week. The polish reads as trust, and Lumenite handed us that on day one.",
    name: "Theo Lindqvist",
    role: "Growth Lead, Parallel",
    gradient: "linear-gradient(135deg, #ff8a5b, #ff5b9c)",
    rating: 5,
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <TestimonialCarousel testimonials={demoTestimonials} />
    </div>
  );
}
