"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TeamMember {
  name: string;
  role: string;
  gradient?: [string, string];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [hovering, setHovering] = useState(false);
  const [from, to] = member.gradient ?? ["#7c6cff", "#5b8cff"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative aspect-[3/3.4] overflow-hidden rounded-2xl border border-line"
    >
      <div
        className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white"
        style={{
          background: `linear-gradient(140deg, ${from}, ${to})`,
        }}
      >
        {initials(member.name)}
      </div>

      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4"
        initial={{ y: "70%" }}
        animate={{ y: hovering ? "0%" : "70%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <p className="text-sm font-semibold text-white">{member.name}</p>
        <motion.p
          className="mt-1 text-xs text-zinc-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovering ? 1 : 0 }}
          transition={{ duration: 0.25, delay: hovering ? 0.1 : 0 }}
        >
          {member.role}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export function TeamGrid({
  members,
  className,
}: {
  members: TeamMember[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-4", className)}>
      {members.map((m, i) => (
        <TeamCard key={m.name} member={m} index={i} />
      ))}
    </div>
  );
}

const DEMO: TeamMember[] = [
  { name: "Ava Chen", role: "Founder & CEO", gradient: ["#7c6cff", "#5b8cff"] },
  { name: "Marcus Reed", role: "Head of Design", gradient: ["#5b8cff", "#4fd1c5"] },
  { name: "Sofia Lima", role: "Lead Engineer", gradient: ["#a78bfa", "#7c6cff"] },
  { name: "Jonah Park", role: "Growth", gradient: ["#f2734f", "#7c6cff"] },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#050508] p-6">
      <TeamGrid className="w-full max-w-xl" members={DEMO} />
    </div>
  );
}
