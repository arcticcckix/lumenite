"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlanCell = boolean | string;

export interface Plan {
  name: string;
  price: string;
  caption?: string;
}

export interface FeatureRow {
  label: string;
  cells: PlanCell[];
}

export interface FeatureGroup {
  title: string;
  rows: FeatureRow[];
}

export interface FeatureComparisonTableProps {
  plans: Plan[];
  groups: FeatureGroup[];
  /** Index of the plan column to highlight (default 1, the middle "Pro" column). */
  highlightIndex?: number;
  /** Whether the row-highlight sweeps down on a loop (default true). */
  sweep?: boolean;
  /** Milliseconds between sweep steps (default 1500). */
  sweepInterval?: number;
  className?: string;
}

const GROUP_H = 30;
const ROW_H = 36;

const EASE = [0.16, 1, 0.3, 1] as const;

function ValueCell({
  value,
  highlighted,
}: {
  value: PlanCell;
  highlighted: boolean;
}) {
  if (typeof value === "string") {
    return (
      <span
        className={cn(
          "text-[13px] leading-none",
          highlighted ? "font-medium text-white" : "text-zinc-300"
        )}
      >
        {value}
      </span>
    );
  }
  if (value) {
    return (
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-inset",
          highlighted
            ? "bg-brand/15 text-brand-soft ring-brand/25"
            : "bg-white/[0.06] text-zinc-200 ring-white/10"
        )}
      >
        <Check className="h-3 w-3" strokeWidth={2.75} />
      </span>
    );
  }
  return <Minus className="h-3.5 w-3.5 text-zinc-700" strokeWidth={2.5} />;
}

export function FeatureComparisonTable({
  plans,
  groups,
  highlightIndex = 1,
  sweep = true,
  sweepInterval = 1500,
  className,
}: FeatureComparisonTableProps) {
  const gridTemplate = `minmax(0,1.7fr) repeat(${plans.length}, minmax(0,1fr))`;

  const { flat, rowYs, totalH } = useMemo(() => {
    let y = 0;
    let di = 0;
    const items: Array<
      | { type: "group"; title: string }
      | { type: "row"; row: FeatureRow; dataIndex: number }
    > = [];
    const ys: number[] = [];
    for (const g of groups) {
      items.push({ type: "group", title: g.title });
      y += GROUP_H;
      for (const row of g.rows) {
        items.push({ type: "row", row, dataIndex: di });
        ys.push(y);
        y += ROW_H;
        di += 1;
      }
    }
    return { flat: items, rowYs: ys, totalH: y };
  }, [groups]);

  const rowCount = rowYs.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!sweep || rowCount === 0) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % rowCount),
      sweepInterval
    );
    return () => clearInterval(id);
  }, [sweep, rowCount, sweepInterval]);

  const sweepY = rowYs[active] ?? 0;
  const bandColumn = highlightIndex + 2; // +1 for feature col, +1 for 1-based grid

  return (
    <div
      className={cn(
        "relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel",
        className
      )}
    >
      {/* Highlighted plan band, spans full table height */}
      <div
        className="pointer-events-none absolute inset-0 grid"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <div
          className="relative h-full rounded-t-xl bg-gradient-to-b from-brand/[0.10] via-brand/[0.05] to-brand/[0.02] ring-1 ring-inset ring-brand/15"
          style={{ gridColumnStart: bandColumn }}
        >
          <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_50%_0,rgba(124,108,255,0.20),transparent_70%)]" />
          <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div
          className="grid items-end border-b border-white/[0.06] px-1 pb-3 pt-4"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="pl-4 pr-2">
            <div className="text-sm font-semibold text-white">Compare plans</div>
            <div className="mt-0.5 text-[11px] text-zinc-500">
              Everything scales with you
            </div>
          </div>
          {plans.map((plan, i) => {
            const hot = i === highlightIndex;
            return (
              <div
                key={plan.name}
                className="flex flex-col items-center px-2 text-center"
              >
                {hot && plan.caption ? (
                  <span className="mb-1 rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-brand-soft ring-1 ring-inset ring-brand/25">
                    {plan.caption}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "text-[13px] font-semibold",
                    hot ? "text-white" : "text-zinc-200"
                  )}
                >
                  {plan.name}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-[11px]",
                    hot ? "text-brand-soft" : "text-zinc-500"
                  )}
                >
                  {plan.price}
                </span>
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="relative px-1" style={{ height: totalH }}>
          {/* Sweeping row highlight */}
          {sweep && rowCount > 0 ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-1 z-0 rounded-lg"
              style={{ height: ROW_H }}
              initial={false}
              animate={{ y: sweepY }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand/[0.09] via-brand/[0.04] to-transparent" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand/60 to-transparent" />
            </motion.div>
          ) : null}

          {flat.map((item, idx) => {
            if (item.type === "group") {
              return (
                <div
                  key={`g-${item.title}`}
                  className="flex items-center px-4"
                  style={{ height: GROUP_H }}
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {item.title}
                  </span>
                  <span className="ml-3 h-px flex-1 bg-white/[0.05]" />
                </div>
              );
            }
            const isActive = sweep && item.dataIndex === active;
            return (
              <div
                key={`r-${idx}-${item.row.label}`}
                className="relative z-10 grid items-center"
                style={{ gridTemplateColumns: gridTemplate, height: ROW_H }}
              >
                <span
                  className={cn(
                    "truncate pl-4 pr-2 text-[13px] transition-colors duration-500",
                    isActive ? "text-white" : "text-zinc-300"
                  )}
                >
                  {item.row.label}
                </span>
                {item.row.cells.map((cell, ci) => (
                  <div
                    key={ci}
                    className="flex items-center justify-center px-2"
                  >
                    <ValueCell value={cell} highlighted={ci === highlightIndex} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const DEMO_PLANS: Plan[] = [
  { name: "Free", price: "$0" },
  { name: "Pro", price: "$19 / mo", caption: "Recommended" },
  { name: "Enterprise", price: "Custom" },
];

const DEMO_GROUPS: FeatureGroup[] = [
  {
    title: "Workspace",
    rows: [
      { label: "Projects", cells: ["3", "Unlimited", "Unlimited"] },
      { label: "Team seats", cells: ["1", "10", "Unlimited"] },
      { label: "Storage", cells: ["2 GB", "100 GB", "1 TB"] },
    ],
  },
  {
    title: "Collaboration",
    rows: [
      { label: "Realtime sync", cells: [false, true, true] },
      { label: "Version history", cells: [false, "30 days", "Unlimited"] },
    ],
  },
  {
    title: "Security",
    rows: [
      { label: "SSO and SAML", cells: [false, false, true] },
      { label: "Audit log", cells: [false, false, true] },
    ],
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-5">
      <FeatureComparisonTable plans={DEMO_PLANS} groups={DEMO_GROUPS} />
    </div>
  );
}
