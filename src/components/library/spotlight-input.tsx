"use client";

import { useId, useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

export function SpotlightInput({
  label,
  type = "text",
  className,
}: {
  label: string;
  type?: string;
  className?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const background = useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, rgba(124,108,255,0.25), transparent 70%)`;

  const floated = focused || value.length > 0;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "relative rounded-xl border border-line bg-panel transition-colors",
        focused && "border-brand/60",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{ background, opacity: focused ? 1 : 0 }}
      />
      <div className="relative z-10 px-4 pb-2 pt-5">
        <motion.label
          htmlFor={id}
          initial={false}
          animate={{
            y: floated ? -8 : 6,
            scale: floated ? 0.78 : 1,
            color: focused ? "#c9c2ff" : "#9ca3af",
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ originX: 0 }}
          className="pointer-events-none absolute left-4 top-0 text-sm"
        >
          {label}
        </motion.label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent pt-2 text-sm text-white outline-none"
        />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="w-full max-w-sm space-y-4">
        <SpotlightInput label="Full name" />
        <SpotlightInput label="Email address" type="email" />
      </div>
    </div>
  );
}
