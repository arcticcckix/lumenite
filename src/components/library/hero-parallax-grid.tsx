"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface Product {
  title: string;
  gradient: string;
}

function Row({
  products,
  translateX,
  className,
}: {
  products: Product[];
  translateX: ReturnType<typeof useTransform<number, number>>;
  className?: string;
}) {
  return (
    <motion.div
      style={{ x: translateX }}
      className={cn("flex gap-4", className)}
    >
      {products.map((p) => (
        <div
          key={p.title}
          className="h-32 w-52 shrink-0 rounded-xl border border-line p-4 shadow-lg"
          style={{ background: p.gradient }}
        >
          <span className="text-sm font-medium text-white/90">{p.title}</span>
        </div>
      ))}
    </motion.div>
  );
}

export function HeroParallaxGrid({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.3], [15, 0]), {
    stiffness: 120,
    damping: 20,
  });
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.3], [0.3, 1]),
    { stiffness: 120, damping: 20 }
  );
  const translateXLeft = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateXRight = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const rowA: Product[] = [
    { title: "Aurora", gradient: "linear-gradient(135deg,#7c6cff,#5b8cff)" },
    { title: "Nimbus", gradient: "linear-gradient(135deg,#5b8cff,#22d3ee)" },
    { title: "Pulse", gradient: "linear-gradient(135deg,#7c6cff,#d946ef)" },
    { title: "Halo", gradient: "linear-gradient(135deg,#22d3ee,#7c6cff)" },
  ];
  const rowB: Product[] = [
    { title: "Vertex", gradient: "linear-gradient(135deg,#f59e0b,#7c6cff)" },
    { title: "Prism", gradient: "linear-gradient(135deg,#5b8cff,#7c6cff)" },
    { title: "Flux", gradient: "linear-gradient(135deg,#d946ef,#5b8cff)" },
    { title: "Orbit", gradient: "linear-gradient(135deg,#7c6cff,#22d3ee)" },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-full w-full overflow-hidden bg-void [perspective:1000px]",
        className
      )}
    >
      <div className="flex h-full flex-col items-center justify-center gap-10 px-4">
        <motion.h2
          style={{ opacity }}
          className="text-center text-2xl font-semibold text-white md:text-3xl"
        >
          Scroll to feel the depth
        </motion.h2>
        <motion.div
          style={{ rotateX, opacity }}
          className="flex flex-col gap-4"
        >
          <Row products={rowA} translateX={translateXLeft} />
          <Row products={rowB} translateX={translateXRight} />
        </motion.div>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="h-[420px]">
        <HeroParallaxGrid />
      </div>
      <div className="flex h-[420px] items-center justify-center text-xs text-zinc-500">
        keep scrolling
      </div>
    </div>
  );
}
