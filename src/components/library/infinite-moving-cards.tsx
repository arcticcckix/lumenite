"use client";

import { cn } from "@/lib/utils";

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export function InfiniteMovingCards({
  items,
  reverse = false,
  className,
}: {
  items: Testimonial[];
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max gap-4",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="w-72 shrink-0 rounded-2xl border border-line bg-panel p-6"
          >
            <p className="text-sm leading-relaxed text-zinc-300">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-glow text-xs font-semibold text-white">
                {item.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {item.name}
                </div>
                <div className="text-xs text-zinc-500">{item.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const sample: Testimonial[] = [
  {
    quote: "This shaved days off our build. It just feels right.",
    name: "Mara Ling",
    title: "Design Lead, Vantage",
  },
  {
    quote: "The polish is unreal — clients think we hired a studio.",
    name: "Theo Brandt",
    title: "Founder, Northbeam",
  },
  {
    quote: "Every component drops in and just works.",
    name: "Priya Nadar",
    title: "Engineer, Fable",
  },
  {
    quote: "Our landing page conversions jumped after the redesign.",
    name: "Sam Okafor",
    title: "Growth, Loomstate",
  },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <InfiniteMovingCards items={sample} />
      <InfiniteMovingCards items={sample} reverse />
    </div>
  );
}
