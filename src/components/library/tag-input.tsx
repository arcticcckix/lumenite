"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Delete, Hash, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const GLOW_REST = "0 0 0 1px rgba(255,255,255,0.06)";
const GLOW_A =
  "0 0 0 1px rgba(124,108,255,0.34), 0 10px 42px -14px rgba(124,108,255,0.28)";
const GLOW_B =
  "0 0 0 1px rgba(124,108,255,0.52), 0 12px 46px -12px rgba(124,108,255,0.44)";

export interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange?: (value: string) => void;
  onAdd?: (tag: string) => void;
  onRemove?: (index: number) => void;
  suggestions?: string[];
  onPick?: (tag: string) => void;
  placeholder?: string;
  label?: string;
  /** Force the focus-ring glow on (used by the autoplay demo). Falls back to internal focus. */
  active?: boolean;
  /** Force the caret visible. Falls back to the active/focus state. */
  showCaret?: boolean;
  /** Enable keyboard editing on the field. Suggestion picks and chip removal stay live regardless. */
  interactive?: boolean;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  suggestions = [],
  onPick,
  placeholder = "Type a tag and press enter",
  label,
  active,
  showCaret,
  interactive = true,
  maxTags = 12,
  className,
}: TagInputProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const isActive = active ?? focused;
  const caretOn = showCaret ?? isActive;

  function commit() {
    const value = inputValue.trim();
    if (!value || tags.length >= maxTags) return;
    if (!tags.includes(value)) onAdd?.(value);
    onInputChange?.("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace") {
      if (inputValue.length > 0) {
        e.preventDefault();
        onInputChange?.(inputValue.slice(0, -1));
      } else if (tags.length > 0) {
        e.preventDefault();
        onRemove?.(tags.length - 1);
      }
    } else if (
      e.key.length === 1 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      tags.length < maxTags
    ) {
      e.preventDefault();
      onInputChange?.(inputValue + e.key);
    }
  }

  const openSuggestions = suggestions.filter((s) => !tags.includes(s));
  const showPlaceholder = !isActive && inputValue === "" && tags.length === 0;

  return (
    <div className={cn("w-full select-none", className)}>
      {label && (
        <div className="mb-2 flex items-center gap-1.5 pl-0.5 text-xs font-medium text-zinc-500">
          <Hash className="h-3.5 w-3.5 text-zinc-600" strokeWidth={2.2} />
          <span>{label}</span>
        </div>
      )}

      <motion.div
        ref={fieldRef}
        role="textbox"
        aria-label={label ?? "Tag input"}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseDown={() => interactive && fieldRef.current?.focus()}
        animate={{ boxShadow: isActive ? [GLOW_A, GLOW_B, GLOW_A] : GLOW_REST }}
        transition={
          isActive
            ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.35, ease: EASE }
        }
        className="relative cursor-text rounded-xl bg-panel px-2.5 py-2 outline-none"
      >
        <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        <div className="flex flex-wrap items-center gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.7, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: -6 }}
                transition={{ type: "spring", stiffness: 520, damping: 32, mass: 0.7 }}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-1 pl-2 pr-1 text-[13px] font-medium text-zinc-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-brand to-glow" />
                <span className="tracking-tight">{tag}</span>
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRemove?.(i)}
                  className="ml-0.5 flex h-4 w-4 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3 w-3" strokeWidth={2.4} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          <motion.div
            layout
            className="flex min-w-[3px] flex-1 items-center py-1 pl-1 text-[13px]"
          >
            {inputValue !== "" && (
              <span className="whitespace-pre text-white/90">{inputValue}</span>
            )}
            {showPlaceholder && (
              <span className="text-zinc-600">{placeholder}</span>
            )}
            {caretOn && (
              <motion.span
                aria-hidden
                className="ml-px inline-block h-4 w-[2px] shrink-0 rounded-full bg-brand"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{
                  duration: 1.1,
                  ease: "linear",
                  repeat: Infinity,
                  times: [0, 0.5, 0.5, 1],
                }}
              />
            )}
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-zinc-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <kbd className="flex h-4 items-center justify-center rounded border border-white/10 bg-white/[0.03] px-1">
              <CornerDownLeft className="h-2.5 w-2.5" strokeWidth={2.4} />
            </kbd>
            add
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="flex h-4 items-center justify-center rounded border border-white/10 bg-white/[0.03] px-1">
              <Delete className="h-2.5 w-2.5" strokeWidth={2.4} />
            </kbd>
            remove
          </span>
        </div>
        <span className="tabular-nums text-zinc-500">
          {tags.length} / {maxTags}
        </span>
      </div>

      {openSuggestions.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 pl-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600">
            Suggested
          </div>
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence mode="popLayout" initial={false}>
              {openSuggestions.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onPick?.(s)}
                  className="inline-flex items-center gap-1 rounded-lg border border-dashed border-white/12 bg-transparent px-2 py-1 text-[12px] text-zinc-500 transition-colors hover:border-brand/40 hover:bg-brand/[0.06] hover:text-brand-soft"
                >
                  <Plus className="h-3 w-3" strokeWidth={2.4} />
                  {s}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

const INITIAL_TAGS = ["react", "next.js", "typescript", "motion"];
const TYPE_POOL = [
  "tailwind",
  "framer",
  "vercel",
  "zod",
  "prisma",
  "trpc",
  "radix",
  "eslint",
];
const SUGGESTIONS = ["tailwind", "supabase", "vitest", "storybook"];
const MAX_VISIBLE = 7;
const MAX_TAGS = 12;

export default function Demo() {
  const [tags, setTags] = useState<string[]>(INITIAL_TAGS);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    let wordIndex = 0;
    let charIndex = 0;
    let adds = 0;

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (alive) fn();
      }, ms);
    };

    const typeChar = () => {
      const word = TYPE_POOL[wordIndex % TYPE_POOL.length];
      charIndex += 1;
      setDraft(word.slice(0, charIndex));
      if (charIndex < word.length) {
        schedule(typeChar, 72 + (charIndex % 3) * 26);
      } else {
        schedule(commit, 480);
      }
    };

    const commit = () => {
      const word = TYPE_POOL[wordIndex % TYPE_POOL.length];
      setDraft("");
      setTags((prev) => {
        if (prev.includes(word)) return prev;
        const next = [...prev, word];
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
      });
      wordIndex += 1;
      charIndex = 0;
      adds += 1;
      if (adds % 2 === 0) schedule(removeOne, 1000);
      else schedule(typeChar, 1150);
    };

    const removeOne = () => {
      setTags((prev) =>
        prev.length <= 3 ? prev : [prev[0], ...prev.slice(2)]
      );
      schedule(typeChar, 1050);
    };

    schedule(typeChar, 1300);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const handleRemove = (index: number) =>
    setTags((prev) => prev.filter((_, i) => i !== index));

  const handlePick = (tag: string) =>
    setTags((prev) => {
      if (prev.includes(tag) || prev.length >= MAX_TAGS) return prev;
      const next = [...prev, tag];
      return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
    });

  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-8">
      <div className="w-full max-w-md">
        <TagInput
          tags={tags}
          inputValue={draft}
          onRemove={handleRemove}
          onPick={handlePick}
          suggestions={SUGGESTIONS}
          label="Project stack"
          active
          showCaret
          interactive={false}
          maxTags={MAX_TAGS}
        />
      </div>
    </div>
  );
}
