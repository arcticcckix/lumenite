"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type LineKind = "prompt" | "output" | "success" | "muted";

interface TermLine {
  kind: LineKind;
  text: string;
}

const SCRIPT: TermLine[] = [
  { kind: "prompt", text: "npx lumenite add spotlight-card" },
  { kind: "muted", text: "Resolving packages..." },
  { kind: "muted", text: "Fetching component tree..." },
  { kind: "output", text: "+ src/components/library/spotlight-card.tsx" },
  { kind: "output", text: "+ src/lib/utils.ts" },
  { kind: "success", text: "✓ Installed 1 component in 0.8s" },
  { kind: "prompt", text: "npm run build" },
  { kind: "muted", text: "Compiling..." },
  { kind: "success", text: "✓ Build complete, 0 errors, 0 warnings" },
];

function colorFor(kind: LineKind) {
  switch (kind) {
    case "prompt":
      return "text-white";
    case "success":
      return "text-emerald-400";
    case "muted":
      return "text-zinc-500";
    default:
      return "text-zinc-300";
  }
}

export function Terminal({ className }: { className?: string }) {
  const [visible, setVisible] = useState(0);
  const [typed, setTyped] = useState("");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (visible >= SCRIPT.length) {
      const t = setTimeout(() => {
        setVisible(0);
        setTyped("");
        setCycle((c) => c + 1);
      }, 1800);
      return () => clearTimeout(t);
    }

    const line = SCRIPT[visible];
    if (line.kind !== "prompt") {
      const t = setTimeout(() => setVisible((v) => v + 1), 420);
      return () => clearTimeout(t);
    }

    let i = 0;
    const speed = 28;
    const interval = setInterval(() => {
      i += 1;
      setTyped(line.text.slice(0, i));
      if (i >= line.text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible((v) => v + 1);
          setTyped("");
        }, 350);
      }
    }, speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, cycle]);

  const current = SCRIPT[visible];
  const isTypingPrompt = current?.kind === "prompt";

  return (
    <div
      className={cn(
        "w-full max-w-lg overflow-hidden rounded-xl border border-line bg-[#0a0a10] shadow-2xl shadow-black/40",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-line bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs font-medium text-zinc-500">
          zsh, lumenite
        </span>
      </div>
      <div className="h-64 space-y-1.5 overflow-hidden p-4 font-mono text-[13px] leading-relaxed">
        <AnimatePresence initial={false}>
          {SCRIPT.slice(0, visible).map((line, i) => (
            <motion.div
              key={`${cycle}-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={colorFor(line.kind)}
            >
              {line.kind === "prompt" ? (
                <span>
                  <span className="text-brand-soft">➜ </span>
                  {line.text}
                </span>
              ) : (
                line.text
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTypingPrompt && (
          <div className="text-white">
            <span className="text-brand-soft">➜ </span>
            {typed}
            <motion.span
              className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-brand-soft"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <Terminal />
    </div>
  );
}
