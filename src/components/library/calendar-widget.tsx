"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type DateParts = { y: number; m: number; d: number };
type EventMarker = { y: number; m: number; d: number; color: string };
type RangeState = { start: DateParts; end: DateParts | null };

type CalendarWidgetProps = {
  className?: string;
  initialMonth?: { y: number; m: number };
  today?: DateParts;
  initialRange?: RangeState;
  events?: EventMarker[];
};

// Deterministic reference frame so the component renders identically on
// server and client (no Date.now()/new Date() at module or render scope).
const DEFAULT_MONTH = { y: 2025, m: 2 }; // March 2025
const DEFAULT_TODAY: DateParts = { y: 2025, m: 2, d: 11 };
const DEFAULT_RANGE: RangeState = {
  start: { y: 2025, m: 2, d: 12 },
  end: { y: 2025, m: 2, d: 16 },
};
const DEFAULT_EVENTS: EventMarker[] = [
  { y: 2025, m: 2, d: 8, color: "#7c6cff" },
  { y: 2025, m: 2, d: 22, color: "#5b8cff" },
  { y: 2025, m: 2, d: 26, color: "#7c6cff" },
];

const DAY_MS = 86400000;

function daysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate();
}
function firstWeekday(y: number, m: number): number {
  return new Date(y, m, 1).getDay();
}
function serial(y: number, m: number, d: number): number {
  return Date.UTC(y, m, d);
}
function addMonths(y: number, m: number, delta: number): { y: number; m: number } {
  const total = y * 12 + m + delta;
  return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 };
}

type Cell = {
  date: DateParts;
  serial: number;
  inCurrentMonth: boolean;
  col: number;
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.012, delayChildren: 0.02 },
  },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};

const cellVariants: Variants = {
  hidden: { opacity: 0, y: 4, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: EASE } },
};

