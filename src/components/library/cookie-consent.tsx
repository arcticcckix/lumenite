"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent({
  onAccept,
  onDecline,
  className,
}: {
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
}) {
  const [choice, setChoice] = useState<"accepted" | "declined" | null>(null);

  function handleAccept() {
    setChoice("accepted");
    onAccept?.();
  }

  function handleDecline() {
    setChoice("declined");
    onDecline?.();
  }

  return (
    <AnimatePresence>
      {!choice && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.25 } }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={cn(
            "w-full max-w-sm rounded-2xl border border-line bg-panel p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
            className
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-soft">
              <Cookie className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">We use cookies</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                We use cookies to improve your experience and analyze site
                traffic. Choose what works for you.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleDecline}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand/90"
            >
              Accept all
            </button>
          </div>
        </motion.div>
      )}
      {choice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-full max-w-sm rounded-full border border-line bg-panel px-4 py-2 text-center text-xs text-zinc-400"
        >
          {choice === "accepted" ? "Preferences saved — thanks!" : "Only essential cookies enabled."}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-end justify-end bg-[#050508] p-6">
      <CookieConsent />
    </div>
  );
}
