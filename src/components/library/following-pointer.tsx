"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FollowingPointer({
  name = "You",
  color = "#7c6cff",
  children,
  className,
}: {
  name?: string;
  color?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn(
        "group relative cursor-none overflow-hidden rounded-2xl border border-line bg-panel",
        className
      )}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-20 flex items-center gap-1.5"
        style={{ x: springX, y: springY }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.7 }}
        transition={{ duration: 0.15 }}
      >
        <MousePointer2
          className="h-5 w-5 -translate-x-0.5 -translate-y-0.5"
          style={{ color, fill: color }}
        />
        <span
          className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium text-white shadow-lg"
          style={{ backgroundColor: color }}
        >
          {name}
        </span>
      </motion.div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <FollowingPointer
        name="Ava Chen"
        color="#7c6cff"
        className="flex h-64 w-full max-w-sm items-center justify-center"
      >
        <div className="pointer-events-none flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-medium text-zinc-300">
            Move your cursor around
          </span>
          <span className="text-xs text-zinc-500">
            A name tag glides alongside it
          </span>
        </div>
      </FollowingPointer>
    </div>
  );
}
