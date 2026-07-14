"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import {
  Home,
  Search,
  Camera,
  Music,
  MessageCircle,
  Settings,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [
  { icon: Home, tint: "from-sky-400 to-blue-500" },
  { icon: Search, tint: "from-violet-400 to-brand" },
  { icon: Camera, tint: "from-rose-400 to-pink-500" },
  { icon: Music, tint: "from-emerald-400 to-teal-500" },
  { icon: MessageCircle, tint: "from-amber-400 to-orange-500" },
  { icon: Heart, tint: "from-red-400 to-rose-500" },
  { icon: Settings, tint: "from-zinc-300 to-zinc-500" },
];

function DockIcon({
  mouseX,
  children,
}: {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-120, 0, 120], [46, 74, 46]);
  const size = useSpring(sizeSync, { stiffness: 260, damping: 20 });

  return (
    <motion.div ref={ref} style={{ width: size, height: size }} className="shrink-0">
      {children}
    </motion.div>
  );
}

export function GlassDock({ className }: { className?: string }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex items-end gap-3 rounded-[26px] px-4 pb-3 pt-3",
        "bg-white/10 backdrop-blur-xl backdrop-saturate-150",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.12), 0 24px 50px -20px rgba(0,0,0,0.7)",
      }}
    >
      {ICONS.map(({ icon: Icon, tint }, i) => (
        <DockIcon key={i} mouseX={mouseX}>
          <div
            className={cn(
              "flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              tint
            )}
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}
          >
            <Icon className="h-1/2 w-1/2" />
          </div>
        </DockIcon>
      ))}
    </motion.div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-end justify-center overflow-hidden p-8">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-4 h-56 w-56 rounded-full bg-[#7c6cff] blur-[80px]" />
        <div className="absolute right-1/4 top-10 h-56 w-56 rounded-full bg-[#ff5f8f] blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-[#22d3ee] blur-[80px]" />
      </div>
      <div className="relative mb-6">
        <GlassDock />
      </div>
    </div>
  );
}
