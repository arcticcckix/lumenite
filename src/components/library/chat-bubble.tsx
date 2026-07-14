"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface CannedMessage {
  from: "bot" | "user";
  text: string;
}

const SCRIPT: CannedMessage[] = [
  { from: "bot", text: "Hey there! How can we help you today?" },
  { from: "user", text: "Does Lumenite support Tailwind v4?" },
  { from: "bot", text: "Yes — every component ships with v4 tokens out of the box." },
];

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-zinc-400"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function ChatBubble({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<CannedMessage[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!open) return;
    setVisible([]);
    let cancelled = false;

    async function play() {
      for (const msg of SCRIPT) {
        if (cancelled) return;
        if (msg.from === "bot") {
          setTyping(true);
          await new Promise((r) => setTimeout(r, 700));
          if (cancelled) return;
          setTyping(false);
        } else {
          await new Promise((r) => setTimeout(r, 500));
        }
        if (cancelled) return;
        setVisible((prev) => [...prev, msg]);
      }
    }

    play();
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="absolute bottom-16 right-0 flex h-80 w-72 flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-white">Lumenite Support</p>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {visible.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                    msg.from === "bot"
                      ? "bg-white/5 text-zinc-200"
                      : "ml-auto bg-brand text-white"
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
              {typing && (
                <div className="w-fit rounded-xl bg-white/5">
                  <TypingDots />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-line p-2">
              <input
                readOnly
                placeholder="Type a message..."
                className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 outline-none"
              />
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-glow text-white shadow-[0_10px_30px_rgba(124,108,255,0.4)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-end justify-end bg-[#050508] p-8">
      <ChatBubble />
    </div>
  );
}
