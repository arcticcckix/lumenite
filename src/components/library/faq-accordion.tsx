"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("w-full divide-y divide-line rounded-2xl border border-line bg-panel", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-sm font-medium text-white">{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="shrink-0 text-zinc-500"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

const demoItems: FaqItem[] = [
  {
    question: "Can I use these components in commercial projects?",
    answer:
      "Yes — every free and pro component ships with a license that covers unlimited commercial projects.",
  },
  {
    question: "Do I need Tailwind v4?",
    answer:
      "Components are written against Tailwind v4 tokens. They can be adapted to v3, but v4 is required for the design tokens out of the box.",
  },
  {
    question: "Is framer-motion required?",
    answer:
      "Yes, most components rely on framer-motion for their animation logic. It's a lightweight, well-maintained dependency.",
  },
  {
    question: "What's the difference between free and pro?",
    answer:
      "Free components are open for anyone. Pro components include more advanced interaction patterns like drag, 3D, and physics-based effects.",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <FaqAccordion items={demoItems} className="max-w-lg" />
    </div>
  );
}
