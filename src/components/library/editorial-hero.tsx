"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function EditorialHero({
  kicker = "The 2026 collection",
  title = "Formulated for",
  titleItalic = "clarity.",
  description = "Every batch is documented, tested, and traceable, a research standard built for people who read the certificate before the label.",
  className,
}: {
  kicker?: string;
  title?: string;
  titleItalic?: string;
  description?: string;
  className?: string;
}) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-panel px-8 py-10 text-center",
        className
      )}
    >
      <motion.div variants={item} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
        <span className="h-px w-8 bg-line" />
        {kicker}
        <span className="h-px w-8 bg-line" />
      </motion.div>

      <motion.h1 variants={item} className="max-w-md text-4xl leading-[1.05] text-white">
        {title}{" "}
        <span className="font-serif italic text-brand-soft">{titleItalic}</span>
      </motion.h1>

      <motion.div variants={item} className="h-px w-16 bg-gradient-to-r from-transparent via-brand-soft/70 to-transparent" />

      <motion.p variants={item} className="max-w-sm text-sm leading-relaxed text-zinc-400">
        {description}
      </motion.p>

      <motion.button
        variants={item}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-2 rounded-full border border-line px-5 py-2 text-xs font-medium tracking-wide text-white transition-colors hover:border-brand-soft/60 hover:text-brand-soft"
      >
        Explore the collection
      </motion.button>
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="h-full w-full bg-[#050508] p-4">
      <EditorialHero className="h-full" />
    </div>
  );
}
