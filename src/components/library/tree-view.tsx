"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Braces,
  ChevronRight,
  FileCode2,
  FileText,
  Folder,
  FolderGit2,
  FolderOpen,
  GitBranch,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export type FileKind = "folder" | "tsx" | "ts" | "css" | "json" | "md";

export interface TreeNode {
  id: string;
  name: string;
  kind: FileKind;
  children?: TreeNode[];
}

const FILE_META: Record<Exclude<FileKind, "folder">, { Icon: LucideIcon; color: string }> = {
  tsx: { Icon: FileCode2, color: "#6ea8ff" },
  ts: { Icon: FileCode2, color: "#4d90d9" },
  css: { Icon: Hash, color: "#c084fc" },
  json: { Icon: Braces, color: "#e0b352" },
  md: { Icon: FileText, color: "#8b8b99" },
};

function findPath(nodes: TreeNode[], id: string): TreeNode[] | null {
  for (const node of nodes) {
    if (node.id === id) return [node];
    if (node.children) {
      const sub = findPath(node.children, id);
      if (sub) return [node, ...sub];
    }
  }
  return null;
}

interface BranchProps {
  node: TreeNode;
  depth: number;
  expanded: string[];
  selected: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

function Branch({ node, depth, expanded, selected, onToggle, onSelect }: BranchProps) {
  const isFolder = node.kind === "folder";
  const open = expanded.includes(node.id);
  const isSelected = selected === node.id;
  const meta = node.kind === "folder" ? null : FILE_META[node.kind];

  const paddingLeft = 10 + depth * 16;
  const railLeft = 17 + depth * 16;

  return (
    <div>
      <button
        type="button"
        onClick={() => (isFolder ? onToggle(node.id) : onSelect(node.id))}
        aria-expanded={isFolder ? open : undefined}
        style={{ paddingLeft }}
        className={cn(
          "relative flex w-full items-center gap-2 py-[7px] pr-3 text-left outline-none transition-colors duration-200",
          isSelected
            ? "bg-gradient-to-r from-brand/[0.16] via-brand/[0.06] to-transparent text-white"
            : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
        )}
      >
        {isSelected && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute inset-y-1 left-0 w-[2px] rounded-full bg-gradient-to-b from-brand to-glow shadow-[0_0_8px_rgba(124,108,255,0.7)]"
          />
        )}

        {isFolder ? (
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-zinc-500"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
          </motion.span>
        ) : (
          <span aria-hidden className="h-3.5 w-3.5 shrink-0" />
        )}

        {isFolder ? (
          open ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-brand-soft" strokeWidth={2} />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={2} />
          )
        ) : (
          meta && (
            <meta.Icon
              className="h-4 w-4 shrink-0"
              strokeWidth={2}
              style={{ color: meta.color }}
            />
          )
        )}

        <span
          className={cn(
            "truncate font-mono text-[13px] tracking-tight",
            isSelected ? "text-white" : isFolder ? "text-zinc-300" : undefined
          )}
        >
          {node.name}
        </span>

        {isFolder && node.children && (
          <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-zinc-600">
            {node.children.length}
          </span>
        )}
      </button>

