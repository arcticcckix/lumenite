"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", icon: "🏠" },
  { label: "Search", icon: "🔍" },
  { label: "Chat", icon: "💬" },
  { label: "Music", icon: "🎵" },
  { label: "Photos", icon: "🖼️" },
  { label: "Settings", icon: "⚙️" },
];

function DockIcon({
  mouseX,
  icon,
  label,
}: {
  mouseX: MotionValue<number>;
  icon: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 0;
    return val - (rect.left + rect.width / 2 - (ref.current?.offsetParent as HTMLElement | null ? 0 : 0));
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 76, 44]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-xl border border-line bg-panel text-xl"
    >
      {icon}
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? -34 : 4 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none absolute top-0 whitespace-nowrap rounded-md border border-line bg-panel px-2 py-0.5 text-[10px] text-zinc-300"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export function DockMenu({ className }: { className?: string }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-3 rounded-2xl border border-line bg-panel/70 px-4 pb-2 backdrop-blur-md",
        className
      )}
    >
      {ITEMS.map((item) => (
        <DockIcon key={item.label} mouseX={mouseX} icon={item.icon} label={item.label} />
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void">
      <DockMenu />
    </div>
  );
}
