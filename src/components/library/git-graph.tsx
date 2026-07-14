"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, GitCommitHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const LANE_X = [16, 40] as const;
const CELL_W = 56;
const ROW_H = 46;
const CY = ROW_H / 2;
const DOT_R = 5;
const EASE = [0.16, 1, 0.3, 1] as const;

const round = (n: number) => Math.round(n * 100) / 100;

const vLine = (l: number) => `M ${LANE_X[l]} 0 L ${LANE_X[l]} ${ROW_H}`;
const upStub = (l: number) => `M ${LANE_X[l]} 0 L ${LANE_X[l]} ${CY}`;
const downStub = (l: number) => `M ${LANE_X[l]} ${CY} L ${LANE_X[l]} ${ROW_H}`;

const mergeCurve = (from: number, to: number) => {
  const fx = LANE_X[from];
  const tx = LANE_X[to];
  const c1 = round(CY + (ROW_H - CY) * 0.5);
  const c2 = round(ROW_H - (ROW_H - CY) * 0.5);
  return `M ${fx} ${CY} C ${fx} ${c1} ${tx} ${c2} ${tx} ${ROW_H}`;
};

const branchCurve = (from: number, to: number) => {
  const fx = LANE_X[from];
  const tx = LANE_X[to];
  const c = round(CY * 0.5);
  return `M ${fx} 0 C ${fx} ${c} ${tx} ${c} ${tx} ${CY}`;
};

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const MAIN = "#7c6cff"; // main lane, brand
const FEAT = "#5b8cff"; // feature branch, glow
const FIX = "#34d3a6"; // fix branch, emerald

type Seg =
  | { k: "v"; l: number; c: string }
  | { k: "up"; l: number; c: string }
  | { k: "down"; l: number; c: string }
  | { k: "downFade"; l: number; c: string }
  | { k: "merge"; from: number; to: number; c: string }
  | { k: "branch"; from: number; to: number; c: string };

interface Commit {
  hash: string;
  message: string;
  author: string;
  dot: number;
  dotColor: string;
  hollow?: boolean;
  segs: Seg[];
}

/* ------------------------------------------------------------------ */
/* History (top = newest). A feature branch and a fix branch that each */
/* diverge from and merge back into main.                              */
/* ------------------------------------------------------------------ */

const HISTORY: Commit[] = [
  {
    hash: "1c4f8a2",
    message: "merge: feat/streaming into main",
    author: "Aria Chen",
    dot: 0,
    dotColor: MAIN,
    hollow: true,
    segs: [
      { k: "up", l: 0, c: MAIN },
      { k: "down", l: 0, c: MAIN },
      { k: "merge", from: 0, to: 1, c: FEAT },
    ],
  },
  {
    hash: "7d09e15",
    message: "feat: chunked token streaming",
    author: "Aria Chen",
    dot: 1,
    dotColor: FEAT,
    segs: [
      { k: "v", l: 0, c: MAIN },
      { k: "up", l: 1, c: FEAT },
      { k: "down", l: 1, c: FEAT },
    ],
  },
  {
    hash: "a3b6c40",
    message: "feat: backpressure guard for slow clients",
    author: "Sam Wei",
    dot: 1,
    dotColor: FEAT,
    segs: [
      { k: "v", l: 0, c: MAIN },
      { k: "up", l: 1, c: FEAT },
      { k: "down", l: 1, c: FEAT },
    ],
  },
  {
    hash: "5e2f9d7",
    message: "refactor: extract lane solver",
    author: "Marco Diaz",
    dot: 0,
    dotColor: MAIN,
    segs: [
      { k: "up", l: 0, c: MAIN },
      { k: "down", l: 0, c: MAIN },
      { k: "branch", from: 1, to: 0, c: FEAT },
    ],
  },
  {
    hash: "0b8a1c6",
    message: "merge: fix/telemetry into main",
    author: "Priya Nair",
    dot: 0,
    dotColor: MAIN,
    hollow: true,
    segs: [
      { k: "up", l: 0, c: MAIN },
      { k: "down", l: 0, c: MAIN },
      { k: "merge", from: 0, to: 1, c: FIX },
    ],
  },
  {
    hash: "c94d720",
    message: "fix: clamp retry backoff to 30s",
    author: "Priya Nair",
    dot: 1,
    dotColor: FIX,
    segs: [
      { k: "v", l: 0, c: MAIN },
      { k: "up", l: 1, c: FIX },
      { k: "down", l: 1, c: FIX },
    ],
  },
  {
    hash: "63f0ae9",
    message: "chore: bump framer-motion to 12.4",
    author: "Marco Diaz",
    dot: 0,
    dotColor: MAIN,
    segs: [
      { k: "up", l: 0, c: MAIN },
      { k: "branch", from: 1, to: 0, c: FIX },
      { k: "downFade", l: 0, c: MAIN },
    ],
  },
];

