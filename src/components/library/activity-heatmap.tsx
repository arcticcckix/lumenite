"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS = 7;
const CELL = 14;
const GAP = 4;
const STEP = CELL + GAP;
const LABEL_TOP = 22;
const LABEL_LEFT = 30;
const WAVE = 3.4;
const DAY_MS = 86_400_000;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Increasing violet ramp, level 0 = empty.
const LEVEL_BG = [
  "rgba(255,255,255,0.045)",
  "rgba(124,108,255,0.22)",
  "rgba(124,108,255,0.42)",
  "rgba(124,108,255,0.66)",
  "rgba(140,124,255,0.95)",
];

function round(n: number, p = 2) {
  const f = 10 ** p;
  return Math.round(n * f) / f;
}

// Deterministic hash noise in [0,1).
function seeded(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

function withCommas(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type Cell = {
  col: number;
  row: number;
  count: number;
  level: number;
  label: string;
  inDelay: number;
  waveDelay: number;
  waveAlpha: number;
};

type HeatmapModel = {
  cells: Cell[];
  months: { col: number; label: string }[];
  total: number;
  streak: number;
};

function buildModel(weeks: number, seed: number): HeatmapModel {
  const cols = weeks;
  const maxP = cols - 1 + (ROWS - 1);
  const anchor = Date.UTC(2025, 11, 31); // fixed, deterministic (Dec 31 2025 UTC)

  const cellAt = (col: number, row: number) => {
    const offset = (cols - 1 - col) * 7 + (6 - row);
    return new Date(anchor - offset * DAY_MS);
  };

  const cells: Cell[] = [];
  const grid: number[][] = [];

  for (let col = 0; col < cols; col++) {
    grid[col] = [];
    for (let row = 0; row < ROWS; row++) {
      const r = seeded(col * 31 + row * 7 + seed * 101);
      const zero = seeded(col * 17 + row * 53 + seed * 13 + 7);
      const count = zero < 0.3 ? 0 : Math.round(r ** 1.9 * 17);
      const level =
        count === 0 ? 0 : count < 4 ? 1 : count < 8 ? 2 : count < 12 ? 3 : 4;

      const d = cellAt(col, row);
      const label = `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;

      grid[col][row] = count;
      cells.push({
        col,
        row,
        count,
        level,
        label,
        inDelay: round((col + row) * 0.02, 2),
        waveDelay: round(((col + row) / maxP) * WAVE, 2),
        waveAlpha: round(0.12 + level * 0.14, 2),
      });
    }
  }

  // Month labels along the top, min 2-column spacing so they never collide.
  const months: { col: number; label: string }[] = [];
  let lastMonth = -1;
  let lastCol = -99;
  for (let col = 0; col < cols; col++) {
    const m = cellAt(col, 0).getUTCMonth();
    if (m !== lastMonth && col - lastCol >= 2) {
      months.push({ col, label: MONTHS[m] });
      lastMonth = m;
      lastCol = col;
    }
  }

  // Total contributions.
  let total = 0;
  for (const c of cells) total += c.count;

  // Longest active-day streak, chronological (col asc, row asc == date asc).
  let streak = 0;
  let run = 0;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (grid[col][row] > 0) {
        run += 1;
        if (run > streak) streak = run;
      } else {
        run = 0;
      }
    }
  }

  return { cells, months, total, streak };
}

export function ActivityHeatmap({
  weeks = 20,
  seed = 7,
  title = "Contribution activity",
  className,
}: {
  weeks?: number;
  seed?: number;
  title?: string;
  className?: string;
}) {
  const model = useMemo(() => buildModel(weeks, seed), [weeks, seed]);
  const [hover, setHover] = useState<{ col: number; row: number } | null>(null);

  const gridW = weeks * STEP - GAP;
  const gridH = ROWS * STEP - GAP;
  const boardW = LABEL_LEFT + gridW;
  const boardH = LABEL_TOP + gridH;

  const active = hover
    ? model.cells.find((c) => c.col === hover.col && c.row === hover.row) ?? null
    : null;

  const css = `
  .ah-cell{animation:ah-in .5s cubic-bezier(.16,1,.3,1) both;transform-origin:center;}
  .ah-wave{opacity:0;animation:ah-wave ${WAVE}s linear infinite;}
  @keyframes ah-in{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
  @keyframes ah-wave{0%,100%{opacity:0}10%{opacity:1}26%{opacity:0}}
  @media (prefers-reduced-motion: reduce){
    .ah-cell{animation:none!important;opacity:1!important;transform:none!important;}
    .ah-wave{animation:none!important;opacity:0!important;}
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel p-6",
        className
      )}
    >
      <style>{css}</style>

      {/* soft brand glow, top-left */}
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)" }}
      />

      {/* header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-brand/12 text-brand-soft">
            <Activity size={18} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white">{title}</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              {model.streak}-day best streak
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold tabular-nums tracking-tight text-white">
            {withCommas(model.total)}
          </div>
          <div className="text-xs text-zinc-500">contributions</div>
        </div>
      </div>

      {/* board */}
      <div className="relative mt-6 flex justify-center">
        <div
          className="relative"
          style={{ width: boardW, height: boardH }}
          onMouseLeave={() => setHover(null)}
        >
          {/* month labels */}
          {model.months.map((m) => (
            <span
              key={`m-${m.col}`}
              className="absolute text-[10px] font-medium text-zinc-500"
              style={{ left: LABEL_LEFT + m.col * STEP, top: 0 }}
            >
              {m.label}
            </span>
          ))}

          {/* weekday labels (Mon / Wed / Fri) */}
          {[1, 3, 5].map((row) => (
            <span
              key={`w-${row}`}
              className="absolute text-right text-[10px] font-medium text-zinc-500"
              style={{
                left: 0,
                top: LABEL_TOP + row * STEP,
                width: LABEL_LEFT - 8,
                height: CELL,
                lineHeight: `${CELL}px`,
              }}
            >
              {WEEKDAYS[row]}
            </span>
          ))}

          {/* cells */}
          {model.cells.map((c) => {
            const isHover = hover?.col === c.col && hover?.row === c.row;
            const base =
              c.level >= 4
                ? "0 0 10px rgba(124,108,255,0.4)"
                : c.level === 0
                  ? "inset 0 0 0 1px rgba(255,255,255,0.03)"
                  : "none";
            const shadow = isHover
              ? `0 0 0 1.5px rgba(255,255,255,0.85), 0 0 10px rgba(124,108,255,0.4)`
              : base;
            return (
              <div
                key={`${c.col}-${c.row}`}
                className="ah-cell absolute"
                style={{
                  left: LABEL_LEFT + c.col * STEP,
                  top: LABEL_TOP + c.row * STEP,
                  width: CELL,
                  height: CELL,
                  borderRadius: 3,
                  backgroundColor: LEVEL_BG[c.level],
                  boxShadow: shadow,
                  animationDelay: `${c.inDelay}s`,
                  zIndex: isHover ? 5 : 1,
                }}
                onMouseEnter={() => setHover({ col: c.col, row: c.row })}
              >
                <div
                  className="ah-wave pointer-events-none absolute inset-0"
                  style={{
                    borderRadius: 3,
                    backgroundColor: `rgba(157,144,255,${c.waveAlpha})`,
                    mixBlendMode: "screen",
                    animationDelay: `${c.waveDelay}s`,
                  }}
                />
              </div>
            );
          })}

          {/* tooltip */}
          <AnimatePresence>
            {active && (
              <motion.div
                key={`${active.col}-${active.row}`}
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-white/10 bg-[#16161f] px-2.5 py-1.5 text-xs shadow-xl"
                style={{
                  left: LABEL_LEFT + active.col * STEP + CELL / 2,
                  top: LABEL_TOP + active.row * STEP - 6,
                }}
              >
                <span className="font-semibold text-white">
                  {active.count === 0
                    ? "No contributions"
                    : `${active.count} contribution${active.count === 1 ? "" : "s"}`}
                </span>
                <span className="text-zinc-500"> · {active.label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* legend */}
      <div className="relative mt-5 flex items-center justify-end gap-1.5">
        <span className="text-[10px] text-zinc-500">Less</span>
        {LEVEL_BG.map((bg, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              backgroundColor: bg,
              boxShadow: i === 0 ? "inset 0 0 0 1px rgba(255,255,255,0.04)" : "none",
            }}
          />
        ))}
        <span className="text-[10px] text-zinc-500">More</span>
      </div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <ActivityHeatmap />
    </div>
  );
}
