"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { REGISTRY, CATEGORIES } from "@/lib/registry";
import { cn } from "@/lib/utils";

/**
 * Aceternity-style docs sidebar: components grouped by category, each linking
 * to its page, with a live filter and active-item highlight.
 */
export function ComponentsSidebar() {
  const pathname = usePathname();
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const query = q.trim().toLowerCase();
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: REGISTRY.filter(
        (e) =>
          e.category === cat.id &&
          (!query ||
            e.name.toLowerCase().includes(query) ||
            e.slug.includes(query))
      ),
    })).filter((g) => g.items.length > 0);
  }, [q]);

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 pb-10 no-scrollbar">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search components"
            className="w-full rounded-lg border border-line bg-surface py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-600 outline-none transition focus:border-brand/60"
          />
        </div>

        <nav className="space-y-6">
          {groups.map((g) => (
            <div key={g.id}>
              <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                {g.label}
              </div>
              <ul className="space-y-0.5">
                {g.items.map((e) => {
                  const href = `/components/${e.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={e.slug}>
                      <Link
                        href={href}
                        className={cn(
                          "relative flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] transition-colors",
                          active
                            ? "bg-brand/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
                        )}
                        <span className="truncate">{e.name}</span>
                        {e.tier === "pro" && (
                          <span className="ml-2 shrink-0 rounded bg-brand/15 px-1.5 py-0.5 text-[9px] font-medium uppercase text-brand-soft">
                            Pro
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
