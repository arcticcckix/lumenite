"use client";

import { type ComponentType } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Home, Folder, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type Crumb = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "relative inline-flex items-center rounded-xl border border-white/10 bg-panel/70 px-1.5 py-1.5 backdrop-blur-sm",
        className
      )}
    >
      {/* thin bright top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <ol className="flex items-center">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const Icon = item.icon;

          return (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.07 * i, ease: EASE }}
              className="flex items-center"
            >
              {i > 0 && (
                <ChevronRight
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0 text-white/25"
                />
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="relative inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1 text-sm font-medium text-white"
                >
                  {Icon && <Icon className="h-3.5 w-3.5 text-brand-soft" />}
                  <span>{item.label}</span>
                  <motion.span
                    aria-hidden
                    className="ml-0.5 h-1.5 w-1.5 rounded-full bg-glow"
                    style={{ boxShadow: "0 0 8px 1px rgba(91, 140, 255, 0.55)" }}
                    animate={{ opacity: [1, 0.35, 1], scale: [1, 0.82, 1] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </span>
              ) : (
                <button
                  type="button"
                  className="group relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm text-zinc-400 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/50"
                >
                  {Icon && (
                    <Icon className="h-3.5 w-3.5 text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300" />
                  )}
                  <span>{item.label}</span>
                  {/* sliding underline */}
                  <span className="pointer-events-none absolute inset-x-2.5 bottom-0.5 h-px origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-glow transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                </button>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function Demo() {
  const items: Crumb[] = [
    { label: "Home", icon: Home },
    { label: "Projects", icon: Folder },
    { label: "Lumenite", icon: Layers },
    { label: "Settings", icon: Settings },
  ];

  const rows = [
    { label: "Workspace", value: "Lumenite" },
    { label: "Default theme", value: "Liquid Dark" },
    { label: "Preview branch", value: "main" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Breadcrumbs items={items} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38, ease: EASE }}
          className="mt-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Settings
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Saved
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Manage how your workspace builds, previews, and ships components.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-panel/50 divide-y divide-white/5">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-zinc-400">{row.label}</span>
                <span className="font-medium text-zinc-200">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
