"use client";

import { cn } from "@/lib/utils";

interface DiffLine {
  text: string;
  type: "remove" | "add" | "same";
}

const BEFORE: DiffLine[] = [
  { text: "function Card({ title }) {", type: "same" },
  { text: "  return (", type: "same" },
  { text: '    <div className="card">', type: "remove" },
  { text: "      <h3>{title}</h3>", type: "same" },
  { text: "    </div>", type: "remove" },
  { text: "  );", type: "same" },
  { text: "}", type: "same" },
];

const AFTER: DiffLine[] = [
  { text: "function Card({ title }) {", type: "same" },
  { text: "  return (", type: "same" },
  { text: '    <div className="rounded-2xl border', type: "add" },
  { text: '      border-line bg-panel p-6 shadow-lg">', type: "add" },
  { text: "      <h3>{title}</h3>", type: "same" },
  { text: "    </div>", type: "remove" },
  { text: "  );", type: "same" },
  { text: "}", type: "same" },
];

function Panel({
  filename,
  lines,
}: {
  filename: string;
  lines: DiffLine[];
}) {
  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-line bg-[#0a0a10]">
      <div className="flex items-center gap-2 border-b border-line bg-white/[0.03] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-zinc-600" />
        <span className="font-mono text-[11px] text-zinc-400">{filename}</span>
      </div>
      <div className="py-1 font-mono text-[12px] leading-relaxed">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 px-3",
              line.type === "remove" && "bg-rose-500/10",
              line.type === "add" && "bg-emerald-500/10"
            )}
          >
            <span className="w-4 shrink-0 select-none text-right text-zinc-700">
              {i + 1}
            </span>
            <span
              className={cn(
                "w-3 shrink-0 select-none",
                line.type === "remove" && "text-rose-400",
                line.type === "add" && "text-emerald-400",
                line.type === "same" && "text-transparent"
              )}
            >
              {line.type === "remove" ? "−" : line.type === "add" ? "+" : "·"}
            </span>
            <span
              className={cn(
                "whitespace-pre text-zinc-400",
                line.type === "remove" && "text-rose-300",
                line.type === "add" && "text-emerald-300"
              )}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodeComparison({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-3 sm:flex-row", className)}>
      <Panel filename="card.tsx, before" lines={BEFORE} />
      <Panel filename="card.tsx, after" lines={AFTER} />
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <CodeComparison />
    </div>
  );
}
