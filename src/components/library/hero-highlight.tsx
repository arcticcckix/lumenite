"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useAnimationFrame,
  type Transition,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Highlight, wraps a phrase in a gradient pill that "draws in" on mount
 * (left → right) and keeps a slow, living color flow at rest.
 */
export function Highlight({
  children,
  className,
  delay = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className="relative inline-block whitespace-nowrap px-1">
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-lg"
        style={{
          background:
            "linear-gradient(90deg, #7c6cff 0%, #5b8cff 45%, #9d7bff 75%, #7c6cff 100%)",
          backgroundSize: "220% 100%",
        }}
        initial={{ clipPath: "inset(0 100% 0 0 round 8px)", backgroundPosition: "0% 50%" }}
        animate={{
          clipPath: "inset(0 0% 0 0 round 8px)",
          backgroundPosition: ["0% 50%", "220% 50%"],
        }}
        transition={{
          clipPath: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
          backgroundPosition: {
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />
      <span
        className={cn(
          "relative font-semibold text-white [text-shadow:0_1px_8px_rgba(11,11,20,0.45)]",
          className
        )}
      >
        {children}
      </span>
    </span>
  );
}

const idle = (t: number, freq: number, phase: number) =>
  Math.sin(t * freq + phase);

/**
 * HeroHighlight, a dot-grid canvas with a soft radial spotlight that follows
 * the cursor. When idle, the spotlight drifts on its own so a static preview
 * always looks alive. Brand-tinted dots light up under the light.
 */
export function HeroHighlight({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  // Position in percentages (0–100), deterministic initial center.
  const targetX = useMotionValue(50);
  const targetY = useMotionValue(42);

  const spring: Transition = { stiffness: 140, damping: 26, mass: 0.6 };
  const x = useSpring(targetX, spring);
  const y = useSpring(targetY, spring);

  // Idle drift: a slow Lissajous path so the light breathes when untouched.
  useAnimationFrame((t) => {
    if (hovering) return;
    const nx = 50 + idle(t, 0.00034, 0) * 26;
    const ny = 42 + idle(t, 0.00052, 1.3) * 16;
    targetX.set(Math.round(nx * 100) / 100);
    targetY.set(Math.round(ny * 100) / 100);
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    targetX.set(Math.round(Math.min(100, Math.max(0, px)) * 100) / 100);
    targetY.set(Math.round(Math.min(100, Math.max(0, py)) * 100) / 100);
  }

  const dotMask = useMotionTemplate`radial-gradient(220px circle at ${x}% ${y}%, black 0%, black 25%, transparent 70%)`;
  const glow = useMotionTemplate`radial-gradient(520px circle at ${x}% ${y}%, rgba(124,108,255,0.14), rgba(91,140,255,0.06) 40%, transparent 72%)`;

  const dotBg =
    "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)";

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "group relative flex h-full w-full items-center justify-center overflow-hidden bg-void",
        containerClassName
      )}
    >
      {/* base dim dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{ backgroundImage: dotBg, backgroundSize: "22px 22px" }}
      />
      {/* brand-tinted dots, revealed only under the moving spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(#a99dff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          WebkitMaskImage: dotMask,
          maskImage: dotMask,
        }}
      />
      {/* soft color glow following the light */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
      />
      {/* top vignette for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, rgba(124,108,255,0.10), transparent 55%)",
        }}
      />
      {/* edge fade so the grid dissolves into the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_75%_at_center,transparent_30%,black_100%)]"
        style={{ background: "var(--color-void)" }}
      />

      <div className={cn("relative z-10 w-full", className)}>{children}</div>
    </div>
  );
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay } as Transition,
});

export default function Demo() {
  const avatars = ["#7c6cff", "#5b8cff", "#9d7bff", "#4fd1c5"];

  return (
    <HeroHighlight>
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
        <motion.span
          {...rise(0)}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-brand-soft backdrop-blur-sm"
        >
          <Sparkles className="h-3 w-3" />
          Lumenite UI · v2.0
        </motion.span>

        <motion.h1
          {...rise(0.08)}
          className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-[2.6rem]"
        >
          Ship interfaces that{" "}
          <Highlight delay={0.55}>feel alive</Highlight>,
          <br className="hidden sm:block" /> straight from copy &amp; paste.
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400"
        >
          A component library for teams obsessed with the details. Move your
          cursor, the light follows you.
        </motion.p>

        <motion.div
          {...rise(0.24)}
          className="mt-7 flex items-center gap-3"
        >
          <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-95">
            Get started
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07]">
            Browse components
          </button>
        </motion.div>

        <motion.div
          {...rise(0.32)}
          className="mt-6 flex items-center gap-3 text-xs text-zinc-500"
        >
          <div className="flex -space-x-2">
            {avatars.map((c, i) => (
              <span
                key={i}
                className="h-6 w-6 rounded-full border-2 border-void"
                style={{
                  background: `linear-gradient(135deg, ${c}, rgba(255,255,255,0.15))`,
                }}
              />
            ))}
          </div>
          Trusted by <span className="text-zinc-300">4,000+</span> product teams
        </motion.div>
      </div>
    </HeroHighlight>
  );
}
