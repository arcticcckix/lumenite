"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Video, Plus, ArrowUp, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Sender = "them" | "me";

interface Line {
  from: Sender;
  text: string;
  time: string;
}

interface Msg extends Line {
  id: number;
}

interface Person {
  name: string;
  initials: string;
  gradient: string;
}

const MAYA: Person = {
  name: "Maya Rivera",
  initials: "MR",
  gradient: "bg-gradient-to-br from-[#7c6cff] to-[#5b8cff]",
};

const ME: Person = {
  name: "Jordan Lee",
  initials: "JL",
  gradient: "bg-gradient-to-br from-[#3f3f56] to-[#6b6b8c]",
};

const THREAD: Line[] = [
  { from: "them", text: "Morning! Did the onboarding flow make it in overnight?", time: "9:41 AM" },
  { from: "me", text: "Merged it around six. Staging is looking clean.", time: "9:41 AM" },
  { from: "them", text: "The new empty state feels so much friendlier now.", time: "9:42 AM" },
  { from: "me", text: "Took three passes to land the copy. Worth it.", time: "9:43 AM" },
  { from: "them", text: "Design is going to love this. Can we demo Thursday?", time: "9:44 AM" },
  { from: "me", text: "Booked the room, I'll prep a short walkthrough.", time: "9:45 AM" },
  { from: "them", text: "You're a lifesaver. Coffee is on me.", time: "9:46 AM" },
  { from: "me", text: "Deal. See you at ten.", time: "9:47 AM" },
];

const SEED_COUNT = 3;
const MAX_VISIBLE = 5;

function Avatar({
  person,
  size = 28,
  className,
}: {
  person: Person;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]",
        person.gradient,
        className
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {person.initials}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-zinc-400"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.16,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function ChatThread({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    let idc = 0;
    setMessages(THREAD.slice(0, SEED_COUNT).map((line) => ({ ...line, id: idc++ })));
    let cursor = SEED_COUNT;

    async function run() {
      await wait(1700);
      while (!cancelled) {
        const line = THREAD[cursor % THREAD.length];
        if (line.from === "them") {
          setTyping(true);
          await wait(1500);
          if (cancelled) return;
          setTyping(false);
        } else {
          await wait(900);
          if (cancelled) return;
        }
        const next: Msg = { ...line, id: idc++ };
        setMessages((prev) => {
          const grown = [...prev, next];
          return grown.length > MAX_VISIBLE ? grown.slice(grown.length - MAX_VISIBLE) : grown;
        });
        cursor += 1;
        await wait(line.from === "them" ? 1900 : 1500);
      }
    }

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-panel shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_55%_at_50%_0%,rgba(124,108,255,0.09),transparent_60%)]"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="relative">
          <Avatar person={MAYA} size={38} />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50"
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative h-2.5 w-2.5 rounded-full border-2 border-panel bg-emerald-400" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{MAYA.name}</p>
          <p className="text-[11px] font-medium text-emerald-400/90">Active now</p>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          aria-label="Voice call"
        >
          <Phone className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          aria-label="Video call"
        >
          <Video className="h-4 w-4" />
        </button>
      </header>

      {/* Messages */}
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-panel to-transparent" />
        <div className="flex h-full flex-col justify-end gap-3 px-4 pb-3 pt-5">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const mine = m.from === "me";
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={cn("flex items-end gap-2", mine && "flex-row-reverse")}
                >
                  <Avatar person={mine ? ME : MAYA} size={26} className="mb-4" />
                  <div
                    className={cn(
                      "flex max-w-[76%] flex-col gap-1",
                      mine ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-3.5 py-2 text-[13px] leading-relaxed",
                        mine
                          ? "rounded-2xl rounded-br-md bg-gradient-to-br from-[#7c6cff] to-[#6a58ef] text-white shadow-[0_8px_22px_-8px_rgba(124,108,255,0.6),inset_0_1px_0_0_rgba(255,255,255,0.18)]"
                          : "rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] text-zinc-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      )}
                    >
                      {m.text}
                    </div>
                    <span
                      className={cn(
                        "flex items-center gap-1 px-1 text-[10px] text-zinc-600",
                        mine && "flex-row-reverse"
                      )}
                    >
                      {m.time}
                      {mine && <CheckCheck className="h-3 w-3 text-brand-soft/80" />}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {typing && (
              <motion.div
                key="typing"
                layout
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.9 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-end gap-2"
              >
                <Avatar person={MAYA} size={26} className="mb-1" />
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-3.5 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Composer */}
      <footer className="relative z-10 flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-3 py-3">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          aria-label="Add attachment"
        >
          <Plus className="h-4.5 w-4.5" />
        </button>
        <div className="flex h-9 flex-1 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-[13px] text-zinc-500">
          <span>Message Maya</span>
          <motion.span
            className="ml-0.5 inline-block h-4 w-px bg-brand"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.button
          type="button"
          aria-label="Send message"
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 6px 18px -6px rgba(124,108,255,0.55)",
              "0 6px 26px -4px rgba(124,108,255,0.85)",
              "0 6px 18px -6px rgba(124,108,255,0.55)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c6cff] to-[#5b8cff] text-white"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </motion.button>
      </footer>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-void p-6">
      <ChatThread className="w-full max-w-[360px]" />
    </div>
  );
}
