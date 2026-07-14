"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-full bg-white px-7 py-3 text-sm font-semibold text-void shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-colors hover:bg-white/90",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

function Orb({
  size,
  color,
  style,
  duration,
}: {
  size: number;
  color: string;
  style: React.CSSProperties;
  duration: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        ...style,
      }}
      animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function CtaBanner({
  eyebrow = "Get started",
  title,
  description,
  ctaLabel = "Start building",
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  className?: string;
}) {
  const grain = useTransform(() => 0);
  void grain;

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-line bg-[linear-gradient(120deg,#221a4d_0%,#3a2a7c_45%,#7c6cff_100%)] px-8 py-14 text-center sm:px-16",
        className
      )}
    >
      <Orb size={220} color="rgba(124,108,255,0.5)" style={{ top: -60, left: -40 }} duration={9} />
      <Orb size={180} color="rgba(91,140,255,0.45)" style={{ bottom: -50, right: -20 }} duration={11} />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay" aria-hidden>
        <filter id="cta-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cta-grain)" />
      </svg>

      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center">
        <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
          {eyebrow}
        </span>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
          {description}
        </p>
        <MagneticButton className="mt-8">{ctaLabel}</MagneticButton>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <CtaBanner
        className="w-full max-w-xl"
        eyebrow="Lumenite UI"
        title="Ship your next launch faster"
        description="Drop in production-grade animated components and skip the weeks of polish work."
        ctaLabel="Explore components"
      />
    </div>
  );
}
