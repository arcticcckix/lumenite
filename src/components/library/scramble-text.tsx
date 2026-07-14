"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";

function seededRand(seed: number) {
  return Math.abs(Math.sin(seed * 999)) % 1;
}

export function ScrambleText({
  text,
  className,
  scrambleSpeed = 30,
  revealDelay = 22,
}: {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealDelay?: number;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function scramble() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    frame.current = 0;
    const totalFrames = text.length * revealDelay;

    intervalRef.current = setInterval(() => {
      frame.current += scrambleSpeed;
      const revealedCount = Math.floor(frame.current / revealDelay);

      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealedCount) return char;
          const seed = i + frame.current;
          return CHARS[Math.floor(seededRand(seed) * CHARS.length)];
        })
        .join("");

      setDisplay(next);

      if (revealedCount >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, scrambleSpeed);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      onMouseEnter={scramble}
      className={cn("inline-block cursor-pointer font-mono tracking-wide", className)}
    >
      {display}
    </span>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8">
      <ScrambleText
        text="HOVER TO DECODE"
        className="text-3xl font-bold text-white"
      />
      <p className="text-sm text-zinc-500">move your cursor over the headline</p>
    </div>
  );
}