export function CalendarWidget({
  className,
  initialMonth = DEFAULT_MONTH,
  today = DEFAULT_TODAY,
  initialRange = DEFAULT_RANGE,
  events = DEFAULT_EVENTS,
}: CalendarWidgetProps) {
  const [offset, setOffset] = useState(0);
  const [direction, setDirection] = useState(0);
  const [range, setRange] = useState<RangeState>(initialRange);

  const view = useMemo(
    () => addMonths(initialMonth.y, initialMonth.m, offset),
    [initialMonth.y, initialMonth.m, offset]
  );
  const viewYear = view.y;
  const viewMonth = view.m;
  const monthKey = `${viewYear}-${viewMonth}`;

  const cells = useMemo<Cell[]>(() => {
    const first = firstWeekday(viewYear, viewMonth);
    const dim = daysInMonth(viewYear, viewMonth);
    const prev = addMonths(viewYear, viewMonth, -1);
    const prevDim = daysInMonth(prev.y, prev.m);
    const next = addMonths(viewYear, viewMonth, 1);
    const out: Cell[] = [];
    for (let i = 0; i < 42; i++) {
      const dayIndex = i - first + 1;
      let date: DateParts;
      let inCurrentMonth = false;
      if (dayIndex < 1) {
        date = { y: prev.y, m: prev.m, d: prevDim + dayIndex };
      } else if (dayIndex > dim) {
        date = { y: next.y, m: next.m, d: dayIndex - dim };
      } else {
        date = { y: viewYear, m: viewMonth, d: dayIndex };
        inCurrentMonth = true;
      }
      out.push({
        date,
        serial: serial(date.y, date.m, date.d),
        inCurrentMonth,
        col: i % 7,
      });
    }
    return out;
  }, [viewYear, viewMonth]);

  const todayS = serial(today.y, today.m, today.d);
  const startS = serial(range.start.y, range.start.m, range.start.d);
  const endS = range.end
    ? serial(range.end.y, range.end.m, range.end.d)
    : null;

  function goTo(delta: number) {
    setDirection(delta);
    setOffset((o) => o + delta);
  }

  function onSelect(dp: DateParts) {
    const s = serial(dp.y, dp.m, dp.d);
    setRange((prev) => {
      if (prev.end != null) return { start: dp, end: null };
      const ps = serial(prev.start.y, prev.start.m, prev.start.d);
      if (s <= ps) return { start: dp, end: null };
      return { start: prev.start, end: dp };
    });
  }

  const fmt = (dp: DateParts) => `${MONTHS_SHORT[dp.m]} ${dp.d}`;
  const rangeLabel = range.end
    ? `${fmt(range.start)} → ${fmt(range.end)}`
    : fmt(range.start);
  const nights = endS != null ? Math.round((endS - startS) / DAY_MS) : 0;
  const metaLabel =
    endS != null ? `${nights} night${nights === 1 ? "" : "s"}` : "1 day";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-panel p-5",
        className
      )}
    >
      {/* ambient depth + bright top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-brand/15 blur-[70px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="relative z-10">
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="relative h-6 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${monthKey}-title`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="absolute inset-0 flex items-baseline gap-2"
              >
                <span className="text-[15px] font-semibold tracking-tight text-white">
                  {MONTHS[viewMonth]}
                </span>
                <span className="text-[15px] font-medium text-white/35">
                  {viewYear}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              aria-label="Previous month"
              onClick={() => goTo(-1)}
              whileTap={{ scale: 0.92 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next month"
              onClick={() => goTo(1)}
              whileTap={{ scale: 0.92 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* weekday header */}
        <div className="mb-1 grid grid-cols-7">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="flex h-7 items-center justify-center text-[10px] font-medium uppercase tracking-[0.12em] text-white/35"
            >
              {w}
            </div>
          ))}
        </div>

        {/* day grid */}
        <div className="relative min-h-[240px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={monthKey}
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-7"
            >
              {cells.map((cell, i) => {
                const isStart = cell.inCurrentMonth && cell.serial === startS;
                const isEnd =
                  endS != null &&
                  cell.inCurrentMonth &&
                  cell.serial === endS;
                const inRange =
                  cell.inCurrentMonth &&
                  (endS != null
                    ? cell.serial >= startS && cell.serial <= endS
                    : cell.serial === startS);
                const showBand = endS != null && inRange;
                const isToday = cell.inCurrentMonth && cell.serial === todayS;
                const isEndpoint = isStart || isEnd;
                const ev = cell.inCurrentMonth
                  ? events.find(
                      (e) => serial(e.y, e.m, e.d) === cell.serial
                    )
                  : undefined;

                return (
                  <motion.button
                    key={`${monthKey}-${i}`}
                    type="button"
                    variants={cellVariants}
                    disabled={!cell.inCurrentMonth}
                    onClick={() =>
                      cell.inCurrentMonth && onSelect(cell.date)
                    }
                    className={cn(
                      "group/cell relative flex h-10 items-center justify-center outline-none",
                      cell.inCurrentMonth ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    {/* range band */}
                    {showBand && (
                      <motion.span
                        aria-hidden
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className={cn(
                          "absolute inset-y-1 left-0 right-0 bg-brand/12",
                          (isStart || cell.col === 0) && "rounded-l-full",
                          (isEnd || cell.col === 6) && "rounded-r-full"
                        )}
                      />
                    )}

                    {/* hover pill (only on plain days) */}
                    {cell.inCurrentMonth && !isEndpoint && !showBand && (
                      <span
                        aria-hidden
                        className="absolute inset-1 rounded-full transition-colors duration-200 group-hover/cell:bg-white/[0.06]"
                      />
                    )}

                    {/* today marker with a restrained idle pulse */}
                    {isToday && !isEndpoint && (
                      <>
                        <motion.span
                          aria-hidden
                          className="absolute inset-1 rounded-full bg-brand/15 blur-[6px]"
                          animate={{ opacity: [0.35, 0.7, 0.35] }}
                          transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.span
                          aria-hidden
                          className="absolute inset-1 rounded-full ring-1 ring-brand/50"
                          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </>
                    )}

                    {/* selected endpoint pill (spring layout) */}
                    {isEndpoint && (
                      <motion.span
                        aria-hidden
                        layoutId={isStart ? "cal-range-start" : "cal-range-end"}
                        initial={false}
                        transition={{ type: "spring", stiffness: 520, damping: 36 }}
                        className="absolute inset-1 z-[1] rounded-full bg-brand shadow-[0_6px_20px_-6px_rgba(124,108,255,0.75)]"
                      />
                    )}

                    {/* day number */}
                    <span
                      className={cn(
                        "relative z-10 text-[13px] tabular-nums transition-colors",
                        !cell.inCurrentMonth && "text-white/20",
                        cell.inCurrentMonth &&
                          !isEndpoint &&
                          !showBand &&
                          !isToday &&
                          "text-white/70",
                        showBand && !isEndpoint && "text-white",
                        isEndpoint && "font-semibold text-white",
                        isToday && !isEndpoint && "font-semibold text-brand-soft"
                      )}
                    >
                      {cell.date.d}
                    </span>

                    {/* event dot */}
                    {ev && (
                      <span
                        aria-hidden
                        className="absolute bottom-[5px] left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full"
                        style={{
                          backgroundColor: isEndpoint ? "#ffffff" : ev.color,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer summary */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-[13px] font-medium text-white/75">
              {rangeLabel}
            </span>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-white/55">
            {metaLabel}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <CalendarWidget />
    </div>
  );
}
