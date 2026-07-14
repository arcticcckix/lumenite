"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Copy,
  ClipboardPaste,
  PenLine,
  FolderInput,
  Trash2,
  ChevronRight,
  MousePointer2,
  MousePointerClick,
  Folder,
  Users,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Lucide icons satisfy this shape without importing extra type exports. */
type MenuIcon = ComponentType<{
  className?: string;
  size?: number | string;
  strokeWidth?: number;
}>;

export type SubMenuItem = {
  id: string;
  label: string;
  icon: MenuIcon;
};

export type ItemEntry = {
  kind?: "item";
  id: string;
  label: string;
  icon: MenuIcon;
  shortcut?: string;
  danger?: boolean;
  submenu?: SubMenuItem[];
};

export type ContextMenuEntry = ItemEntry | { kind: "separator" };

const MENU_W = 236;
const SUB_W = 190;
const ROW_H = 36;
const SEP_H = 9;
const PAD = 6;

const round = (n: number) => Math.round(n);
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(n, lo), hi);

function isItem(e: ContextMenuEntry): e is ItemEntry {
  return e.kind !== "separator";
}

type OpenState = {
  /** cursor position as a fraction of the surface, 0..100 */
  xPct: number;
  yPct: number;
  /** bumped on every fresh open so the panel re-mounts and re-springs */
  cycle: number;
};

type Frame = {
  open: boolean;
  xPct?: number;
  yPct?: number;
  activeId: string | null;
  sub: boolean;
  subActiveId: string | null;
  hold: number;
};

