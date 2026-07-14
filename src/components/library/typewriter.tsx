"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Typewriter({
  phrases,
  className,
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 1500,
}: {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseDuration);
    } else if (deleting && text === "") {
      setDeleting(false);
      setPhraseIndex((p) => p + 1);
    } else {
      timeout = setTimeout(
        () => {
          setText((t) =>
            deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)
          );
        },
        deleting ? deletingSpeed : typingSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="ml-1 inline-block h-[1em] w-[2px] bg-brand-soft"
      />
    </span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Building
        </p>
        <Typewriter
          phrases={["dashboards.", "landing pages.", "design systems.", "the future."]}
          className="mt-3 text-3xl font-semibold text-white"
        />
      </div>
    </div>
  );
}
