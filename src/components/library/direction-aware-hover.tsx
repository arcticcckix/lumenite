"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "top" | "bottom" | "left" | "right";

function getDirection(
  e: React.MouseEvent<HTMLDivElement>,
  rect: DOMRect
): Direction {
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const angle = (Math.atan2(y, x) * 180) / Math.PI;
  if (angle >= -45 && angle < 45) return "right";
  if (angle >= 45 && angle < 135) return "bottom";
  if (angle >= -135 && angle < -45) return "top";
  return "left";
}

const offscreen: Record<Direction, { x: string; y: string }> = {
  top: { x: "0%", y: "-100%" },
  bottom: { x: "0%", y: "100%" },
  left: { x: "-100%", y: "0%" },
  right: { x: "100%", y: "0%" },
};

export function DirectionAwareHover({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<Direction>("bottom");
  const [hovering, setHovering] = useState(false);

  function handleEnter(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setDirection(getDirection(e, rect));
    setHovering(true);
  }

  function handleLeave(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setDirection(getDirection(e, rect));
    setHovering(false);
  }

  const from = offscreen[direction];

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative aspect-video w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-panel to-void",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,108,255,0.25),transparent_60%)]" />
      <motion.div
        initial={false}
        animate={
          hovering ? { x: "0%", y: "0%" } : { x: from.x, y: from.y }
        }
        transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        className="absolute inset-0 flex flex-col justify-end bg-black/60 p-5 backdrop-blur-[2px]"
      >
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-zinc-300">{subtitle}</p>
      </motion.div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <DirectionAwareHover
        title="Enter from any edge"
        subtitle="The overlay tracks which side your cursor arrived from."
      />
    </div>
  );
}
