"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = ["Product", "Pricing", "Docs", "Blog"];

export function FloatingNavbar({
  container,
  className,
}: {
  container?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  const [condensed, setCondensed] = useState(false);
  const lastY = useRef(0);

  const { scrollY } = useScroll(
    container ? { container } : undefined
  );

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - lastY.current;
    if (y < 40) {
      setVisible(true);
      setCondensed(false);
    } else if (diff > 4) {
      setVisible(false);
    } else if (diff < -4) {
      setVisible(true);
      setCondensed(true);
    }
    lastY.current = y;
  });

  return (
    <motion.div
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "sticky top-4 z-20 mx-auto flex items-center justify-between rounded-full border border-line bg-panel/80 px-5 py-3 shadow-lg backdrop-blur-md transition-all duration-300",
        condensed ? "max-w-md gap-4" : "max-w-lg gap-8",
        className
      )}
    >
      <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-sm font-semibold text-transparent">
        Lumenite
      </span>
      <div className="flex items-center gap-4">
        {LINKS.map((link) => (
          <button
            key={link}
            type="button"
            className="cursor-pointer text-xs text-zinc-400 transition-colors hover:text-white"
          >
            {link}
          </button>
        ))}
      </div>
      <button className="rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand/80">
        Sign in
      </button>
    </motion.div>
  );
}

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="h-full w-full bg-void p-2">
      <div
        ref={ref}
        className="relative h-full w-full overflow-y-auto rounded-xl border border-line"
      >
        <FloatingNavbar container={ref} />
        <div className="flex flex-col gap-4 p-6 pt-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg border border-line bg-panel/60"
            />
          ))}
          <p className="text-center text-xs text-zinc-500">
            scroll up and down to see the navbar react
          </p>
        </div>
      </div>
    </div>
  );
}
