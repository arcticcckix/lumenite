"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card {
  title: string;
  sub: string;
  gradient: string;
}

function ProductCard({ c }: { c: Card }) {
  return (
    <div
      className="relative h-28 w-56 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]"
      style={{ backgroundImage: c.gradient }}
    >
      {/* top sheen + bottom scrim for legibility */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      {/* tiny window chrome, sells the "product" idea */}
      <div className="absolute left-3 top-3 flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
      </div>
      <div className="absolute inset-x-3 bottom-3">
        <div className="text-sm font-semibold text-white">{c.title}</div>
        <div className="text-[11px] text-white/70">{c.sub}</div>
      </div>
    </div>
  );
}

/** One row that drifts continuously; content is duplicated for a seamless loop. */
function MarqueeRow({
  cards,
  reverse = false,
  duration = 30,
}: {
  cards: Card[];
  reverse?: boolean;
  duration?: number;
}) {
  const doubled = [...cards, ...cards];
  return (
    <div className="flex w-max">
      <motion.div
        className="flex gap-4 pr-4"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((c, i) => (
          <ProductCard key={i} c={c} />
        ))}
      </motion.div>
    </div>
  );
}

export function HeroParallaxGrid({ className }: { className?: string }) {
  const rowA: Card[] = [
    { title: "Aurora", sub: "Design system", gradient: "linear-gradient(135deg,#7c6cff,#5b8cff)" },
    { title: "Nimbus", sub: "Analytics", gradient: "linear-gradient(135deg,#5b8cff,#22d3ee)" },
    { title: "Pulse", sub: "Realtime sync", gradient: "linear-gradient(135deg,#7c6cff,#d946ef)" },
    { title: "Halo", sub: "Auth", gradient: "linear-gradient(135deg,#22d3ee,#7c6cff)" },
    { title: "Vault", sub: "Storage", gradient: "linear-gradient(135deg,#6366f1,#22d3ee)" },
  ];
  const rowB: Card[] = [
    { title: "Vertex", sub: "Edge network", gradient: "linear-gradient(135deg,#f59e0b,#7c6cff)" },
    { title: "Prism", sub: "Billing", gradient: "linear-gradient(135deg,#5b8cff,#7c6cff)" },
    { title: "Flux", sub: "Workflows", gradient: "linear-gradient(135deg,#d946ef,#5b8cff)" },
    { title: "Orbit", sub: "Scheduling", gradient: "linear-gradient(135deg,#7c6cff,#22d3ee)" },
    { title: "Relay", sub: "Messaging", gradient: "linear-gradient(135deg,#22d3ee,#6366f1)" },
  ];
  const rowC: Card[] = [
    { title: "Atlas", sub: "Search", gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)" },
    { title: "Beacon", sub: "Monitoring", gradient: "linear-gradient(135deg,#5b8cff,#8b5cf6)" },
    { title: "Cinder", sub: "Logs", gradient: "linear-gradient(135deg,#f97316,#d946ef)" },
    { title: "Drift", sub: "CDN", gradient: "linear-gradient(135deg,#22d3ee,#5b8cff)" },
    { title: "Ember", sub: "Queues", gradient: "linear-gradient(135deg,#7c6cff,#f59e0b)" },
  ];

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void",
        className
      )}
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-56 w-[40rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-8 px-6 text-center"
      >
        <h2 className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
          Everything you ship, in one place
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          A living wall of products, drifting in 3D.
        </p>
      </motion.div>

      {/* the tilted, auto-drifting grid */}
      <div className="relative w-full [perspective:1200px]">
        <motion.div
          initial={{ opacity: 0, rotateX: 32 }}
          animate={{ opacity: 1, rotateX: 22 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex origin-top flex-col gap-4"
          style={{ transform: "rotateZ(-5deg) scale(1.08)" }}
        >
          <MarqueeRow cards={rowA} duration={34} />
          <MarqueeRow cards={rowB} reverse duration={28} />
          <MarqueeRow cards={rowC} duration={38} />
        </motion.div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent" />
      </div>
    </div>
  );
}

export default function Demo() {
  return <HeroParallaxGrid />;
}
