"use client";

import { useId, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Activity,
  GitBranch,
  Globe,
  History,
  Lock,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CYCLE_MS = 4200;

export interface FeatureTab {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
}

export function FeatureTabs({
  tabs,
  eyebrow = "Platform",
  heading = "Ship with confidence",
  className,
}: {
  tabs: FeatureTab[];
  eyebrow?: string;
  heading?: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const elapsed = useRef(0);
  const paused = useRef(false);
  const count = tabs.length;

  const fillWidth = useTransform(progress, (v) => {
    const clamped = v < 0 ? 0 : v > 1 ? 1 : v;
    return `${Math.round(clamped * 100)}%`;
  });

  useAnimationFrame((_, delta) => {
    if (paused.current || count === 0) return;
    // Clamp delta so a background tab or a stutter cannot fast-forward the loop.
    const step = delta > 80 ? 80 : delta;
    elapsed.current += step;
    const ratio = elapsed.current / CYCLE_MS;
    if (ratio >= 1) {
      elapsed.current = 0;
      progress.set(0);
      setActive((i) => (i + 1) % count);
    } else {
      progress.set(ratio);
    }
  });

  function select(i: number) {
    elapsed.current = 0;
    progress.set(0);
    setActive(i);
  }

  const activeTab = tabs[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      className={cn("flex h-full w-full gap-4 md:gap-6", className)}
    >
      {/* Left column: the tab rail */}
      <div className="flex w-[46%] max-w-[340px] shrink-0 flex-col">
        <div className="mb-4 px-1">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            {eyebrow}
          </div>
          <h3 className="mt-1 text-[15px] font-semibold text-white">{heading}</h3>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2">
          {tabs.map((tab, i) => {
            const isActive = i === active;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => select(i)}
                className={cn(
                  "group relative w-full rounded-xl border px-3.5 py-3 text-left transition-colors duration-300",
                  isActive
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.015]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                      isActive
                        ? "border-brand/40 bg-brand/15 text-brand-soft"
                        : "border-line bg-white/[0.02] text-zinc-500 group-hover:text-zinc-400"
                    )}
                  >
                    {tab.icon}
                  </div>
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        isActive ? "text-white" : "text-zinc-400"
                      )}
                    >
                      {tab.title}
                    </div>
                    <p
                      className={cn(
                        "mt-1 line-clamp-2 text-xs leading-relaxed transition-colors duration-300",
                        isActive ? "text-zinc-400" : "text-zinc-600"
                      )}
                    >
                      {tab.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute inset-x-3.5 bottom-1.5 h-[2px] overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      style={{ width: fillWidth }}
                      className="h-full rounded-full bg-gradient-to-r from-brand to-glow shadow-[0_0_8px_rgba(124,108,255,0.55)]"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right column: the crossfading preview */}
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-panel to-[#0a0a10]">
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:22px_22px]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab?.id ?? "empty"}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.01, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0"
          >
            {activeTab?.preview}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview panels                                                      */
/* ------------------------------------------------------------------ */

function DeployPreview() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b12] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-1">
            <Lock className="h-3 w-3 shrink-0 text-zinc-500" />
            <span className="truncate text-[11px] text-zinc-400">
              pr-482.lumenite.app
            </span>
          </div>
        </div>
        <div className="relative h-[116px] overflow-hidden bg-gradient-to-br from-[#12121c] to-[#0a0a10] p-4">
          <div className="h-2.5 w-24 rounded-full bg-gradient-to-r from-brand/80 to-glow/70" />
          <div className="mt-3 h-1.5 w-44 rounded-full bg-white/10" />
          <div className="mt-2 h-1.5 w-32 rounded-full bg-white/[0.07]" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-md border border-brand/30 bg-brand/15" />
            <div className="h-6 w-16 rounded-md border border-white/10 bg-white/[0.03]" />
          </div>
          <motion.div
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,108,255,0.14), transparent)",
            }}
            animate={{ x: ["0%", "400%"] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.6,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70"
              animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-zinc-300">Preview ready</span>
        </div>
        <span className="text-[11px] tabular-nums text-zinc-500">
          Built in 11.4s
        </span>
      </div>
    </div>
  );
}

