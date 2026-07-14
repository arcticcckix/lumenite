"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 auto-rows-[110px] gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCell({
  title,
  description,
  icon,
  className,
  featured = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-panel p-5 flex flex-col justify-between",
        featured &&
          "bg-gradient-to-br from-brand/15 via-panel to-panel",
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand-soft">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400 line-clamp-2">
          {description}
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-brand/10 to-transparent" />
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <BentoGrid className="w-full max-w-lg">
        <BentoCell
          featured
          className="col-span-2 row-span-2"
          icon="✦"
          title="Realtime sync engine"
          description="Every change propagates instantly across sessions with no manual refresh."
        />
        <BentoCell icon="⚡" title="Fast" description="Sub-100ms edge reads." />
        <BentoCell icon="🔒" title="Secure" description="Row-level isolation." />
        <BentoCell
          className="col-span-2"
          icon="◐"
          title="Composable"
          description="Drop it into any layout without fighting the grid."
        />
      </BentoGrid>
    </div>
  );
}
