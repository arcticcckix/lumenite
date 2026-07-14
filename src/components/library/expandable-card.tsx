"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ExpandableItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: React.ReactNode;
}

export function ExpandableCard({
  item,
  onClose,
}: {
  item: ExpandableItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            key="modal"
            layoutId={`card-${item.id}`}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-panel p-8"
          >
            <motion.div
              layoutId={`icon-${item.id}`}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand-soft"
            >
              {item.icon}
            </motion.div>
            <motion.h3
              layoutId={`title-${item.id}`}
              className="text-xl font-semibold text-white"
            >
              {item.title}
            </motion.h3>
            <motion.p
              layoutId={`subtitle-${item.id}`}
              className="mt-1 text-sm text-zinc-500"
            >
              {item.subtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15 } }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm leading-relaxed text-zinc-400"
            >
              {item.content}
            </motion.p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg border border-line px-4 py-2 text-xs text-zinc-300 transition hover:bg-white/5"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ExpandableCardTrigger({
  item,
  onOpen,
}: {
  item: ExpandableItem;
  onOpen: (item: ExpandableItem) => void;
}) {
  return (
    <motion.button
      layoutId={`card-${item.id}`}
      onClick={() => onOpen(item)}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border border-line bg-panel p-5 text-left transition hover:bg-white/[0.03]"
      )}
    >
      <motion.div
        layoutId={`icon-${item.id}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-soft"
      >
        {item.icon}
      </motion.div>
      <div className="min-w-0">
        <motion.h4
          layoutId={`title-${item.id}`}
          className="truncate text-sm font-semibold text-white"
        >
          {item.title}
        </motion.h4>
        <motion.p
          layoutId={`subtitle-${item.id}`}
          className="truncate text-xs text-zinc-500"
        >
          {item.subtitle}
        </motion.p>
      </div>
    </motion.button>
  );
}

const items: ExpandableItem[] = [
  {
    id: "1",
    title: "Design tokens",
    subtitle: "Colors, spacing, type scale",
    content:
      "A single source of truth for every visual primitive, versioned alongside your components so nothing drifts.",
    icon: "◆",
  },
  {
    id: "2",
    title: "Motion presets",
    subtitle: "Springs tuned for premium feel",
    content:
      "Reusable easing and spring configs that keep every interaction feeling consistent across the product.",
    icon: "✦",
  },
];

export default function Demo() {
  const [open, setOpen] = useState<ExpandableItem | null>(null);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
      <div className="w-full max-w-sm space-y-3">
        {items.map((item) => (
          <ExpandableCardTrigger key={item.id} item={item} onOpen={setOpen} />
        ))}
      </div>
      <ExpandableCard item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
