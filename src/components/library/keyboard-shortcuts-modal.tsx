"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Command, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type Shortcut = {
  /** Human label for the action, e.g. "Go to file". */
  action: string;
  /** Ordered display tokens for each keycap, e.g. ["⌘", "P"]. */
  keys: string[];
};

export type ShortcutGroup = {
  /** Section heading, e.g. "General". */
  title: string;
  items: Shortcut[];
};

/* -------------------------------------------------------------------------- */
/*  Motion constants                                                          */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.022, delayChildren: 0.08 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

// Guarantees glyph coverage for ⌘ ⇧ ⌥ ⌃ and arrows across platforms.
const KEY_FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";

/* -------------------------------------------------------------------------- */
/*  Keycap                                                                    */
/* -------------------------------------------------------------------------- */

function Keycap({ token }: { token: string }) {
  return (
    <kbd
      style={{
        fontFamily: KEY_FONT,
        backgroundImage:
          "linear-gradient(180deg, #23232e 0%, #17171e 60%, #131319 100%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.09), 0 1px 0 0 rgba(0,0,0,0.6), 0 2px 3px -1px rgba(0,0,0,0.55)",
      }}
      className={cn(
        "flex h-[25px] min-w-[25px] items-center justify-center rounded-[7px]",
        "border border-white/[0.08] px-[7px]",
        "text-[11.5px] font-medium leading-none tabular-nums text-zinc-300"
      )}
    >
      {token}
    </kbd>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row                                                                       */
/* -------------------------------------------------------------------------- */

function ShortcutRow({ item }: { item: Shortcut }) {
  return (
    <motion.div
      variants={rowVariants}
      className="group flex items-center justify-between rounded-lg px-3 py-[7px] transition-colors duration-200 hover:bg-white/[0.035]"
    >
      <span className="text-[13px] text-zinc-400 transition-colors duration-200 group-hover:text-zinc-100">
        {item.action}
      </span>
      <div className="flex items-center gap-1">
        {item.keys.map((token, i) => (
          <Keycap key={`${item.action}-${i}`} token={token} />
        ))}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  KeyboardShortcutsModal                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A searchable keyboard-shortcut cheat sheet that springs into view over a
 * frosted backdrop. Positioned `absolute`, so its nearest positioned ancestor
 * must be `relative` (the demo container handles this). Search is a
 * controlled/uncontrolled hybrid: pass `query` + `onQueryChange` to control it,
 * or omit both to let the modal manage its own filter state. Escape and
 * backdrop clicks both request a close.
 */
export function KeyboardShortcutsModal({
  open,
  onClose,
  groups,
  query,
  onQueryChange,
  className,
}: {
  open: boolean;
  onClose: () => void;
  groups: ShortcutGroup[];
  query?: string;
  onQueryChange?: (value: string) => void;
  className?: string;
}) {
  const [innerQuery, setInnerQuery] = useState("");
  const q = query ?? innerQuery;
  const setQ = onQueryChange ?? setInnerQuery;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const needle = q.trim().toLowerCase();
  const total = useMemo(
    () => groups.reduce((sum, g) => sum + g.items.length, 0),
    [groups]
  );

  const filtered = useMemo(() => {
    if (!needle) return groups;
    return groups
      .map((g) => ({
        title: g.title,
        items: g.items.filter(
          (it) =>
            it.action.toLowerCase().includes(needle) ||
            it.keys.join(" ").toLowerCase().includes(needle)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, needle]);

  const matched = useMemo(
    () => filtered.reduce((sum, g) => sum + g.items.length, 0),
    [filtered]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Close shortcuts"
            onClick={onClose}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ksm-title"
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 12 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.9 }}
            className={cn(
              "relative z-10 flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel",
              "shadow-[0_40px_90px_-25px_rgba(0,0,0,0.95)]",
              className
            )}
          >
            {/* idle glow so a frozen frame still reads as alive */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% -8%, rgba(124,108,255,0.15), transparent 55%)",
              }}
              animate={{ opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* thin bright top edge with a slow sweep */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
              <motion.div
                className="h-px w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                animate={{ x: ["-130%", "390%"] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1.6,
                }}
              />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between px-5 pt-[18px] pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand-soft">
                  <Command className="h-4 w-4" strokeWidth={2} />
                </div>
                <div>
                  <h3 id="ksm-title" className="text-sm font-semibold text-white">
                    Keyboard shortcuts
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {needle ? `${matched} of ${total} match` : `${total} shortcuts`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative px-5 pb-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/25">
                <Search className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={2} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Search commands"
                  placeholder="Search commands"
                  className="w-full bg-transparent text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                />
                <span className="shrink-0">
                  <Keycap token="Esc" />
                </span>
              </div>
            </div>

            {/* List */}
            <div
              className="no-scrollbar relative max-h-[252px] overflow-y-auto px-3 pb-4"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 18px), transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 18px), transparent 100%)",
              }}
            >
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-1 px-4 py-10 text-center">
                  <p className="text-[13px] font-medium text-zinc-300">
                    No commands found
                  </p>
                  <p className="text-xs text-zinc-500">
                    Nothing matches &ldquo;{q}&rdquo;. Try another term.
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4 pt-1"
                >
                  {filtered.map((group) => (
                    <div key={group.title} className="flex flex-col">
                      <motion.div
                        variants={rowVariants}
                        className="px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-600"
                      >
                        {group.title}
                      </motion.div>
                      <div className="flex flex-col">
                        {group.items.map((item) => (
                          <ShortcutRow key={item.action} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Demo                                                                      */
/* -------------------------------------------------------------------------- */

const DEMO_GROUPS: ShortcutGroup[] = [
  {
    title: "General",
    items: [
      { action: "Open command menu", keys: ["⌘", "K"] },
      { action: "Go to file", keys: ["⌘", "P"] },
      { action: "Toggle sidebar", keys: ["⌘", "B"] },
      { action: "Open settings", keys: ["⌘", ","] },
    ],
  },
  {
    title: "Editing",
    items: [
      { action: "Save file", keys: ["⌘", "S"] },
      { action: "Format document", keys: ["⇧", "⌥", "F"] },
      { action: "Toggle comment", keys: ["⌘", "/"] },
      { action: "Add cursor below", keys: ["⌘", "⌥", "↓"] },
    ],
  },
  {
    title: "Navigation",
    items: [
      { action: "Go to definition", keys: ["F12"] },
      { action: "Switch tab", keys: ["⌃", "Tab"] },
      { action: "Go to line", keys: ["⌃", "G"] },
      { action: "Find in files", keys: ["⌘", "⇧", "F"] },
    ],
  },
  {
    title: "View",
    items: [
      { action: "Toggle terminal", keys: ["⌃", "`"] },
      { action: "Split editor", keys: ["⌘", "\\"] },
      { action: "Zen mode", keys: ["⌘", "K", "Z"] },
      { action: "Full screen", keys: ["⌃", "⌘", "F"] },
    ],
  },
];

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(true);
  const [query, setQuery] = useState("");

  // Springy open/close on a loop for the static preview. Any real
  // interaction stops it so the component feels live, not scripted.
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setOpen((o) => !o), open ? 4400 : 1500);
    return () => clearTimeout(t);
  }, [auto, open]);

  // Reset the filter whenever the sheet closes.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleOpen = () => {
    setAuto(false);
    setOpen(true);
  };
  const handleClose = () => {
    setAuto(false);
    setOpen(false);
  };
  const handleQuery = (value: string) => {
    setAuto(false);
    setQuery(value);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-6">
      {/* ambient depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 55% at 50% 0%, rgba(91,140,255,0.08), transparent 60%)",
        }}
      />

      {/* trigger sits behind the frosted backdrop */}
      <div className="relative">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-2xl bg-brand/20 blur-2xl"
          animate={{ opacity: [0.2, 0.42, 0.2] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.button
          type="button"
          onClick={handleOpen}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative flex items-center gap-2.5 rounded-xl border border-white/10 bg-panel px-4 py-2.5 text-[13px] font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <Command className="h-4 w-4 text-brand-soft" strokeWidth={2} />
          Show shortcuts
          <span className="ml-1 flex items-center gap-1">
            <Keycap token="⌘" />
            <Keycap token="/" />
          </span>
        </motion.button>
      </div>

      <KeyboardShortcutsModal
        open={open}
        onClose={handleClose}
        groups={DEMO_GROUPS}
        query={query}
        onQueryChange={handleQuery}
      />
    </div>
  );
}