/* Commits that "land" at the top of main on the loop. */
const INCOMING: Omit<Commit, "dot" | "dotColor" | "segs">[] = [
  { hash: "e4a91c2", message: "feat: add SSE reconnect fallback", author: "Aria Chen" },
  { hash: "9f3b027", message: "perf: cache resolved lane layout", author: "Sam Wei" },
  { hash: "2c7d5a8", message: "fix: tighten CSP for embeds", author: "Priya Nair" },
  { hash: "d10e6b4", message: "refactor: parallelize graph paint", author: "Marco Diaz" },
];

const BASE_COUNT = 1284;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const AVATAR_GRADIENTS: [string, string][] = [
  ["#7c6cff", "#5b8cff"],
  ["#5b8cff", "#34d3a6"],
  ["#a99dff", "#7c6cff"],
  ["#f2994a", "#e5678a"],
  ["#34d3a6", "#5b8cff"],
];

function avatarFor(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  const [from, to] = AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return { from, to, initials };
}

function Avatar({ name }: { name: string }) {
  const { from, to, initials } = avatarFor(name);
  return (
    <div
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white ring-1 ring-inset ring-white/15"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </div>
  );
}

function CommitMessage({ message }: { message: string }) {
  const match = message.match(/^(feat|fix|chore|refactor|merge|perf|docs):/);
  if (match) {
    const prefix = match[0];
    const rest = message.slice(prefix.length);
    const color = prefix.startsWith("feat")
      ? "text-brand-soft"
      : prefix.startsWith("fix")
        ? "text-[#34d3a6]"
        : prefix.startsWith("merge")
          ? "text-glow"
          : "text-zinc-500";
    return (
      <span className="truncate">
        <span className={cn("font-medium", color)}>{prefix}</span>
        <span className="text-zinc-300">{rest}</span>
      </span>
    );
  }
  return <span className="truncate text-zinc-300">{message}</span>;
}

/* ------------------------------------------------------------------ */
/* Per-row graph cell                                                  */
/* ------------------------------------------------------------------ */

function segPath(s: Seg): string {
  switch (s.k) {
    case "v":
      return vLine(s.l);
    case "up":
      return upStub(s.l);
    case "down":
    case "downFade":
      return downStub(s.l);
    case "merge":
      return mergeCurve(s.from, s.to);
    case "branch":
      return branchCurve(s.from, s.to);
  }
}

function RowGraph({ commit, delay }: { commit: Commit; delay: number }) {
  return (
    <svg
      width={CELL_W}
      height={ROW_H}
      viewBox={`0 0 ${CELL_W} ${ROW_H}`}
      className="shrink-0 overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id="gg-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={MAIN} stopOpacity={0.9} />
          <stop offset="100%" stopColor={MAIN} stopOpacity={0} />
        </linearGradient>
      </defs>

      {commit.segs.map((s, i) => (
        <motion.path
          key={i}
          d={segPath(s)}
          stroke={s.k === "downFade" ? "url(#gg-fade)" : s.c}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          strokeOpacity={0.9}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay, ease: EASE }}
        />
      ))}

      {/* soft halo */}
      <circle
        cx={LANE_X[commit.dot]}
        cy={CY}
        r={9}
        fill={commit.dotColor}
        opacity={0.12}
      />
      {/* commit dot */}
      <motion.circle
        cx={LANE_X[commit.dot]}
        cy={CY}
        fill={commit.hollow ? "#050508" : commit.dotColor}
        stroke={commit.dotColor}
        strokeWidth={commit.hollow ? 2 : 0}
        initial={{ r: 0 }}
        animate={{ r: DOT_R }}
        transition={{ delay: delay + 0.15, type: "spring", stiffness: 340, damping: 22 }}
      />
    </svg>
  );
}