export function ContextMenu({
  entries,
  hint = "A native-feeling menu that springs from the cursor",
  autoplay = false,
  className,
}: {
  entries: ContextMenuEntry[];
  hint?: string;
  /** Drives a scripted open/hover loop so a static preview looks alive. */
  autoplay?: boolean;
  className?: string;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<OpenState>({ xPct: 30, yPct: 24, cycle: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [subOpen, setSubOpen] = useState(false);
  const [subActiveId, setSubActiveId] = useState<string | null>(null);

  const items = useMemo(() => entries.filter(isItem), [entries]);

  /* deterministic menu height from the entry list (no DOM measuring) */
  const menuH = useMemo(
    () =>
      entries.reduce((h, e) => h + (e.kind === "separator" ? SEP_H : ROW_H), PAD * 2),
    [entries]
  );

  /* vertical offset of a submenu row's top edge inside the panel */
  const subTopFor = useMemo(() => {
    const map: Record<string, number> = {};
    let acc = PAD;
    for (const e of entries) {
      if (e.kind === "separator") {
        acc += SEP_H;
        continue;
      }
      map[e.id] = acc;
      acc += ROW_H;
    }
    return map;
  }, [entries]);

  /* observe the surface so the pct -> px math stays correct on resize */
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* build a lively, generic timeline straight from the entries */
  const frames = useMemo<Frame[]>(() => {
    if (!autoplay || items.length === 0) return [];
    const anchors = [
      { x: 27, y: 22 },
      { x: 55, y: 40 },
    ];
    const out: Frame[] = [];
    anchors.forEach((a) => {
      out.push({
        open: true,
        xPct: a.x,
        yPct: a.y,
        activeId: null,
        sub: false,
        subActiveId: null,
        hold: 460,
      });
      items.forEach((it) => {
        out.push({
          open: true,
          activeId: it.id,
          sub: false,
          subActiveId: null,
          hold: 560,
        });
        if (it.submenu && it.submenu.length > 0) {
          out.push({
            open: true,
            activeId: it.id,
            sub: true,
            subActiveId: null,
            hold: 460,
          });
          it.submenu.forEach((s) => {
            out.push({
              open: true,
              activeId: it.id,
              sub: true,
              subActiveId: s.id,
              hold: 620,
            });
          });
        }
      });
      out.push({
        open: false,
        activeId: null,
        sub: false,
        subActiveId: null,
        hold: 520,
      });
    });
    return out;
  }, [autoplay, items]);

  /* run the timeline with self-scheduling timeouts */
  useEffect(() => {
    if (!autoplay || frames.length === 0) return;
    let i = 0;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const run = () => {
      if (!alive) return;
      const f = frames[i];
      if (f.open && f.xPct !== undefined && f.yPct !== undefined) {
        setPos((p) => ({ xPct: f.xPct!, yPct: f.yPct!, cycle: p.cycle + 1 }));
      }
      setOpen(f.open);
      setActiveId(f.activeId);
      setSubOpen(f.sub);
      setSubActiveId(f.subActiveId);
      timer = setTimeout(() => {
        i = (i + 1) % frames.length;
        run();
      }, f.hold);
    };
    run();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [autoplay, frames]);

  /* close on escape / outside click for genuine right-click usage */
  useEffect(() => {
    if (autoplay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!surfaceRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [autoplay]);

  function onContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    if (autoplay) return;
    e.preventDefault();
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos((p) => ({
      xPct: ((e.clientX - rect.left) / rect.width) * 100,
      yPct: ((e.clientY - rect.top) / rect.height) * 100,
      cycle: p.cycle + 1,
    }));
    setActiveId(null);
    setSubOpen(false);
    setSubActiveId(null);
    setOpen(true);
  }

  /* geometry: cursor point in px, then a clamped top-left for the panel */
  const px = (pos.xPct / 100) * size.w;
  const py = (pos.yPct / 100) * size.h;
  const left = clamp(px, 12, Math.max(12, size.w - MENU_W - 12));
  const top = clamp(py, 12, Math.max(12, size.h - menuH - 12));
  const originX = round(clamp(px - left, 6, MENU_W - 6));
  const originY = round(clamp(py - top, 6, menuH - 6));

  const activeEntry = items.find((it) => it.id === activeId);
  const openLeft = left + MENU_W + SUB_W + 12 > size.w;

  return (
    <div
      ref={surfaceRef}
      onContextMenu={onContextMenu}
      className={cn(
        "relative h-full w-full select-none overflow-hidden rounded-2xl border border-white/10 bg-panel [cursor:context-menu]",
        className
      )}
    >
      {/* texture: faint dot grid + a single corner glow, kept restrained */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(120% 120% at 50% 45%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 45%, #000 35%, transparent 78%)",
        }}
      />
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand/12 blur-[80px]" />

      {/* rest-state hint, sits behind the menu */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <MousePointerClick size={19} strokeWidth={1.75} />
        </div>
        <div>
          <div className="text-[13.5px] font-medium tracking-tight text-zinc-300">
            right click me
          </div>
          <div className="mt-1 text-[11.5px] leading-relaxed text-zinc-600">
            {hint}
          </div>
        </div>
      </div>

      {/* scripted cursor + click ripple, only while autoplaying */}
      {autoplay && size.w > 0 && (
        <>
          <AnimatePresence>
            {open && (
              <motion.span
                key={`ripple-${pos.cycle}`}
                className="pointer-events-none absolute z-30 rounded-full border border-brand/50"
                style={{
                  left: round(px),
                  top: round(py),
                  width: 34,
                  height: 34,
                  marginLeft: -17,
                  marginTop: -17,
                }}
                initial={{ scale: 0.2, opacity: 0.55 }}
                animate={{ scale: 1.15, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </AnimatePresence>
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-40"
            animate={{ x: round(px) - 2, y: round(py) - 2 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.7 }}
          >
            <MousePointer2
              size={18}
              strokeWidth={1.5}
              className="fill-white text-void drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </>
      )}

      {/* the menu */}
      <AnimatePresence>
        {open && size.w > 0 && (
          <motion.div
            key={`menu-${pos.cycle}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 470, damping: 34, mass: 0.7 }}
            style={{
              left: round(left),
              top: round(top),
              width: MENU_W,
              transformOrigin: `${originX}px ${originY}px`,
            }}
            className="absolute z-30 overflow-visible rounded-xl border border-white/10 bg-[#0c0c13]/92 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* top hairline */}
            <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {entries.map((entry, i) => {
              if (entry.kind === "separator") {
                return (
                  <div
                    key={`sep-${i}`}
                    className="mx-1 my-1 h-px bg-white/[0.07]"
                  />
                );
              }
              const active = entry.id === activeId;
              const Icon = entry.icon;
              const hasSub = !!entry.submenu && entry.submenu.length > 0;
              return (
                <div
                  key={entry.id}
                  onMouseEnter={
                    autoplay
                      ? undefined
                      : () => {
                          setActiveId(entry.id);
                          setSubOpen(hasSub);
                          setSubActiveId(null);
                        }
                  }
                  className="relative flex h-9 cursor-default items-center gap-2.5 rounded-lg px-2.5"
                >
                  {active && (
                    <motion.div
                      layoutId="ctx-active"
                      className={cn(
                        "absolute inset-0 rounded-lg border",
                        entry.danger
                          ? "border-rose-500/25 bg-rose-500/10"
                          : "border-white/[0.08] bg-white/[0.05]"
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 560,
                        damping: 42,
                        mass: 0.55,
                      }}
                    >
                      <span
                        className={cn(
                          "absolute inset-y-1.5 left-0 w-[3px] rounded-full",
                          entry.danger
                            ? "bg-rose-400"
                            : "bg-gradient-to-b from-brand to-glow"
                        )}
                      />
                    </motion.div>
                  )}

                  <Icon
                    size={15}
                    strokeWidth={2}
                    className={cn(
                      "relative z-10 shrink-0 transition-colors duration-200",
                      entry.danger
                        ? active
                          ? "text-rose-300"
                          : "text-rose-400/70"
                        : active
                          ? "text-white"
                          : "text-zinc-400"
                    )}
                  />
                  <span
                    className={cn(
                      "relative z-10 flex-1 truncate text-[13px] transition-colors duration-200",
                      entry.danger
                        ? active
                          ? "text-rose-200"
                          : "text-rose-300/80"
                        : active
                          ? "text-white"
                          : "text-zinc-300"
                    )}
                  >
                    {entry.label}
                  </span>

                  {hasSub ? (
                    <ChevronRight
                      size={14}
                      strokeWidth={2.2}
                      className={cn(
                        "relative z-10 shrink-0 transition-colors duration-200",
                        active ? "text-zinc-300" : "text-zinc-600"
                      )}
                    />
                  ) : entry.shortcut ? (
                    <span
                      className={cn(
                        "relative z-10 shrink-0 text-[11px] tracking-wide transition-colors duration-200",
                        active ? "text-zinc-300" : "text-zinc-600"
                      )}
                    >
                      {entry.shortcut}
                    </span>
                  ) : null}
                </div>
              );
            })}

            {/* submenu flyout */}
            <AnimatePresence>
              {subOpen && activeEntry?.submenu && (
                <motion.div
                  key={`sub-${activeEntry.id}`}
                  initial={{ opacity: 0, scale: 0.94, x: openLeft ? 6 : -6 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    type: "spring",
                    stiffness: 520,
                    damping: 36,
                    mass: 0.6,
                  }}
                  style={{
                    width: SUB_W,
                    top: round(
                      clamp(
                        (subTopFor[activeEntry.id] ?? PAD) - PAD,
                        0,
                        Math.max(0, size.h - top - 120 - 12)
                      )
                    ),
                    left: openLeft ? undefined : MENU_W - 4,
                    right: openLeft ? MENU_W - 4 : undefined,
                    transformOrigin: openLeft ? "right top" : "left top",
                  }}
                  className="absolute overflow-hidden rounded-xl border border-white/10 bg-[#0c0c13]/94 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
                >
                  <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="px-2 pb-1 pt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    {activeEntry.label}
                  </div>
                  {activeEntry.submenu.map((s) => {
                    const sActive = s.id === subActiveId;
                    const SIcon = s.icon;
                    return (
                      <div
                        key={s.id}
                        onMouseEnter={
                          autoplay ? undefined : () => setSubActiveId(s.id)
                        }
                        className="relative flex h-9 cursor-default items-center gap-2.5 rounded-lg px-2.5"
                      >
                        {sActive && (
                          <motion.div
                            layoutId="ctx-sub-active"
                            className="absolute inset-0 rounded-lg border border-white/[0.08] bg-white/[0.05]"
                            transition={{
                              type: "spring",
                              stiffness: 560,
                              damping: 42,
                              mass: 0.55,
                            }}
                          />
                        )}
                        <SIcon
                          size={15}
                          strokeWidth={2}
                          className={cn(
                            "relative z-10 shrink-0 transition-colors duration-200",
                            sActive ? "text-brand-soft" : "text-zinc-400"
                          )}
                        />
                        <span
                          className={cn(
                            "relative z-10 flex-1 truncate text-[13px] transition-colors duration-200",
                            sActive ? "text-white" : "text-zinc-300"
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEMO_ENTRIES: ContextMenuEntry[] = [
  { id: "cut", label: "Cut", icon: Scissors, shortcut: "⌘X" },
  { id: "copy", label: "Copy", icon: Copy, shortcut: "⌘C" },
  { id: "paste", label: "Paste", icon: ClipboardPaste, shortcut: "⌘V" },
  { kind: "separator" },
  { id: "rename", label: "Rename", icon: PenLine, shortcut: "⏎" },
  {
    id: "move",
    label: "Move to",
    icon: FolderInput,
    submenu: [
      { id: "projects", label: "Projects", icon: Folder },
      { id: "team", label: "Team space", icon: Users },
      { id: "archive", label: "Archive", icon: Archive },
    ],
  },
  { kind: "separator" },
  { id: "delete", label: "Delete", icon: Trash2, shortcut: "⌫", danger: true },
];

export default function Demo() {
  return (
    <div className="relative h-full w-full p-4">
      <ContextMenu autoplay entries={DEMO_ENTRIES} />
    </div>
  );
}
