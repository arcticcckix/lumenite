"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { REGISTRY, CATEGORIES } from "@/lib/registry";
import type { Category } from "@/lib/registry/types";
import { cn } from "@/lib/utils";

type Tier = "all" | "free" | "pro";

const TIERS: { id: Tier; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
];

export function Gallery() {
  const [tier, setTier] = useState<Tier>("all");
  const [cat, setCat] = useState<Category | "all">("all");

  const entries = useMemo(
    () =>
      REGISTRY.filter(
        (e) =>
          (tier === "all" || e.tier === tier) &&
          (cat === "all" || e.category === cat)
      ),
    [tier, cat]
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Components
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {REGISTRY.length} live, copy-paste React components. Pick one, grab
            the code, ship it.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-line bg-surface p-1">
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTier(t.id)}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs transition",
                tier === t.id
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* mobile-only category filter (desktop uses the sidebar) */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden">
        {(
          [{ id: "all" as const, label: "All" }, ...CATEGORIES] as {
            id: Category | "all";
            label: string;
          }[]
        ).map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs transition",
              cat === c.id
                ? "border-brand/50 bg-brand/15 text-white"
                : "border-line bg-surface text-zinc-400"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry, i) => {
          const Demo = entry.component;
          return (
            <motion.div
              key={entry.slug}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.25) }}
            >
              <Link href={`/components/${entry.slug}`} className="group block">
                <div className="relative h-[280px] overflow-hidden rounded-xl border border-line bg-surface transition duration-300 group-hover:border-brand/40 group-hover:shadow-[0_0_40px_-8px_rgba(124,108,255,0.25)]">
                  <div className="absolute inset-0 origin-center scale-[0.78]">
                    <Demo />
                  </div>
                  {entry.tier === "pro" && (
                    <span className="absolute right-3 top-3 z-20 rounded-full bg-brand/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-soft backdrop-blur">
                      PRO
                    </span>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-void to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-0.5">
                  <span className="text-sm font-medium text-zinc-200">
                    {entry.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-zinc-600">
                    {entry.category}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
