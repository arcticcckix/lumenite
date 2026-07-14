"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function LinkPreviewHover({
  href = "#",
  label,
  previewTitle,
  previewDescription,
  gradient = "linear-gradient(135deg,#7c6cff,#5b8cff)",
  host = "lumenite.dev",
  forceOpen = false,
  onHoverChange,
  className,
}: {
  href?: string;
  label: string;
  previewTitle: string;
  previewDescription: string;
  gradient?: string;
  host?: string;
  /** Lets a parent auto-open the preview (used to keep the demo alive at rest). */
  forceOpen?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const open = active || forceOpen;

  const set = (v: boolean) => {
    setActive(v);
    onHoverChange?.(v);
  };

  const initials = previewTitle
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={cn("relative inline-block align-baseline", className)}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
    >
      <span
        role="link"
        tabIndex={0}
        data-href={href}
        onFocus={() => set(true)}
        onBlur={() => set(false)}
        className={cn(
          "relative cursor-pointer font-medium underline-offset-4 outline-none transition-colors duration-300",
          open ? "text-white" : "text-brand-soft hover:text-white"
        )}
      >
        {label}
        <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 block h-px overflow-hidden rounded-full">
          <span
            className={cn(
              "absolute inset-0 rounded-full transition-colors duration-300",
              open ? "bg-brand/70" : "bg-brand/30"
            )}
          />
          {open ? (
            <motion.span
              className="absolute top-0 h-px w-6 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
              initial={{ x: "-30%" }}
              animate={{ x: "320%" }}
              transition={{ duration: 1.5, ease: EASE, repeat: Infinity, repeatDelay: 0.5 }}
            />
          ) : null}
        </span>
      </span>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute bottom-full left-1/2 z-30 mb-3 w-64 -translate-x-1/2 select-none"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_24px_70px_-20px_rgba(91,140,255,0.5)]"
            >
              {/* Thumbnail: a living gradient, not a flat block */}
              <div
                className="relative h-24 w-full overflow-hidden"
                style={{ background: gradient }}
              >
                <motion.div
                  className="absolute -left-6 -top-10 h-24 w-24 rounded-full bg-white/25 blur-2xl"
                  animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
                  transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
                />
                <motion.div
                  className="absolute -right-8 top-4 h-28 w-28 rounded-full bg-black/30 blur-2xl"
                  animate={{ x: [0, -14, 0], y: [0, -8, 0] }}
                  transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
                />
                <div
                  className="absolute inset-0 opacity-30 mix-blend-soft-light"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <motion.div
                  className="pointer-events-none absolute inset-y-0 w-14 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: -48 }}
                  animate={{ x: 300 }}
                  transition={{ duration: 3.6, ease: EASE, repeat: Infinity, repeatDelay: 1.1 }}
                />
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/25 bg-black/25 font-mono text-[11px] font-semibold text-white backdrop-blur-sm">
                  {initials}
                </div>
                <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
              </div>

              {/* Body */}
              <div className="p-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="truncate font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                    {host}
                  </span>
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-zinc-500" />
                </div>
                <div className="mt-2 text-[13px] font-semibold text-white">
                  {previewTitle}
                </div>
                <div className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                  {previewDescription}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

const DEMO_LINKS = [
  {
    href: "#components",
    label: "component library",
    previewTitle: "Component Library",
    previewDescription:
      "Forty plus copy paste components, fully typed and themed for dark UIs.",
    host: "lumenite.dev/components",
    gradient: "linear-gradient(135deg,#7c6cff,#5b8cff)",
  },
  {
    href: "#motion",
    label: "motion primitives",
    previewTitle: "Motion Primitives",
    previewDescription:
      "Springs, gestures, and scroll effects built on Framer Motion.",
    host: "lumenite.dev/motion",
    gradient: "linear-gradient(135deg,#7c6cff,#22d3ee)",
  },
  {
    href: "#changelog",
    label: "changelog",
    previewTitle: "Changelog",
    previewDescription:
      "Shipped weekly. New components, refinements, and API notes.",
    host: "lumenite.dev/changelog",
    gradient: "linear-gradient(135deg,#d946ef,#5b8cff)",
  },
];

export default function Demo() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);

  // Continuous idle animation: the demo cycles through its own links so the
  // static preview always shows a live card. Real hover/focus takes over.
  useEffect(() => {
    const id = setInterval(
      () => setAuto((a) => (a + 1) % DEMO_LINKS.length),
      3400
    );
    return () => clearInterval(id);
  }, []);

  const bind = (i: number) => ({
    forceOpen: hovered === null && auto === i,
    onHoverChange: (h: boolean) =>
      setHovered(h ? i : (v) => (v === i ? null : v)),
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-void px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />
      <p className="relative max-w-md text-center text-[15px] leading-9 text-zinc-300">
        Lumenite ships a growing set of motion primitives for React. Browse the{" "}
        <LinkPreviewHover {...DEMO_LINKS[0]} {...bind(0)} />, compose your
        interactions with the <LinkPreviewHover {...DEMO_LINKS[1]} {...bind(1)} />
        , or follow every release in the{" "}
        <LinkPreviewHover {...DEMO_LINKS[2]} {...bind(2)} />.
      </p>
    </div>
  );
}
