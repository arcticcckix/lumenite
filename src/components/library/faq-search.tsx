"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSearchProps {
  items: FaqItem[];
  /** Queries the field types on a loop to demo the search. Omit for a static list. */
  autoQueries?: string[];
  placeholder?: string;
  className?: string;
}

type Phase = "typing" | "holding" | "deleting";

const EASE = [0.16, 1, 0.3, 1] as const;

function highlightText(text: string, query: string): React.ReactNode {
  const needle = query.trim().toLowerCase();
  if (needle === "") return text;

  const haystack = text.toLowerCase();
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  let found = haystack.indexOf(needle, cursor);

  while (found !== -1) {
    if (found > cursor) nodes.push(text.slice(cursor, found));
    nodes.push(
      <mark
        key={key++}
        className="rounded-[3px] bg-brand/25 px-0.5 text-brand-soft"
      >
        {text.slice(found, found + needle.length)}
      </mark>
    );
    cursor = found + needle.length;
    found = haystack.indexOf(needle, cursor);
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export function FaqSearch({
  items,
  autoQueries = [],
  placeholder = "Search components, tokens, licensing",
  className,
}: FaqSearchProps) {
  const [queryIndex, setQueryIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [openId, setOpenId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const hasAuto = autoQueries.length > 0;
  const target = hasAuto ? autoQueries[queryIndex % autoQueries.length] : "";
  const query = target.slice(0, charCount);

  // Drive the typing / holding / deleting loop.
  useEffect(() => {
    if (!hasAuto || paused) return;

    let delay: number;
    let advance: () => void;

    if (phase === "typing") {
      if (charCount < target.length) {
        delay = 78;
        advance = () => setCharCount((c) => c + 1);
      } else {
        delay = 1500;
        advance = () => setPhase("holding");
      }
    } else if (phase === "holding") {
      delay = 1400;
      advance = () => setPhase("deleting");
    } else {
      if (charCount > 0) {
        delay = 34;
        advance = () => setCharCount((c) => c - 1);
      } else {
        delay = 420;
        advance = () => {
          setQueryIndex((i) => (i + 1) % autoQueries.length);
          setPhase("typing");
        };
      }
    }

    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [hasAuto, paused, phase, charCount, target, autoQueries.length]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return items;
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(needle) ||
        item.answer.toLowerCase().includes(needle)
    );
  }, [items, query]);

  const firstMatch = filtered.length > 0 ? filtered[0].question : null;

  // Auto-expand the top result once the query settles; collapse while typing.
  // Skipped while paused so a reader's manual expansion stays put.
  useEffect(() => {
    if (paused) return;
    setOpenId(phase === "holding" && hasAuto ? firstMatch : null);
  }, [paused, phase, hasAuto, firstMatch]);

  const active = query.trim() !== "";

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 opacity-70 blur-2xl [background:radial-gradient(58%_46%_at_50%_0%,rgba(124,108,255,0.16),transparent_72%)]"
      />

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex h-[392px] flex-col overflow-hidden rounded-2xl border border-line bg-panel"
      >
        <div className="shrink-0 border-b border-line/70 px-4 pb-4 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              Help center
            </span>
            <span className="text-[11px] tabular-nums text-zinc-500">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-2.5 rounded-xl border bg-surface/70 px-3 py-2.5 transition-colors duration-300",
              active
                ? "border-brand/40 shadow-[0_0_0_1px_rgba(124,108,255,0.14),0_10px_34px_-16px_rgba(124,108,255,0.45)]"
                : "border-line"
            )}
          >
            <Search className="h-4 w-4 shrink-0 text-zinc-500" />
            <div className="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap text-sm text-zinc-100">
              <span className="whitespace-pre">{query}</span>
              <motion.span
                aria-hidden
                className="ml-px inline-block h-4 w-[1.5px] shrink-0 rounded-full bg-brand-soft"
                animate={{ opacity: paused ? 1 : [1, 1, 0, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.5, 0.5, 1],
                }}
              />
              {query === "" && (
                <span className="ml-1.5 text-zinc-600">{placeholder}</span>
              )}
            </div>
          </div>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((item) => {
              const isOpen = openId === item.question;
              return (
                <motion.div
                  key={item.question}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="overflow-hidden rounded-xl border border-transparent hover:border-line hover:bg-white/[0.02]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenId((cur) =>
                        cur === item.question ? null : item.question
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                  >
                    <span className="text-[13px] font-medium leading-snug text-zinc-100">
                      {highlightText(item.question, query)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={cn(
                        "shrink-0 transition-colors",
                        isOpen ? "text-brand-soft" : "text-zinc-600"
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-3 pb-3 text-[12.5px] leading-relaxed text-zinc-400">
                          {highlightText(item.answer, query)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center gap-1 py-10 text-center"
            >
              <p className="text-sm text-zinc-400">No matching answers</p>
              <p className="text-xs text-zinc-600">
                Try a shorter or different keyword
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

const DEMO_ITEMS: FaqItem[] = [
  {
    question: "How do I install a component?",
    answer:
      "Copy the single component file into your project, or pull it with the CLI. Each file is self contained, so there is no runtime package to install and nothing to configure.",
  },
  {
    question: "Does it support dark mode?",
    answer:
      "Yes. Every component is designed dark first against the void palette and reads its colors from CSS variables, so light and custom themes are a token swap away.",
  },
  {
    question: "Is TypeScript strictly typed?",
    answer:
      "Components ship as strict TypeScript with fully typed props and zero any. Types travel with the source, so autocomplete and refactors work the moment you paste a file.",
  },
  {
    question: "Can I use it in commercial projects?",
    answer:
      "The license covers unlimited commercial and client work for your whole team. There are no per seat fees, no usage caps, and no attribution requirement.",
  },
  {
    question: "Which animation library is required?",
    answer:
      "Motion is the only animation dependency. It is lightweight and tree shakeable, and it drives every spring, transition, and gesture across the library.",
  },
  {
    question: "Are the components responsive?",
    answer:
      "Each layout is built mobile first with fluid spacing, so panels reflow cleanly from small phones to wide desktop screens without extra breakpoints.",
  },
  {
    question: "How do I customize the theme?",
    answer:
      "Design tokens live in one theme block. Override the brand, surface, and line variables once and every component picks up the change in place.",
  },
  {
    question: "Are the components accessible?",
    answer:
      "Interactive components include focus rings, keyboard handlers, and ARIA labels, and they respect the reduced motion setting for people who turn animation off.",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <FaqSearch
        items={DEMO_ITEMS}
        autoQueries={["install", "dark mode", "typescript", "responsive"]}
      />
    </div>
  );
}
