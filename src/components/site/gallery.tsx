"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { REGISTRY, CATEGORIES } from "@/lib/registry";
import type { Category } from "@/lib/registry/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "free" | "pro" | Category;

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const entries = useMemo(() => {
    let list = REGISTRY;
    if (filter === "free" || filter === "pro")
      list = list.filter((e) => e.tier === filter);
    else if (filter !== "all") list = list.filter((e) => e.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.includes(q)
      );
    }
    return list;
  }, [filter, query]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Components
        </h1>
        <p className="mt-4 text-zinc-400">
          {REGISTRY.length} live, copy-paste React components. Free ones are
          yours forever, Pro ones unlock with a license.
        </p>
      </div>

      <div className="sticky top-16 z-30 -mx-6 mt-10 border-b border-line bg-void/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative mr-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-44 rounded-full border border-line bg-panel py-1.5 pl-9 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-brand/60 focus:w-56"
            />
          </div>
          {(
            [
              { id: "all" as const, label: "All" },
              { id: "free" as const, label: "Free" },
              { id: "pro" as const, label: "Pro" },
              ...CATEGORIES,
            ] as { id: Filter; label: string }[]
          ).map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                "rounded-full border border-transparent px-3.5 py-1.5 text-xs text-zinc-400 transition hover:text-white",
                filter === c.id && "border-line bg-panel text-white"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => {
          const Demo = entry.component;
          return (
            <motion.div
              key={entry.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
            >
              <Link href={`/components/${entry.slug}`} className="group block">
                <div className="relative h-[300px] overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 group-hover:border-zinc-600 group-hover:shadow-[0_0_40px_rgba(124,108,255,0.08)]">
                  <div className="absolute inset-0 origin-center scale-[0.8]">
                    <Demo />
                  </div>
                  {entry.tier === "pro" && (
                    <span className="absolute right-3 top-3 z-20 rounded-full bg-brand/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-soft backdrop-blur">
                      PRO
                    </span>
                  )}
                </div>
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-200">
                      {entry.name}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-zinc-600">
                      {entry.category}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                    {entry.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {entries.length === 0 && (
        <p className="py-24 text-center text-sm text-zinc-500">
          Nothing matches, try a different search.
        </p>
      )}
    </div>
  );
}
