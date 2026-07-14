"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  id: string;
  index: string;
  kicker: string;
  title: string;
  description: string;
  /** Full CSS `background` value for the slide (gradients / CSS art, no images). */
  background: string;
  /** Accent hex used for the slide's glow blob and its active dot. */
  accent: string;
}

export function Carousel({
  slides,
  interval = 4200,
  className,
}: {
  slides: CarouselSlide[];
  interval?: number;
  className?: string;
}) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (i: number) => setActive(((i % count) + count) % count);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  // Auto-advance. The timer resets whenever `active` changes (manual nav
  // included) or when hover pauses the loop, so the progress bar and the
  // advance stay perfectly in sync.
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % count);
    }, interval);
    return () => clearTimeout(t);
  }, [active, paused, interval, count]);

  return (
    <div className={cn("w-full max-w-xl select-none", className)}>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative h-[300px] w-full overflow-hidden rounded-[26px] border border-white/10 bg-panel"
        style={{ perspective: 1400 }}
      >
        {/* Auto-advance progress line */}
        {!paused && count > 1 && (
          <motion.div
            key={active}
            className="absolute left-0 top-0 z-40 h-[2px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #7c6cff 0%, #5b8cff 100%)",
              boxShadow: "0 0 12px rgba(124,108,255,0.7)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: interval / 1000, ease: "linear" }}
          />
        )}

        {/* Slides (coverflow) */}
        {slides.map((slide, i) => {
          let offset = i - active;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const abs = Math.abs(offset);
          const isActive = offset === 0;
          const near = abs <= 1;

          const scale = isActive ? 1 : abs === 1 ? 0.82 : 0.7;
          const opacity = isActive ? 1 : abs === 1 ? 0.5 : 0;
          const blur = isActive ? 0 : abs === 1 ? 2 : 4;
          const brightness = isActive ? 1 : abs === 1 ? 0.62 : 0.5;
          const z = 30 - abs * 10;
          const xPercent = -50 + offset * 58;

          return (
            <motion.div
              key={slide.id}
              onClick={() => {
                if (!isActive && near) goTo(i);
              }}
              className={cn(
                "absolute left-1/2 top-1/2 h-[86%] w-[70%] overflow-hidden rounded-[20px] border border-white/10",
                isActive ? "cursor-default" : near ? "cursor-pointer" : "pointer-events-none"
              )}
              style={{ background: slide.background, zIndex: z }}
              initial={false}
              animate={{
                x: `${xPercent}%`,
                y: "-50%",
                scale,
                opacity,
                filter: `blur(${blur}px) brightness(${brightness})`,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 30, mass: 0.9 }}
            >
              {/* Fine grid texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                  maskImage:
                    "radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 78%)",
                }}
              />

              {/* Drifting accent blob */}
              <motion.div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ background: slide.accent, opacity: 0.5 }}
                animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Top edge highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-end p-7">
                <span className="font-mono text-[11px] tracking-[0.32em] text-white/45">
                  {slide.index}
                </span>
                <span className="mt-4 inline-flex w-fit items-center rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/70">
                  {slide.kicker}
                </span>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-white">
                  {slide.title}
                </h3>
                <p className="mt-2 max-w-[92%] text-[13px] leading-relaxed text-white/60">
                  {slide.description}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Prev / Next */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-50 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-black/50 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-50 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-black/50 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </button>

        {/* Counter */}
        <div className="pointer-events-none absolute bottom-4 right-5 z-50 font-mono text-[11px] tracking-widest text-white/40">
          {String(active + 1).padStart(2, "0")}
          <span className="text-white/20"> / {String(count).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group flex h-4 items-center"
            >
              <motion.span
                className="block h-1.5 rounded-full"
                animate={{
                  width: isActive ? 26 : 6,
                  backgroundColor: isActive ? slide.accent : "rgba(255,255,255,0.22)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                style={{
                  boxShadow: isActive ? `0 0 12px ${slide.accent}` : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DEMO_SLIDES: CarouselSlide[] = [
  {
    id: "render",
    index: "01",
    kicker: "Rendering",
    title: "Composited on the GPU",
    description:
      "Every frame is layered off the main thread, so scroll and motion stay locked to your display's native refresh.",
    background:
      "radial-gradient(130% 120% at 15% 12%, rgba(124,108,255,0.5), transparent 55%), radial-gradient(120% 120% at 90% 88%, rgba(91,140,255,0.28), transparent 60%), linear-gradient(160deg, #14121f 0%, #0a0910 100%)",
    accent: "#7c6cff",
  },
  {
    id: "edge",
    index: "02",
    kicker: "Delivery",
    title: "Served from the edge",
    description:
      "Static output resolves from the region closest to each visitor, keeping first paint under forty milliseconds.",
    background:
      "radial-gradient(130% 120% at 85% 18%, rgba(91,140,255,0.5), transparent 55%), radial-gradient(120% 120% at 8% 92%, rgba(80,120,220,0.24), transparent 60%), linear-gradient(160deg, #0f1420 0%, #080b12 100%)",
    accent: "#5b8cff",
  },
  {
    id: "theming",
    index: "03",
    kicker: "Theming",
    title: "Tokens, end to end",
    description:
      "One config drives color, type, and spacing across every component, with no drift between light and dark.",
    background:
      "radial-gradient(130% 120% at 18% 88%, rgba(79,209,197,0.45), transparent 55%), radial-gradient(120% 120% at 88% 14%, rgba(70,150,200,0.24), transparent 60%), linear-gradient(160deg, #0b1618 0%, #070d0f 100%)",
    accent: "#4fd1c5",
  },
  {
    id: "motion",
    index: "04",
    kicker: "Motion",
    title: "Physics, not keyframes",
    description:
      "Spring curves are tuned per interaction, so transitions feel weighted instead of mechanically timed.",
    background:
      "radial-gradient(130% 120% at 82% 82%, rgba(176,108,255,0.48), transparent 55%), radial-gradient(120% 120% at 14% 18%, rgba(124,108,255,0.24), transparent 60%), linear-gradient(160deg, #16101f 0%, #0a0710 100%)",
    accent: "#b06cff",
  },
  {
    id: "deploy",
    index: "05",
    kicker: "Deploy",
    title: "Ship straight from main",
    description:
      "Merge a pull request and the build promotes to production on its own, usually inside of a minute.",
    background:
      "radial-gradient(130% 120% at 50% 8%, rgba(108,155,255,0.46), transparent 55%), radial-gradient(120% 120% at 50% 100%, rgba(124,108,255,0.22), transparent 60%), linear-gradient(160deg, #0e1020 0%, #080910 100%)",
    accent: "#6c9bff",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Carousel slides={DEMO_SLIDES} />
    </div>
  );
}
