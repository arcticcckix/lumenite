"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StackCard {
  id: string;
  title: string;
  body: string;
  gradient: string;
}

export function CardStack({
  cards,
  interval = 2600,
  className,
}: {
  cards: StackCard[];
  interval?: number;
  className?: string;
}) {
  const [order, setOrder] = useState(cards.map((c) => c.id));

  useEffect(() => {
    const id = setInterval(() => {
      setOrder((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));

  return (
    <div className={cn("relative h-64 w-72", className)}>
      <AnimatePresence initial={false}>
        {order.map((id, i) => {
          const card = byId[id];
          const depth = i;
          return (
            <motion.div
              key={id}
              className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-line p-6 shadow-2xl"
              style={{ background: card.gradient, zIndex: cards.length - depth }}
              animate={{
                scale: 1 - depth * 0.05,
                y: depth * 14,
                opacity: depth > 2 ? 0 : 1,
                rotate: depth === 0 ? 0 : depth % 2 === 0 ? -2 : 2,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-white/80">{card.body}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

const demoCards: StackCard[] = [
  {
    id: "a",
    title: "Design",
    body: "Systemized tokens, consistent spacing, effortless theming.",
    gradient: "linear-gradient(135deg, #7c6cff, #5b8cff)",
  },
  {
    id: "b",
    title: "Motion",
    body: "Spring-based transitions that feel alive, not decorative.",
    gradient: "linear-gradient(135deg, #ff8a5b, #ff5b9c)",
  },
  {
    id: "c",
    title: "Speed",
    body: "Copy, paste, ship. No wiring, no boilerplate.",
    gradient: "linear-gradient(135deg, #5bffb0, #5b8cff)",
  },
  {
    id: "d",
    title: "Scale",
    body: "From a landing page to a full product suite.",
    gradient: "linear-gradient(135deg, #ffd15b, #ff5b5b)",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <CardStack cards={demoCards} />
    </div>
  );
}
