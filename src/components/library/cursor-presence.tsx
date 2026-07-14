"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Pt = readonly [number, number];

interface CursorEvent {
  at: number;
  kind: "click" | "bubble";
}

interface CursorSpec {
  name: string;
  role: string;
  color: string;
  duration: number;
  phase: number;
  message: string;
  path: readonly Pt[];
  events: readonly CursorEvent[];
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

// Deterministic, art-directed loops. Fractions of the surface (0..1).
const CURSORS: readonly CursorSpec[] = [
  {
    name: "Maya",
    role: "Design",
    color: "#7c6cff",
    duration: 17,
    phase: 0,
    message: "tightening the header grid",
    path: [
      [0.19, 0.31],
      [0.31, 0.23],
      [0.45, 0.34],
      [0.37, 0.53],
      [0.22, 0.58],
      [0.14, 0.43],
    ],
    events: [
      { at: 0.14, kind: "bubble" },
      { at: 0.58, kind: "click" },
    ],
  },
  {
    name: "Devon",
    role: "Eng",
    color: "#5b8cff",
    duration: 21,
    phase: 0.35,
    message: "this gradient is perfect",
    path: [
      [0.7, 0.29],
      [0.82, 0.4],
      [0.79, 0.59],
      [0.66, 0.65],
      [0.58, 0.5],
      [0.64, 0.35],
    ],
    events: [
      { at: 0.3, kind: "click" },
      { at: 0.72, kind: "bubble" },
    ],
  },
  {
    name: "Priya",
    role: "PM",
    color: "#22c9a0",
    duration: 19,
    phase: 0.6,
    message: "shipping the build tonight",
    path: [
      [0.41, 0.71],
      [0.54, 0.79],
      [0.67, 0.73],
      [0.6, 0.59],
      [0.46, 0.61],
    ],
    events: [
      { at: 0.22, kind: "click" },
      { at: 0.83, kind: "bubble" },
    ],
  },
  {
    name: "Kai",
    role: "Brand",
    color: "#f45d90",
    duration: 15,
    phase: 0.15,
    message: "left a note on the CTA",
    path: [
      [0.3, 0.45],
      [0.52, 0.41],
      [0.71, 0.5],
      [0.59, 0.68],
      [0.36, 0.65],
      [0.24, 0.52],
    ],
    events: [
      { at: 0.1, kind: "bubble" },
      { at: 0.5, kind: "click" },
      { at: 0.88, kind: "click" },
    ],
  },
];

const ARROW =
  "M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.900312L14.9877 6.98956C15.8074 7.31651 15.7383 8.49329 14.8836 8.72269L9.85908 9.24973L8.31593 15.4901C8.09106 16.3705 6.85115 16.351 6.65913 15.4634L0.928548 2.18278Z";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function catmull(a: number, b: number, c: number, d: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * b +
      (-a + c) * t +
      (2 * a - 5 * b + 4 * c - d) * t2 +
      (-a + 3 * b - 3 * c + d) * t3)
  );
}

