"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function LinkPreviewHover({
  href = "#",
  label,
  previewTitle,
  previewDescription,
  gradient = "linear-gradient(135deg,#7c6cff,#5b8cff)",
  className,
}: {
  href?: string;
  label: string;
  previewTitle: string;
  previewDescription: string;
  gradient?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        role="link"
        tabIndex={0}
        data-href={href}
        className="cursor-pointer text-brand-soft underline decoration-brand/40 underline-offset-4 transition-colors hover:text-white"
      >
        {label}
      </span>
      <AnimatePresence>
        {hovered ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 z-20 mb-3 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
          >
            <div className="h-24 w-full" style={{ background: gradient }} />
            <div className="p-3">
              <p className="text-xs font-semibold text-white">
                {previewTitle}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                {previewDescription}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <p className="max-w-sm text-center text-sm leading-relaxed text-zinc-400">
        Check out{" "}
        <LinkPreviewHover
          label="Lumenite UI"
          previewTitle="Lumenite UI"
          previewDescription="A premium Aceternity-style component library for React."
          gradient="linear-gradient(135deg,#7c6cff,#22d3ee)"
        />{" "}
        for beautifully animated components, or read the{" "}
        <LinkPreviewHover
          label="documentation"
          previewTitle="Docs"
          previewDescription="Guides, API references, and copy-paste snippets."
          gradient="linear-gradient(135deg,#d946ef,#5b8cff)"
        />
        .
      </p>
    </div>
  );
}