      {isFolder && (
        <AnimatePresence initial={false}>
          {open && node.children && (
            <motion.div
              key="children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="relative overflow-hidden"
            >
              {node.children.map((child) => (
                <Branch
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  expanded={expanded}
                  selected={selected}
                  onToggle={onToggle}
                  onSelect={onSelect}
                />
              ))}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-1 top-0 w-px bg-white/[0.06]"
                style={{ left: railLeft }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

export interface TreeViewProps {
  data: TreeNode[];
  expandedIds?: string[];
  selectedId?: string | null;
  onToggle?: (id: string) => void;
  onSelect?: (id: string) => void;
  title?: string;
  className?: string;
}

export function TreeView({
  data,
  expandedIds,
  selectedId = null,
  onToggle,
  onSelect,
  title = "lumenite-ui",
  className,
}: TreeViewProps) {
  const expanded = expandedIds ?? [];
  const toggle = onToggle ?? (() => {});
  const select = onSelect ?? (() => {});
  const path = selectedId ? findPath(data, selectedId) : null;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_24px_60px_-24px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-brand-soft" strokeWidth={2} />
          <span className="font-mono text-[13px] text-zinc-300">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
          <GitBranch className="h-3 w-3 text-zinc-500" strokeWidth={2} />
          <span className="font-mono text-[11px] text-zinc-500">main</span>
        </div>
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="no-scrollbar relative flex-1 overflow-y-auto py-2"
      >
        {data.map((node) => (
          <motion.div key={node.id} variants={itemVariants}>
            <Branch
              node={node}
              depth={0}
              expanded={expanded}
              selected={selectedId}
              onToggle={toggle}
              onSelect={select}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center gap-1.5 overflow-hidden border-t border-white/[0.06] px-4 py-2.5">
        {path ? (
          path.map((n, i) => (
            <div key={n.id} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  aria-hidden
                  className="h-3 w-3 shrink-0 text-zinc-600"
                  strokeWidth={2}
                />
              )}
              <span
                className={cn(
                  "truncate font-mono text-[11px]",
                  i === path.length - 1 ? "text-brand-soft" : "text-zinc-500"
                )}
              >
                {n.name}
              </span>
            </div>
          ))
        ) : (
          <span className="font-mono text-[11px] text-zinc-600">no file selected</span>
        )}
      </div>
    </div>
  );
}

const DEMO_TREE: TreeNode[] = [
  {
    id: "app",
    name: "app",
    kind: "folder",
    children: [
      { id: "layout", name: "layout.tsx", kind: "tsx" },
      { id: "page", name: "page.tsx", kind: "tsx" },
      { id: "globals", name: "globals.css", kind: "css" },
    ],
  },
  {
    id: "components",
    name: "components",
    kind: "folder",
    children: [
      {
        id: "ui",
        name: "ui",
        kind: "folder",
        children: [
          { id: "button", name: "button.tsx", kind: "tsx" },
          { id: "card", name: "card.tsx", kind: "tsx" },
        ],
      },
      { id: "header", name: "site-header.tsx", kind: "tsx" },
    ],
  },
  {
    id: "lib",
    name: "lib",
    kind: "folder",
    children: [
      { id: "utils", name: "utils.ts", kind: "ts" },
      { id: "useTree", name: "use-tree.ts", kind: "ts" },
    ],
  },
  { id: "pkg", name: "package.json", kind: "json" },
  { id: "readme", name: "README.md", kind: "md" },
];

interface Step {
  expanded: string[];
  selected: string;
}

const STEPS: Step[] = [
  { expanded: ["components", "ui"], selected: "button" },
  { expanded: ["components", "ui"], selected: "card" },
  { expanded: ["components"], selected: "header" },
  { expanded: ["lib"], selected: "utils" },
  { expanded: ["lib"], selected: "useTree" },
  { expanded: ["app"], selected: "page" },
  { expanded: ["app"], selected: "globals" },
  { expanded: [], selected: "pkg" },
];

export default function Demo() {
  const steps = useMemo(() => STEPS, []);
  const [expanded, setExpanded] = useState<string[]>(steps[0].expanded);
  const [selected, setSelected] = useState<string>(steps[0].selected);
  const [paused, setPaused] = useState(false);
  const stepRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      stepRef.current = (stepRef.current + 1) % steps.length;
      const next = steps[stepRef.current];
      setExpanded(next.expanded);
      setSelected(next.selected);
    }, 2000);
    return () => window.clearInterval(id);
  }, [paused, steps]);

  function handleToggle(id: string) {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[110px]"
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative z-10 h-[384px] w-full max-w-sm"
      >
        <TreeView
          data={DEMO_TREE}
          expandedIds={expanded}
          selectedId={selected}
          onToggle={handleToggle}
          onSelect={setSelected}
        />
      </motion.div>
    </div>
  );
}
