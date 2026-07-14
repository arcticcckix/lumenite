"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Gauge,
  Layers,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Section {
  label: string;
  title: string;
  body: string;
  accent: string;
  icon: LucideIcon;
}

const SECTIONS: Section[] = [
  {
    label: "Compose",
    title: "Compose from primitives",
    body: "Start with typed, headless building blocks. Every prop autocompletes and carries its own inline documentation.",
    accent: "#7c6cff",
    icon: Layers,
  },
  {
    label: "Motion",
    title: "Tune one motion curve",
    body: "A single spring drives every transition, so menus, sheets, and overlays all move like one coherent product.",
    accent: "#5b8cff",
    icon: Gauge,
  },
  {
    label: "Ship",
    title: "Own the source",
    body: "Copy each component straight into your repo. No runtime dependency, no version lock, no surprises at build time.",
    accent: "#4bc9e0",
    icon: Rocket,
  },
];

const AUTO_MS = 3000;
const RESUME_MS = 2000;

// Deterministic pseudo-random for decorative specks (no Math.random at render).
const rand = (i: number) => Math.abs(Math.sin(i * 999.13));

const SPECKS = Array.from({ length: 12 }, (_, i) => ({
  left: Math.round(rand(i + 1) * 100),
  top: Math.round(rand(i + 41) * 100),
  size: Math.round(1 + rand(i + 7) * 2),
  delay: Math.round(rand(i + 3) * 30) / 10,
  dur: Math.round((5 + rand(i + 5) * 4) * 10) / 10,
}));

function Stage({ active }: { active: number }) {
  const section = SECTIONS[active];
  const Icon = section.icon;

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-panel">
      {/* Continuously rotating aura, crossfading per active step */}
      <motion.div
        aria-hidden
        className="absolute -inset-[35%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.label}
            className="absolute inset-0 blur-2xl"
            style={{
              background: `radial-gradient(closest-side at 50% 42%, ${s.accent}66, transparent 72%)`,
            }}
            animate={{ opacity: active === i ? 0.9 : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        ))}
      </motion.div>

      {/* Drifting glow for constant low-key motion at rest */}
      <motion.div
        aria-hidden
        className="absolute h-40 w-40 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.28), transparent 70%)",
        }}
        animate={{ x: [-12, 18, -6, -12], y: [8, -10, 14, 8] }}
        transition={{ duration: 13, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Floating specks */}
      {SPECKS.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}

      {/* Thin shimmering top edge */}
      <div
        aria-hidden
        className="animate-shimmer absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
        style={{ backgroundSize: "200% 100%" }}
      />
      {/* Legibility veil */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-panel/10 via-transparent to-panel/70"
      />

      {/* Foreground content, swaps per active step */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-500">
            {String(active + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
          </span>
          <ArrowUpRight className="h-4 w-4 text-zinc-600" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={section.label}
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {/* Pulsing ring for constant life */}
              <motion.span
                aria-hidden
                className="absolute top-0 h-14 w-14 rounded-2xl border"
                style={{ borderColor: section.accent }}
                animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
                transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity }}
              />
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                style={{
                  borderColor: `${section.accent}59`,
                  background: `${section.accent}1f`,
                  boxShadow: `0 0 32px ${section.accent}33`,
                }}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: section.accent }}
                  strokeWidth={1.6}
                />
              </div>
              <span className="mt-4 text-[13px] font-medium tracking-wide text-white">
                {section.label}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Segmented progress */}
        <div className="flex items-center gap-1.5">
          {SECTIONS.map((s, i) => (
            <div
              key={s.label}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10"
            >
              <motion.div
                className="absolute inset-0 origin-left rounded-full"
                style={{ background: s.accent }}
                animate={{ scaleX: active === i ? 1 : 0, opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              {active === i && (
                <div
                  className="animate-shimmer absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ backgroundSize: "200% 100%" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StickyScrollReveal({
  container,
  className,
}: {
  container?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Idle auto-advance so a static preview reads as intentional and alive.
  const pausedRef = useRef(false);
  const lastVRef = useRef(0);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const delta = Math.abs(v - lastVRef.current);
    lastVRef.current = v;
    // Ignore the initial settle so auto-play can start immediately.
    if (delta < 0.001) return;

    setScrolled(true);
    const idx = Math.min(SECTIONS.length - 1, Math.floor(v * SECTIONS.length));
    setActive(idx);

    // Hand control to the user, then resume idle play after a quiet moment.
    pausedRef.current = true;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_MS);
  });

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActive((a) => (a + 1) % SECTIONS.length);
    }, AUTO_MS);
    return () => {
      clearInterval(id);
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative mx-auto flex max-w-2xl gap-6 px-5 sm:gap-10 sm:px-8", className)}
    >
      <div className="sticky top-6 h-fit w-40 shrink-0 pt-8 sm:w-56">
        <Stage active={active} />
        <div className="mt-4 flex items-center gap-2">
          <AnimatePresence>
            {!scrolled && (
              <motion.div
                className="flex items-center gap-1.5 text-[11px] text-zinc-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.span
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
                Scroll to step through
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 py-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            How it works
          </span>
        </div>
        <h2 className="mb-10 max-w-xs text-2xl font-semibold leading-tight text-white">
          Three steps from blank file to shipped.
        </h2>

        <div className="flex flex-col">
          {SECTIONS.map((s, i) => {
            const isActive = active === i;
            return (
              <div
                key={s.label}
                className="flex min-h-[190px] flex-col justify-center"
              >
                <motion.div
                  className="relative max-w-xs pl-5"
                  animate={{ opacity: isActive ? 1 : 0.32 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {/* Accent rule */}
                  <div className="absolute bottom-1 left-0 top-1 w-px bg-white/10" />
                  <motion.div
                    className="absolute bottom-1 left-0 top-1 w-px origin-top rounded-full"
                    style={{ background: s.accent, boxShadow: `0 0 12px ${s.accent}` }}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />

                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-xs"
                      style={{ color: isActive ? s.accent : undefined }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {s.body}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 30% 0%, rgba(124,108,255,0.10), transparent 60%)",
        }}
      />
      <div
        ref={containerRef}
        className="no-scrollbar relative h-full w-full overflow-y-auto py-2"
      >
        <StickyScrollReveal container={containerRef} />
      </div>
    </div>
  );
}
