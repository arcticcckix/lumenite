"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Play, Pause, Volume2, Settings, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Mock clip length used to render the ticking timecode (3:42).
const TOTAL_SECONDS = 222;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Deterministic pseudo-random so server and client render the same particles.
const seed = (i: number, n: number) => Math.abs(Math.sin((i + 1) * n));
const r2 = (n: number) => Math.round(n * 100) / 100;

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: r2(5 + seed(i, 12.9898) * 90),
  y: r2(8 + seed(i, 78.233) * 82),
  size: r2(1 + seed(i, 37.719) * 2.4),
  opacity: r2(0.16 + seed(i, 4.117) * 0.4),
  drift: r2(-6 - seed(i, 51.2) * 12),
  duration: r2(3.4 + seed(i, 9.71) * 4),
  delay: r2(seed(i, 22.4) * 4),
}));

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 14 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/**
 * Pure CSS-art "footage": layered gradients, a slow aurora sweep, drifting
 * orbs and floating motes. `progress` (0..1) nudges a soft playhead of light
 * across the frame so the player reads as if it were actually running.
 */
function VideoScene({ progress = 0 }: { progress?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #090914 0%, #14122a 46%, #0a0f26 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -inset-1/3"
        style={{
          background:
            "conic-gradient(from 120deg at 50% 42%, rgba(124,108,255,0) 0deg, rgba(124,108,255,0.28) 90deg, rgba(91,140,255,0.22) 180deg, rgba(124,108,255,0) 300deg)",
          filter: "blur(46px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute h-40 w-40 rounded-full"
        style={{
          left: "16%",
          top: "20%",
          background: "rgba(124,108,255,0.5)",
          filter: "blur(48px)",
        }}
        animate={{ x: [0, 22, 0], y: [0, 14, 0], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute h-44 w-44 rounded-full"
        style={{
          right: "12%",
          bottom: "14%",
          background: "rgba(91,140,255,0.45)",
          filter: "blur(52px)",
        }}
        animate={{ x: [0, -18, 0], y: [0, -12, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, p.drift, 0],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* horizon glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 128%, rgba(124,108,255,0.34), transparent 62%)",
        }}
      />

      {/* progress playhead of light, only while a clip is running */}
      {progress > 0 && (
        <div
          className="absolute inset-y-0 w-28 -translate-x-1/2"
          style={{
            left: `${Math.round(progress * 100)}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
          }}
        />
      )}

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 32%, transparent 52%, rgba(0,0,0,0.62) 100%)",
        }}
      />
    </div>
  );
}

/** Circular glass play button with two expanding pulse rings. */
function PlayBadge({ size = 66 }: { size?: number }) {
  const icon = Math.round(size * 0.34);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-full border border-white/40"
          animate={{ scale: [1, 1.65], opacity: [0.55, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 1.2,
          }}
        />
      ))}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-brand/40 blur-md"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative flex h-full w-full items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_-8px_rgba(0,0,0,0.7)]">
        <Play size={icon} className="ml-0.5 fill-white text-white" />
      </span>
    </div>
  );
}

type HeroVideoDialogProps = {
  title?: string;
  channel?: string;
  duration?: string;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/**
 * A video thumbnail rendered entirely in CSS (no real media) that scales open
 * into a centered mock player over a frosted backdrop. Supply `open` /
 * `onOpenChange` to drive it, or leave them off for a self-managing trigger.
 * The dialog paints itself `absolute inset-0`, so its nearest positioned
 * ancestor should be `relative` (the demo container handles this).
 */
export function HeroVideoDialog({
  title = "How we ship 60fps interfaces",
  channel = "Lumenite Engineering",
  duration = "3:42",
  open,
  onOpenChange,
  className,
}: HeroVideoDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  const [progress, setProgress] = useState(0.03);
  const [playing, setPlaying] = useState(true);

  // Fresh playback each time the dialog opens.
  useEffect(() => {
    if (isOpen) {
      setProgress(0.03);
      setPlaying(true);
    }
  }, [isOpen]);

  // Advance the mock scrubber while open and playing; loop at the end.
  useEffect(() => {
    if (!isOpen || !playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + 0.006;
        return next >= 1 ? 0 : next;
      });
    }, 60);
    return () => window.clearInterval(id);
  }, [isOpen, playing]);

  // Escape to close.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  const playedPct = `${Math.round(progress * 100)}%`;
  const bufferedPct = `${Math.min(100, Math.round(progress * 100) + 16)}%`;
  const currentTime = Math.round(TOTAL_SECONDS * progress);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play video: ${title}`}
        whileHover={{ scale: 1.012 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className={cn(
          "group relative block aspect-video w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/10 bg-black text-left shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]",
          className,
        )}
      >
        <VideoScene />

        {/* thin bright top edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />

        {/* center play affordance */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="transition-transform duration-500 ease-out group-hover:scale-105"
            initial={false}
          >
            <PlayBadge size={66} />
          </motion.div>
        </div>

        {/* caption + duration chip */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 82%)",
          }}
        >
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-white">
              {title}
            </p>
            <p className="mt-0.5 text-[11px] text-white/55">{channel}</p>
          </div>
          <span className="shrink-0 rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-white/85 ring-1 ring-white/10 backdrop-blur-sm">
            {duration}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center p-5"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.button
              type="button"
              aria-label="Close video"
              onClick={() => setOpen(false)}
              variants={backdropVariants}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-xl"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              variants={panelVariants}
              transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
              className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/12 bg-[#0b0b12] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-white/15" />

              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <VideoScene progress={progress} />

                {/* top scrim: title + close */}
                <div
                  className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3.5"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0) 100%)",
                  }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-white">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/55">{channel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close video"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* paused overlay */}
                <AnimatePresence>
                  {!playing && (
                    <motion.button
                      type="button"
                      onClick={() => setPlaying(true)}
                      aria-label="Resume"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="absolute inset-0 z-10 flex items-center justify-center"
                    >
                      <PlayBadge size={62} />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* bottom controls */}
                <div
                  className="absolute inset-x-0 bottom-0 z-10 px-3.5 pb-3 pt-8"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0) 100%)",
                  }}
                >
                  {/* scrubber */}
                  <div className="relative h-1 w-full rounded-full bg-white/20">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-white/25"
                      style={{ width: bufferedPct }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-glow"
                      style={{ width: playedPct }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(124,108,255,0.35)]"
                      style={{ left: playedPct }}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center gap-3 text-white">
                    <button
                      type="button"
                      onClick={() => setPlaying((p) => !p)}
                      aria-label={playing ? "Pause" : "Play"}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {playing ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4 fill-current" />
                      )}
                    </button>

                    <div className="flex items-center gap-1.5 text-white/70">
                      <Volume2 className="h-4 w-4" />
                      <span className="hidden h-1 w-12 rounded-full bg-white/20 sm:block">
                        <span className="block h-full w-2/3 rounded-full bg-white/70" />
                      </span>
                    </div>

                    <span className="font-mono text-[11px] tabular-nums text-white/70">
                      {formatTime(currentTime)} / {duration}
                    </span>

                    <div className="flex-1" />

                    <button
                      type="button"
                      aria-label="Settings"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Fullscreen"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(true);

  // Gentle self-playing loop for the static preview. Any real interaction
  // hands control back to the viewer.
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setOpen((o) => !o), open ? 4400 : 2600);
    return () => window.clearTimeout(t);
  }, [auto, open]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, rgba(91,140,255,0.08), transparent 60%)",
        }}
      />
      <HeroVideoDialog
        open={open}
        onOpenChange={(next) => {
          setAuto(false);
          setOpen(next);
        }}
        title="How we ship 60fps interfaces"
        channel="Lumenite Engineering"
        duration="3:42"
      />
    </div>
  );
}