function StaticRow({ commit, index }: { commit: Commit; index: number }) {
  const delay = 0.2 + index * 0.07;
  return (
    <div className="flex items-center gap-3" style={{ height: ROW_H }}>
      <RowGraph commit={commit} delay={delay} />
      <motion.div
        className="flex min-w-0 flex-1 items-center gap-3"
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.1, ease: EASE }}
      >
        <Avatar name={commit.author} />
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <div className="min-w-0 flex-1 text-[13px] leading-tight">
            <CommitMessage message={commit.message} />
          </div>
          <span className="shrink-0 font-mono text-[11px] text-zinc-600">
            {commit.hash}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Incoming (HEAD) row. A fresh commit draws in on every loop.         */
/* ------------------------------------------------------------------ */

function IncomingRow({ tick }: { tick: number }) {
  const data = INCOMING[tick % INCOMING.length];

  return (
    <div className="flex items-center gap-3" style={{ height: ROW_H }}>
      <svg
        width={CELL_W}
        height={ROW_H}
        viewBox={`0 0 ${CELL_W} ${ROW_H}`}
        className="shrink-0 overflow-visible"
        aria-hidden
      >
        {/* line that grows down into the history */}
        <motion.path
          key={`line-${tick}`}
          d={downStub(0)}
          stroke={MAIN}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
        {/* halo */}
        <circle cx={LANE_X[0]} cy={CY} r={10} fill={MAIN} opacity={0.16} />
        {/* continuous pulse ring, keeps HEAD alive at rest */}
        <motion.circle
          cx={LANE_X[0]}
          cy={CY}
          fill="none"
          stroke={MAIN}
          strokeWidth={1.5}
          initial={{ r: DOT_R, opacity: 0.5 }}
          animate={{ r: [DOT_R, 16], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
        {/* the freshly-landed dot */}
        <motion.circle
          key={`dot-${tick}`}
          cx={LANE_X[0]}
          cy={CY}
          fill={MAIN}
          initial={{ r: 0 }}
          animate={{ r: DOT_R }}
          transition={{ type: "spring", stiffness: 360, damping: 18, delay: 0.28 }}
        />
      </svg>

      <div className="relative flex min-w-0 flex-1 items-center gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={tick}
            className="flex min-w-0 flex-1 items-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
          >
            <Avatar name={data.author} />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="min-w-0 flex-1 text-[13px] leading-tight">
                <CommitMessage message={data.message} />
              </div>
              <span className="hidden shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand-soft sm:inline-flex">
                HEAD
                <span className="text-brand-soft/60">main</span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-zinc-500">
                {data.hash}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

export function GitGraph({ className }: { className?: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3400);
    return () => clearInterval(id);
  }, []);

  const count = BASE_COUNT + tick;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel ring-1 ring-white/[0.04]",
        className
      )}
    >
      {/* top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      {/* header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
            <GitBranch className="h-3.5 w-3.5 text-brand-soft" />
          </div>
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="font-medium text-zinc-300">lumenite</span>
            <span className="text-zinc-600">/</span>
            <span className="font-medium text-white">main</span>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5 text-[12px] text-zinc-500">
          <GitCommitHorizontal className="h-4 w-4 text-zinc-600" />
          <span className="tabular-nums text-zinc-400">
            {count.toLocaleString("en-US")}
          </span>
          <span>commits</span>
          <AnimatePresence>
            <motion.span
              key={tick}
              className="pointer-events-none absolute -right-1 -top-1 font-mono text-[10px] font-semibold text-brand-soft"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: [0, 1, 0], y: -10 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              +1
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* graph */}
      <div className="flex flex-1 flex-col justify-center px-5 py-2">
        <IncomingRow tick={tick} />
        {HISTORY.map((commit, i) => (
          <StaticRow key={commit.hash} commit={commit} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <GitGraph className="max-w-md" />
    </div>
  );
}
