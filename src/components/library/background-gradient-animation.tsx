"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Blob = {
  /** "r,g,b" triplet used for the radial gradient */
  color: string;
  /** diameter as a percentage of the container width */
  size: number;
  /** base center position, percentage of container */
  top: number;
  left: number;
  duration: number;
  delay: number;
  /** drift keyframes, expressed as a fraction of the blob's own size */
  x: string[];
  y: string[];
  scale: number[];
};

const BLOBS: Blob[] = [
  {
    color: "124,108,255", // brand violet
    size: 68,
    top: 34,
    left: 30,
    duration: 18,
    delay: 0,
    x: ["-14%", "18%", "-6%", "-14%"],
    y: ["-10%", "12%", "-16%", "-10%"],
    scale: [1, 1.14, 0.94, 1],
  },
  {
    color: "91,140,255", // glow blue
    size: 60,
    top: 58,
    left: 66,
    duration: 22,
    delay: 1.4,
    x: ["10%", "-16%", "8%", "10%"],
    y: ["8%", "-12%", "14%", "8%"],
    scale: [1, 0.92, 1.12, 1],
  },
  {
    color: "34,211,238", // cyan
    size: 46,
    top: 30,
    left: 72,
    duration: 26,
    delay: 0.7,
    x: ["6%", "-12%", "16%", "6%"],
    y: ["-8%", "16%", "-4%", "-8%"],
    scale: [1, 1.1, 0.96, 1],
  },
  {
    color: "217,70,239", // magenta
    size: 52,
    top: 64,
    left: 26,
    duration: 24,
    delay: 2.1,
    x: ["-8%", "14%", "-16%", "-8%"],
    y: ["12%", "-14%", "6%", "12%"],
    scale: [1, 0.95, 1.12, 1],
  },
];

export function BackgroundGradientAnimation({
  children,
  className,
  interactive = true,
  /** diameter of the cursor blob, percentage of container width */
  interactiveSize = 42,
}: {
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  interactiveSize?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const gooId = `goo-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 18, mass: 1.1 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 18, mass: 1.1 });

  // Rest the cursor blob in the center before any interaction.
  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const sizePx = (interactiveSize / 100) * rect.width;
    mouseX.set(Math.round(rect.width / 2 - sizePx / 2));
    mouseY.set(Math.round(rect.height / 2 - sizePx / 2));
  }, [interactiveSize, mouseX, mouseY]);

  function anchorFor(clientX: number, clientY: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const sizePx = (interactiveSize / 100) * rect.width;
    mouseX.set(Math.round(clientX - rect.left - sizePx / 2));
    mouseY.set(Math.round(clientY - rect.top - sizePx / 2));
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    anchorFor(e.clientX, e.clientY);
  }

  function onMouseLeave() {
    if (!interactive) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const sizePx = (interactiveSize / 100) * rect.width;
    mouseX.set(Math.round(rect.width / 2 - sizePx / 2));
    mouseY.set(Math.round(rect.height / 2 - sizePx / 2));
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative isolate h-full w-full overflow-hidden rounded-[inherit] bg-void",
        className
      )}
    >
      {/* Gooey metaball filter, kept out of layout flow */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id={gooId} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Blob field: goo-merged, softly blurred, additive on near-black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ filter: `url(#${gooId}) blur(26px)` }}
      >
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              top: `${b.top}%`,
              left: `${b.left}%`,
              width: `${b.size}%`,
              aspectRatio: "1 / 1",
            }}
          >
            <motion.div
              className="h-full w-full rounded-full mix-blend-screen"
              style={{
                background: `radial-gradient(circle at center, rgba(${b.color},0.85) 0%, rgba(${b.color},0.35) 34%, rgba(${b.color},0) 66%)`,
                willChange: "transform",
              }}
              animate={{ x: b.x, y: b.y, scale: b.scale }}
              transition={{
                duration: b.duration,
                delay: b.delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.34, 0.68, 1],
              }}
            />
          </div>
        ))}

        {/* Cursor-following blob with a gentle idle orbit so it reads as alive at rest */}
        {interactive && (
          <motion.div
            className="absolute left-0 top-0"
            style={{
              x: springX,
              y: springY,
              width: `${interactiveSize}%`,
              aspectRatio: "1 / 1",
            }}
          >
            <motion.div
              className="h-full w-full rounded-full mix-blend-screen"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(168,158,255,0.72) 0%, rgba(124,108,255,0.28) 36%, rgba(124,108,255,0) 68%)",
                willChange: "transform",
              }}
              animate={{ x: ["-7%", "7%", "-7%"], y: ["6%", "-8%", "6%"] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Fine top edge + inner vignette for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_120px_rgba(5,5,8,0.55)]" />

      {/* Overlaid content */}
      {children && (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Demo() {
  return (
    <BackgroundGradientAnimation>
      <span className="mb-5 text-[11px] font-medium uppercase tracking-[0.32em] text-white/45">
        Lumenite Studio
      </span>
      <h2 className="max-w-xl bg-gradient-to-b from-white to-white/55 bg-clip-text text-4xl font-semibold leading-[1.05] tracking-tight text-transparent sm:text-5xl">
        Light that moves
        <br />
        with you
      </h2>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
        A living gradient backdrop for heroes, launch pages, and dashboards.
        Soft, gooey, and always in motion.
      </p>
      <button
        type="button"
        className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.08]"
      >
        Explore components
        <ArrowUpRight className="h-4 w-4 text-white/70 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </BackgroundGradientAnimation>
  );
}
