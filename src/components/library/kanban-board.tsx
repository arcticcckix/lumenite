"use client";

import { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, useReducedMotion } from "framer-motion";
import { MessageSquare, GitBranch, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- types --- */

type ColumnIndex = 0 | 1 | 2;

interface Person {
  initials: string;
  from: string;
  to: string;
}

interface Label {
  name: string;
  color: string;
}

interface Task {
  id: string;
  code: string;
  title: string;
  label: Label;
  comments: number;
  branches: number;
  assignees: Person[];
  col: ColumnIndex;
}

interface ColumnDef {
  name: string;
  color: string;
  live?: boolean;
}

/* ------------------------------------------------------------- constants --- */

const PEOPLE: Record<string, Person> = {
  aria: { initials: "AK", from: "#7c6cff", to: "#5b8cff" },
  jonas: { initials: "JM", from: "#f2734f", to: "#f5a15f" },
  remy: { initials: "RL", from: "#4fd1c5", to: "#38b2ac" },
  sofia: { initials: "SO", from: "#a78bfa", to: "#7c6cff" },
  theo: { initials: "TN", from: "#5b8cff", to: "#38b2ac" },
};

const LABELS: Record<string, Label> = {
  frontend: { name: "Frontend", color: "#7c6cff" },
  backend: { name: "Backend", color: "#5b8cff" },
  design: { name: "Design", color: "#a78bfa" },
  infra: { name: "Infra", color: "#4fd1c5" },
};

const COLUMNS: ColumnDef[] = [
  { name: "Todo", color: "#8b8b9e" },
  { name: "In Progress", color: "#5b8cff", live: true },
  { name: "Done", color: "#4fd1c5" },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "eng-241",
    code: "ENG-241",
    title: "Refactor auth token refresh",
    label: LABELS.backend,
    comments: 4,
    branches: 1,
    assignees: [PEOPLE.aria],
    col: 0,
  },
  {
    id: "inf-088",
    code: "INF-088",
    title: "Rate limit the API gateway",
    label: LABELS.infra,
    comments: 2,
    branches: 2,
    assignees: [PEOPLE.theo],
    col: 0,
  },
  {
    id: "dsn-153",
    code: "DSN-153",
    title: "Empty states for the inbox",
    label: LABELS.design,
    comments: 6,
    branches: 0,
    assignees: [PEOPLE.sofia],
    col: 0,
  },
  {
    id: "web-317",
    code: "WEB-317",
    title: "Fix layout shift on pricing",
    label: LABELS.frontend,
    comments: 3,
    branches: 1,
    assignees: [PEOPLE.jonas, PEOPLE.aria],
    col: 1,
  },
  {
    id: "eng-198",
    code: "ENG-198",
    title: "Migrate analytics to Segment",
    label: LABELS.backend,
    comments: 5,
    branches: 2,
    assignees: [PEOPLE.remy],
    col: 1,
  },
  {
    id: "inf-072",
    code: "INF-072",
    title: "Optimize the image pipeline",
    label: LABELS.infra,
    comments: 1,
    branches: 1,
    assignees: [PEOPLE.theo, PEOPLE.remy],
    col: 2,
  },
];

const SPRING = { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.9 };

/* ---------------------------------------------------------------- pieces --- */

function Avatar({ person }: { person: Person }) {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-semibold text-white ring-2 ring-[#0b0b12]"
      style={{
        backgroundImage: `linear-gradient(135deg, ${person.from}, ${person.to})`,
      }}
    >
      {person.initials}
    </span>
  );
}

function TaskCard({ task, active }: { task: Task; active: boolean }) {
  return (
    <motion.div
      layout
      layoutId={task.id}
      transition={SPRING}
      style={
        active
          ? {
              boxShadow:
                "0 0 0 1px rgba(124,108,255,0.4), 0 14px 34px -16px rgba(124,108,255,0.55)",
            }
          : undefined
      }
      className={cn(
        "relative overflow-hidden rounded-xl border bg-[#0d0d14] p-3",
        active ? "border-brand/40" : "border-white/10"
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-2.5 left-0 w-[2px] rounded-full"
        style={{ backgroundColor: task.label.color, opacity: 0.75 }}
      />
      <div className="flex items-center justify-between gap-2">
        <span
          className="rounded-full border px-2 py-[3px] text-[10px] font-medium leading-none"
          style={{
            color: task.label.color,
            backgroundColor: `${task.label.color}1a`,
            borderColor: `${task.label.color}33`,
          }}
        >
          {task.label.name}
        </span>
        <span className="font-mono text-[10px] tracking-tight text-white/30">
          {task.code}
        </span>
      </div>

      <div className="mt-2 text-[13px] font-medium leading-snug text-white/85">
        {task.title}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white/35">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" strokeWidth={2} />
            <span className="text-[10px] tabular-nums">{task.comments}</span>
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" strokeWidth={2} />
            <span className="text-[10px] tabular-nums">{task.branches}</span>
          </span>
        </div>
        <div className="flex -space-x-1.5">
          {task.assignees.map((p, i) => (
            <Avatar key={i} person={p} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ColumnHeader({ col, count }: { col: ColumnDef; count: number }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 px-1">
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: col.color }}
        />
        {col.live && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: col.color }}
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </span>
      <span className="text-xs font-medium text-white/70">{col.name}</span>
      <span className="ml-auto rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white/40">
        {count}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------ main board --- */

export function KanbanBoard({
  tasks = DEFAULT_TASKS,
  intervalMs = 1900,
  className,
}: {
  tasks?: Task[];
  intervalMs?: number;
  className?: string;
}) {
  const [placement, setPlacement] = useState<number[]>(() =>
    tasks.map((t) => t.col)
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const cursor = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    setPlacement(tasks.map((t) => t.col));
    cursor.current = 0;
    setActiveId(null);
  }, [tasks]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      const i = cursor.current;
      setPlacement((prev) => {
        const next = prev.slice();
        next[i] = (next[i] + 1) % 3;
        return next;
      });
      setActiveId(tasks[i]?.id ?? null);
      cursor.current = (i + 1) % tasks.length;
    }, intervalMs);
    return () => clearInterval(id);
  }, [tasks, intervalMs, reduce]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080810] p-5",
        className
      )}
    >
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,108,255,0.22), transparent 70%)",
        }}
      />

      {/* header */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white shadow-lg"
            style={{
              backgroundImage: "linear-gradient(135deg, #7c6cff, #5b8cff)",
              boxShadow: "0 6px 18px -8px rgba(91,140,255,0.7)",
            }}
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div>
            <div className="text-sm font-semibold leading-tight text-white">
              Platform Sprint
            </div>
            <div className="text-[11px] leading-tight text-white/40">
              Cycle 24 · 6 tasks
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-glow"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[10px] font-medium text-white/55">Auto flow</span>
        </div>
      </div>

      {/* board */}
      <LayoutGroup>
        <div className="relative z-10 grid min-h-0 flex-1 grid-cols-3 gap-2.5">
          {COLUMNS.map((col, c) => {
            const items = tasks.filter((_, i) => placement[i] === c);
            return (
              <div
                key={col.name}
                className="flex min-h-0 flex-col rounded-xl border border-white/[0.06] bg-white/[0.015] p-2"
              >
                <ColumnHeader col={col} count={items.length} />
                <div className="flex flex-col gap-2.5">
                  {items.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      active={task.id === activeId}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

/* ------------------------------------------------------------------ demo --- */

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="h-[440px] w-full max-w-2xl">
        <KanbanBoard />
      </div>
    </div>
  );
}
