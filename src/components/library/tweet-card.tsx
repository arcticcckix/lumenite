"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TweetCard({
  name,
  handle,
  body,
  likes = 128,
  gradient = "from-brand to-glow",
  className,
}: {
  name: string;
  handle: string;
  body: string;
  likes?: number;
  gradient?: string;
  className?: string;
}) {
  const [liked, setLiked] = useState(false);
  const count = liked ? likes + 1 : likes;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-line bg-panel p-5 shadow-lg shadow-black/20 transition-colors hover:border-white/20",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white",
            gradient
          )}
        >
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-semibold text-white">{name}</span>
            <BadgeCheck className="h-4 w-4 shrink-0 fill-brand text-panel" />
          </div>
          <span className="text-[13px] text-zinc-500">@{handle}</span>
        </div>
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-zinc-200">{body}</p>

      <div className="mt-4 flex items-center justify-between text-zinc-500">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">24</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Repeat2 className="h-4 w-4" />
          <span className="text-xs">9</span>
        </div>
        <motion.button
          onClick={() => setLiked((v) => !v)}
          whileTap={{ scale: 0.85 }}
          className="flex items-center gap-1.5"
          aria-label="Like"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={liked ? "filled" : "empty"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  liked ? "fill-rose-500 text-rose-500" : "text-zinc-500"
                )}
              />
            </motion.span>
          </AnimatePresence>
          <span className={cn("text-xs tabular-nums", liked && "text-rose-500")}>
            {count}
          </span>
        </motion.button>
        <Share className="h-4 w-4" />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <TweetCard
        name="Marcus Lin"
        handle="marcuslin"
        body="Swapped our dashboard cards for Lumenite's, shipped a screenshot-worthy UI in an afternoon. The spotlight card alone got 40k impressions."
        likes={312}
      />
    </div>
  );
}
