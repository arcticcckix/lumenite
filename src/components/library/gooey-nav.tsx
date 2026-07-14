"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type GooeyNavItem = { id: string; label: string };

type Pos = { x: number; width: number };

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Fast spring rides the leading edge, slow spring lags behind so the two
// blobs overlap mid-transit and the SVG goo filter merges them into a
// stretching liquid bridge.
const LEAD_SPRING = { type: "spring", stiffness: 320, damping: 30, mass: 1 } as const;
const TRAIL_SPRING = { type: "spring", stiffness: 120, damping: 17, mass: 1.1 } as const;

export function GooeyNav({
  items,
  autoAdvance = true,
  interval = 2200,
  onActiveChange,
  className,
}: {
  items: GooeyNavItem[];
  autoAdvance?: boolean;
  interval?: number;
  onActiveChange?: (index: number) => void;
  className?: string;
}) {
  const rawId = useId();
  const gooId = `goo-${rawId.replace(/:/g, "")}`;

  const gooRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [positions, setPositions] = useState<Pos[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const base = gooRef.current;
    if (!base) return;
    const b = base.getBoundingClientRect();
    const next: Pos[] = itemRefs.current.map((el) => {
      if (!el) return { x: 0, width: 0 };
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left - b.left), width: Math.round(r.width) };
    });
    setPositions(next);
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, items]);

  useEffect(() => {
    measure();
    const base = gooRef.current;
    if (!base) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(base);
    window.addEventListener("resize", measure);
    let cancelled = false;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!autoAdvance || paused || items.length <= 1) return;
    const t = window.setInterval(() => {
      setActive((a) => (a + 1) % items.length);
    }, interval);
    return () => window.clearInterval(t);
  }, [autoAdvance, paused, interval, items.length]);

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  const pos = positions[active] ?? { x: 0, width: 0 };

  return (
    <div className={cn("relative", className)}>
      {/* Hidden goo filter. High alpha gain on the blurred layer snaps the
          soft edges back into a crisp metaball silhouette. */}
      <svg
        aria-hidden
        width="0"
        height="0"
        className="absolute"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id={gooId} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
            />
          </filter>
        </defs>
      </svg>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative isolate inline-flex rounded-full border border-white/10 bg-panel/90 p-1.5 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      >
        {/* Liquid layer. Provides the trailing tail that merges into the pill. */}
        <div
          ref={gooRef}
          className="pointer-events-none absolute inset-1.5 overflow-hidden rounded-full"
          style={{ filter: `url(#${gooId})` }}
        >
          {ready && (
            <>
              <motion.div
                className="absolute top-0 h-full rounded-full"
                initial={false}
                animate={{ x: pos.x, width: pos.width }}
                transition={TRAIL_SPRING}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,108,255,0.95), rgba(91,140,255,0.95))",
                }}
              />
              <motion.div
                className="absolute top-0 h-full rounded-full"
                initial={false}
                animate={{ x: pos.x, width: pos.width }}
                transition={LEAD_SPRING}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,108,255,0.95), rgba(91,140,255,0.95))",
                }}
              />
            </>
          )}
        </div>

        {/* Crisp active pill. Rides the leading edge, carries the highlight and glow. */}
        <div className="pointer-events-none absolute inset-1.5">
          {ready && (
            <motion.div
              className="absolute top-0 h-full rounded-full"
              initial={false}
              animate={{ x: pos.x, width: pos.width }}
              transition={LEAD_SPRING}
              style={{
                background:
                  "linear-gradient(135deg, #7c6cff 0%, #5b8cff 100%)",
                borderTop: "1px solid rgba(255,255,255,0.35)",
                boxShadow:
                  "0 0 0 1px rgba(124,108,255,0.35), 0 8px 24px -6px rgba(124,108,255,0.6), 0 2px 8px -2px rgba(91,140,255,0.5)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-60"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.22), transparent 55%)",
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Labels */}
        <ul className="relative z-10 flex items-stretch">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                    isActive
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function Demo() {
  const items: GooeyNavItem[] = [
    { id: "overview", label: "Overview" },
    { id: "analytics", label: "Analytics" },
    { id: "automations", label: "Automations" },
    { id: "members", label: "Members" },
    { id: "billing", label: "Billing" },
  ];

  const copy: Record<string, { title: string; body: string }> = {
    overview: {
      title: "Your workspace at a glance",
      body: "Signals, activity, and health across every project in one calm view.",
    },
    analytics: {
      title: "Metrics that actually move",
      body: "Track adoption, retention, and revenue with charts that stay current.",
    },
    automations: {
      title: "Work that runs itself",
      body: "Chain triggers and actions so routine handoffs happen without a nudge.",
    },
    members: {
      title: "Everyone in the loop",
      body: "Invite teammates, set roles, and keep permissions tidy as you scale.",
    },
    billing: {
      title: "Clarity on every charge",
      body: "Plans, invoices, and usage laid out plainly, no surprises at renewal.",
    },
  };

  const [active, setActive] = useState(0);
  const handleActive = useCallback((i: number) => setActive(i), []);
  const current = items[active];
  const content = copy[current.id];

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 overflow-hidden bg-void px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(620px circle at 50% 26%, rgba(124,108,255,0.14), transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,108,255,0.4), transparent)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">
          Live navigation
        </p>

        <GooeyNav items={items} onActiveChange={handleActive} />

        <div className="relative h-24 w-full max-w-md text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                {content.title}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                {content.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