export function CursorPresence({ className }: { className?: string }) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const groupRefs = useRef<Array<HTMLDivElement | null>>([]);
  const posRef = useRef<Array<{ x: number; y: number }>>(
    CURSORS.map(() => ({ x: 0, y: 0 }))
  );
  const lastPRef = useRef<number[]>(CURSORS.map(() => -1));
  const idRef = useRef(0);
  const timeoutsRef = useRef<number[]>([]);

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pressed, setPressed] = useState<boolean[]>(() =>
    CURSORS.map(() => false)
  );
  const [bubbles, setBubbles] = useState<(string | null)[]>(() =>
    CURSORS.map(() => null)
  );

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;

    const measure = () => {
      sizeRef.current = { w: el.offsetWidth, h: el.offsetHeight };
    };
    measure();

    const media =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const reduced = media?.matches ?? false;

    function fireEvent(i: number, spec: CursorSpec, ev: CursorEvent) {
      if (ev.kind === "click") {
        const pos = posRef.current[i];
        const id = idRef.current++;
        setRipples((prev) => [
          ...prev,
          { id, x: pos.x, y: pos.y, color: spec.color },
        ]);
        timeoutsRef.current.push(
          window.setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
          }, 720)
        );
        setPressed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        timeoutsRef.current.push(
          window.setTimeout(() => {
            setPressed((prev) => {
              const next = [...prev];
              next[i] = false;
              return next;
            });
          }, 150)
        );
      } else {
        setBubbles((prev) => {
          const next = [...prev];
          next[i] = spec.message;
          return next;
        });
        timeoutsRef.current.push(
          window.setTimeout(() => {
            setBubbles((prev) => {
              const next = [...prev];
              next[i] = null;
              return next;
            });
          }, 2600)
        );
      }
    }

    function detectEvents(i: number, spec: CursorSpec, p: number) {
      const last = lastPRef.current[i];
      lastPRef.current[i] = p;
      if (last < 0) return;
      for (const ev of spec.events) {
        const crossed =
          last <= p ? ev.at > last && ev.at <= p : ev.at > last || ev.at <= p;
        if (crossed) fireEvent(i, spec, ev);
      }
    }

    const compute = (elapsed: number, runEvents: boolean) => {
      const { w, h } = sizeRef.current;
      if (w <= 0 || h <= 0) return;
      for (let i = 0; i < CURSORS.length; i++) {
        const spec = CURSORS[i];
        const p = (((elapsed / spec.duration + spec.phase) % 1) + 1) % 1;
        const pts = spec.path;
        const n = pts.length;
        const u = p * n;
        const seg = Math.floor(u) % n;
        const t = u - Math.floor(u);
        const a = pts[(seg - 1 + n) % n];
        const b = pts[seg];
        const c = pts[(seg + 1) % n];
        const d = pts[(seg + 2) % n];
        const x = Math.round(catmull(a[0], b[0], c[0], d[0], t) * w);
        const y = Math.round(catmull(a[1], b[1], c[1], d[1], t) * h);
        posRef.current[i] = { x, y };
        const node = groupRefs.current[i];
        if (node) node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (runEvents) detectEvents(i, spec, p);
      }
    };

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      compute((now - start) / 1000, true);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      measure();
      if (reduced) compute(0, false);
    });
    ro.observe(el);

    if (reduced) {
      compute(0, false);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const timeouts = timeoutsRef.current;
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      timeouts.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div
      ref={surfaceRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]",
        className
      )}
    >
      {/* Dotted design grid, faded toward edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(115% 100% at 50% 0%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(115% 100% at 50% 0%, #000 55%, transparent 100%)",
        }}
      />

      {/* Ambient brand glow, breathing slowly */}
      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl"
        animate={{ opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Mock canvas content, kept quiet so the cursors lead */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute"
          style={{ left: "12%", top: "33%", width: "27%", height: "30%" }}
        >
          <div className="flex h-full w-full flex-col gap-2 rounded-lg border border-dashed border-brand/50 bg-brand/[0.04] p-3">
            <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
            <div className="mt-auto flex items-end gap-1.5">
              <div className="h-6 w-2 rounded-sm bg-white/10" />
              <div className="h-9 w-2 rounded-sm bg-white/[0.14]" />
              <div className="h-4 w-2 rounded-sm bg-white/10" />
              <div className="h-7 w-2 rounded-sm bg-white/[0.12]" />
            </div>
          </div>
          <span className="absolute -top-2 left-2 rounded bg-brand px-1.5 py-px text-[9px] font-medium leading-none text-white">
            Hero
          </span>
          <span className="absolute -left-1 -top-1 h-2 w-2 rounded-[3px] border border-white bg-brand" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-[3px] border border-white bg-brand" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-[3px] border border-white bg-brand" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-[3px] border border-white bg-brand" />
        </div>

        <div
          className="absolute flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
          style={{ left: "60%", top: "56%", width: "26%", height: "24%" }}
        >
          <div className="h-1.5 w-full rounded-full bg-white/[0.08]" />
          <div className="h-1.5 w-5/6 rounded-full bg-white/[0.06]" />
          <div className="h-1.5 w-3/4 rounded-full bg-white/[0.06]" />
          <div className="mt-1 h-4 w-16 rounded-md bg-white/[0.05]" />
        </div>
      </div>

      {/* Header: document + live collaborators */}
      <div className="absolute inset-x-4 top-4 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="text-[13px] font-medium text-zinc-100">
            Realtime canvas
          </span>
          <span className="hidden items-center gap-1 text-[11px] text-zinc-500 sm:flex">
            <Check className="h-3 w-3" strokeWidth={2.5} />
            All changes saved
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2">
            {CURSORS.map((c) => (
              <span
                key={c.name}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold text-white"
                style={{ backgroundColor: c.color, borderColor: "#0b0b12" }}
              >
                {c.name.charAt(0)}
              </span>
            ))}
          </div>
          <span className="hidden items-center gap-1.5 text-[11px] text-zinc-400 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Editing now
          </span>
        </div>
      </div>

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute z-10 block rounded-full border"
            style={{
              left: r.x - 5,
              top: r.y - 5,
              width: 10,
              height: 10,
              borderColor: r.color,
            }}
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 4.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Live cursors */}
      {CURSORS.map((c, i) => (
        <div
          key={c.name}
          ref={(node) => {
            groupRefs.current[i] = node;
          }}
          className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: EASE }}
            className="relative"
          >
            <span
              className="absolute -left-1 -top-1 h-6 w-6 rounded-full blur-md"
              style={{ backgroundColor: c.color, opacity: 0.35 }}
            />
            <motion.svg
              width={21}
              height={21}
              viewBox="0 0 16 16"
              className="relative block"
              style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))" }}
              animate={{ scale: pressed[i] ? 0.82 : 1 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <path
                d={ARROW}
                fill={c.color}
                stroke="#fff"
                strokeOpacity={0.85}
                strokeWidth={1}
                strokeLinejoin="round"
              />
            </motion.svg>
            <span
              className="absolute left-[15px] top-[17px] whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-none text-white shadow-sm shadow-black/30"
              style={{ backgroundColor: c.color }}
            >
              {c.name}
            </span>
            <AnimatePresence>
              {bubbles[i] && (
                <motion.span
                  className="absolute left-[15px] top-[40px] block whitespace-nowrap rounded-lg rounded-tl-none border border-white/10 bg-[#15151f]/95 px-2.5 py-1.5 text-[11px] leading-none text-zinc-200 shadow-lg shadow-black/40 backdrop-blur"
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {bubbles[i]}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-5">
      <CursorPresence className="h-full w-full max-w-2xl" />
    </div>
  );
}
