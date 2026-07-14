"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 900);
  }

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-line bg-panel p-6",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {status !== "success" ? (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -8 }}
            onSubmit={onSubmit}
            className="flex items-center gap-2"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5">
              <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {status === "loading" ? (
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Sending…
                </motion.span>
              ) : (
                "Subscribe"
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white"
            >
              <Check className="h-4 w-4" />
            </motion.span>
            <div>
              <p className="text-sm font-medium text-white">You&apos;re subscribed!</p>
              <p className="text-xs text-zinc-400">We&apos;ll be in touch soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <div className="w-full max-w-sm text-center">
        <h3 className="mb-1 text-lg font-semibold text-white">Stay in the loop</h3>
        <p className="mb-4 text-sm text-zinc-400">
          Product updates, no spam, unsubscribe anytime.
        </p>
        <NewsletterSignup className="mx-auto text-left" />
      </div>
    </div>
  );
}
