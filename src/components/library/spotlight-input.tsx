"use client";

import { useId, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useTime,
} from "framer-motion";
import { ArrowRight, Mail, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SpotlightInput({
  label,
  type = "text",
  icon: Icon,
  className,
}: {
  label: string;
  type?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [focused, setFocused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [value, setValue] = useState("");

  const active = focused || hovering;

  // Continuous, deterministic clock. Drives the idle motion so the field
  // reads as alive even when nobody is touching it.
  const time = useTime();

  // A thin light that travels around the border, always.
  const beamRotate = useTransform(time, (t) => (t / 30) % 360);

  // The resting spotlight drifts on a slow, seeded path (percent based so it
  // stays crisp at any width). Rounded before it reaches the DOM.
  const driftX = useTransform(time, (t) => Math.round(50 + 26 * Math.sin(t / 2600)));
  const driftY = useTransform(time, (t) =>
    Math.round(50 + 19 * Math.sin(t / 1900 + 1.3))
  );
  const idleGlow = useMotionTemplate`radial-gradient(150px circle at ${driftX}% ${driftY}%, rgba(124,108,255,0.13), transparent 72%)`;

  // Cursor-tracked spotlight, spring-smoothed and rounded.
  const springX = useSpring(mouseX, { stiffness: 170, damping: 24, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 170, damping: 24, mass: 0.4 });
  const cursorX = useTransform(springX, (v) => Math.round(v));
  const cursorY = useTransform(springY, (v) => Math.round(v));
  const cursorGlow = useMotionTemplate`radial-gradient(220px circle at ${cursorX}px ${cursorY}px, rgba(124,108,255,0.22), transparent 70%)`;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const floated = focused || value.length > 0;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "relative overflow-hidden rounded-xl bg-white/[0.06] p-px",
        className
      )}
    >
      {/* Traveling border light, continuous at rest. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden rounded-xl">
        <motion.div
          style={{
            rotate: beamRotate,
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 255deg, rgba(124,108,255,0.5) 322deg, rgba(91,140,255,0.9) 350deg, transparent 360deg)",
          }}
          className="aspect-square w-[150%]"
        />
      </div>

      {/* Inner panel, sits 1px inside, revealing the beam as a hairline rim. */}
      <div className="relative overflow-hidden rounded-[11px] bg-panel">
        {/* Resting glow: drifts on its own until you engage the field. */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: idleGlow }}
          animate={{ opacity: active ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        {/* Cursor glow: takes over on hover or focus. */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: cursorGlow }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />

        <div
          className={cn(
            "relative z-10 pb-2 pr-4 pt-5",
            Icon ? "pl-11" : "pl-4"
          )}
        >
          {Icon && (
            <Icon
              aria-hidden
              className={cn(
                "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300",
                focused ? "text-brand-soft" : "text-zinc-500"
              )}
            />
          )}
          <motion.label
            htmlFor={id}
            initial={false}
            animate={{
              y: floated ? -9 : 6,
              scale: floated ? 0.78 : 1,
              color: focused ? "#b7aeff" : "#8b8b99",
            }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{ originX: 0 }}
            className={cn(
              "pointer-events-none absolute top-0 text-sm",
              Icon ? "left-11" : "left-4"
            )}
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
            className="w-full bg-transparent pt-2 text-sm text-white caret-brand-soft outline-none placeholder:text-transparent"
          />
        </div>
      </div>

      {/* Focus ring: the whole edge lifts to brand on engagement. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl border border-brand/50"
        animate={{ opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      />
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            Request early access
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
            No password required. We email you a secure sign-in link.
          </p>
        </div>

        <div className="space-y-3">
          <SpotlightInput label="Full name" icon={User} />
          <SpotlightInput label="Work email" type="email" icon={Mail} />
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-b from-brand to-[#6355e6] px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(124,108,255,0.6)]"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </motion.button>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Trusted by 2,400 teams. No credit card to start.
        </p>
      </div>
    </div>
  );
}