function EdgePreview() {
  const nodes = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2 + 0.6;
      const radius = 24 + (i % 3) * 15;
      const x = Math.round((50 + Math.cos(angle) * radius) * 10) / 10;
      const y = Math.round((50 + Math.sin(angle) * radius) * 10) / 10;
      const delay = Math.round(Math.abs(Math.sin(i * 12.9898)) * 200) / 100;
      return { x, y, delay };
    });
  }, []);

  return (
    <div className="relative flex h-full flex-col items-center justify-center p-5">
      <div className="relative aspect-square w-[62%] max-w-[210px]">
        {[100, 68, 36].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-white/[0.07]"
            style={{ inset: `${Math.round(((100 - size) / 2) * 10) / 10}%` }}
          />
        ))}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(124,108,255,0.22) 45deg, transparent 90deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand/40 bg-brand/15">
          <motion.span
            className="absolute inset-0 rounded-full bg-brand/25"
            animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <Globe className="relative h-3.5 w-3.5 text-brand-soft" />
        </div>
        {nodes.map((node, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-glow/70"
                animate={{ scale: [1, 2.6, 1], opacity: [0.7, 0, 0.7] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay,
                }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-glow" />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="text-center">
          <div className="text-sm font-semibold tabular-nums text-white">312</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Edge PoPs
          </div>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-center">
          <div className="text-sm font-semibold tabular-nums text-white">48ms</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            p50 global
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricsPreview() {
  const gradId = useId();
  const { line, area, lastLeft, lastTop } = useMemo(() => {
    const data = [16, 22, 19, 30, 26, 38, 33, 44, 40, 52, 47, 58];
    const W = 100;
    const H = 44;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const span = max - min || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / span) * (H * 0.78) - H * 0.12;
      return [x, y] as const;
    });
    const r = (n: number) => Math.round(n * 100) / 100;
    let d = `M ${r(pts[0][0])} ${r(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2[0])} ${r(p2[1])}`;
    }
    const last = pts[pts.length - 1];
    return {
      line: d,
      area: `${d} L ${r(W)} ${r(H)} L 0 ${r(H)} Z`,
      lastLeft: r(last[0]),
      lastTop: Math.round((last[1] / H) * 1000) / 10,
    };
  }, []);

  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            p75 latency
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tabular-nums text-white">
              112
            </span>
            <span className="text-xs text-zinc-500">ms</span>
          </div>
        </div>
        <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
          -18% w/w
        </div>
      </div>

      <div className="relative mt-auto h-[52%] w-full">
        <svg
          viewBox="0 0 100 44"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(124,108,255,0.35)" />
              <stop offset="100%" stopColor="rgba(124,108,255,0)" />
            </linearGradient>
          </defs>
          <motion.path
            d={area}
            fill={`url(#${gradId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth={1.4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </svg>
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${lastLeft}%`, top: `${lastTop}%` }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-brand/60"
              animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-white/40 bg-brand" />
          </span>
        </div>
        <motion.div
          className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(91,140,255,0.12), transparent)",
          }}
          animate={{ x: ["0%", "500%"] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.4,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] tabular-nums text-zinc-600">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>now</span>
      </div>
    </div>
  );
}

function RollbackPreview() {
  const versions = [
    { v: "v2.9.0", hash: "e4a91c2", when: "2m ago", live: true },
    { v: "v2.8.4", hash: "b17f0de", when: "3h ago", live: false },
    { v: "v2.8.3", hash: "9c22a41", when: "yesterday", live: false },
    { v: "v2.8.0", hash: "5fa8d90", when: "2 days ago", live: false },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-5">
      <div className="mb-1 flex items-center justify-between px-0.5">
        <span className="text-xs font-medium text-zinc-300">
          Deployment history
        </span>
        <History className="h-3.5 w-3.5 text-zinc-500" />
      </div>
      {versions.map((row, i) => (
        <motion.div
          key={row.v}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.06 * i }}
          className={cn(
            "relative flex items-center gap-3 rounded-lg border px-3 py-2.5",
            row.live
              ? "border-brand/30 bg-brand/[0.07]"
              : "border-white/[0.06] bg-white/[0.015]"
          )}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            {row.live && (
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70"
                animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                row.live ? "bg-emerald-400" : "bg-zinc-600"
              )}
            />
          </span>
          <span className="text-sm font-medium tabular-nums text-white">
            {row.v}
          </span>
          <span className="font-mono text-[11px] text-zinc-500">{row.hash}</span>
          <span className="ml-auto text-[11px] text-zinc-500">{row.when}</span>
          {row.live ? (
            <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
              Live
            </span>
          ) : i === 1 ? (
            <motion.span
              className="flex items-center gap-1 rounded-md border border-brand/40 bg-brand/15 px-1.5 py-0.5 text-[10px] font-medium text-brand-soft"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Restore
            </motion.span>
          ) : (
            <span className="h-[18px] w-[54px]" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-5">
      <FeatureTabs
        className="max-w-4xl"
        tabs={[
          {
            id: "preview",
            title: "Preview every pull request",
            description:
              "Each commit builds an isolated environment with a shareable URL, so reviewers click instead of guessing.",
            icon: <GitBranch className="h-4 w-4" />,
            preview: <DeployPreview />,
          },
          {
            id: "edge",
            title: "Serve from the edge",
            description:
              "Static assets and functions run close to users across 300 locations, holding response times under 50ms.",
            icon: <Globe className="h-4 w-4" />,
            preview: <EdgePreview />,
          },
          {
            id: "metrics",
            title: "Trace what users feel",
            description:
              "Real user metrics stream in live, with p75 latency and error rates broken down by route.",
            icon: <Activity className="h-4 w-4" />,
            preview: <MetricsPreview />,
          },
          {
            id: "rollback",
            title: "Roll back in one click",
            description:
              "Every deploy is immutable and retained, so reverting to a known-good build takes seconds.",
            icon: <History className="h-4 w-4" />,
            preview: <RollbackPreview />,
          },
        ]}
      />
    </div>
  );
}
