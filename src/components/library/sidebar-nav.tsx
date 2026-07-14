"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  LineChart,
  FolderKanban,
  Users,
  UserRound,
  ShieldCheck,
  CreditCard,
  Settings,
  ChevronRight,
  ChevronsUpDown,
  Check,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Group = "platform" | "team" | "account";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  group: Group;
  badge?: string;
}

interface Workspace {
  id: string;
  name: string;
  plan: string;
  from: string;
  to: string;
}

const WORKSPACES: Workspace[] = [
  { id: "lumenite", name: "Lumenite", plan: "Pro workspace", from: "#7c6cff", to: "#5b8cff" },
  { id: "northwind", name: "Northwind Labs", plan: "Team plan", from: "#f472b6", to: "#f59e0b" },
  { id: "meridian", name: "Meridian", plan: "Free plan", from: "#34d399", to: "#22d3ee" },
];

// Ordered exactly as they render, so the idle loop reads top-to-bottom.
const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "platform" },
  { id: "analytics", label: "Analytics", icon: LineChart, group: "platform" },
  { id: "projects", label: "Projects", icon: FolderKanban, group: "platform", badge: "6" },
  { id: "members", label: "Members", icon: UserRound, group: "team", badge: "24" },
  { id: "permissions", label: "Permissions", icon: ShieldCheck, group: "team" },
  { id: "billing", label: "Billing", icon: CreditCard, group: "account" },
  { id: "settings", label: "Settings", icon: Settings, group: "account" },
];

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
      {children}
    </div>
  );
}

function ItemBody({
  item,
  active,
  sub = false,
}: {
  item: NavItem;
  active: boolean;
  sub?: boolean;
}) {
  const Icon = item.icon;
  return (
    <>
      <Icon
        className={cn(
          "relative z-10 shrink-0 transition-colors duration-200",
          sub ? "h-[15px] w-[15px]" : "h-[17px] w-[17px]",
          active ? "text-brand-soft" : "text-zinc-500 group-hover/i:text-zinc-300"
        )}
      />
      <span
        className={cn(
          "relative z-10 truncate transition-colors duration-200",
          sub ? "text-[12.5px]" : "text-[13px]",
          active ? "font-medium text-white" : "text-zinc-400 group-hover/i:text-zinc-200"
        )}
      >
        {item.label}
      </span>
      {item.badge ? (
        <span
          className={cn(
            "relative z-10 ml-auto rounded-full px-1.5 py-px text-[10px] font-medium tabular-nums transition-colors",
            active
              ? "bg-brand/25 text-brand-soft"
              : "bg-white/[0.04] text-zinc-500 group-hover/i:text-zinc-400"
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </>
  );
}

function ActivePill({ uid }: { uid: string }) {
  return (
    <>
      <motion.span
        layoutId={`${uid}-pill`}
        className="absolute inset-0 rounded-lg border border-white/[0.09] bg-brand/[0.13]"
        style={{
          boxShadow:
            "0 10px 26px -16px rgba(124,108,255,0.95), inset 0 1px 0 0 rgba(255,255,255,0.06)",
        }}
        transition={{ duration: 0.42, ease: EASE }}
      />
      <motion.span
        layoutId={`${uid}-bar`}
        className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-brand-soft"
        style={{ boxShadow: "0 0 10px rgba(169,157,255,0.85)" }}
        transition={{ duration: 0.42, ease: EASE }}
      />
    </>
  );
}

export function SidebarNav({
  className,
  autoCycle = true,
  onActiveChange,
}: {
  className?: string;
  autoCycle?: boolean;
  onActiveChange?: (id: string) => void;
}) {
  const uid = useId();
  const reduceMotion = useReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  const [workspaceIdx, setWorkspaceIdx] = useState(0);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [manualTeam, setManualTeam] = useState(false);
  const [paused, setPaused] = useState(false);

  const active = NAV[activeIdx];
  const activeIsTeam = active.group === "team";
  // Derived synchronously so the shared pill can slide into the section on the
  // very same frame the loop reaches a team item (no unmount / pop).
  const teamOpen = activeIsTeam || manualTeam;
  const workspace = WORKSPACES[workspaceIdx];

  const teamCount = useMemo(() => NAV.filter((n) => n.group === "team").length, []);

  const pausedRef = useRef(paused);
  pausedRef.current = paused || switcherOpen;

  useEffect(() => {
    onActiveChange?.(active.id);
  }, [active.id, onActiveChange]);

  // Idle life: quietly advance the selection so a static preview reads as a
  // working product. Pauses while the user is exploring the sidebar.
  useEffect(() => {
    if (!autoCycle || reduceMotion) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIdx((i) => (i + 1) % NAV.length);
    }, 2400);
    return () => clearInterval(id);
  }, [autoCycle, reduceMotion]);

  function selectItem(idx: number) {
    setActiveIdx(idx);
  }

  const platform = NAV.filter((n) => n.group === "platform");
  const team = NAV.filter((n) => n.group === "team");
  const account = NAV.filter((n) => n.group === "account");

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setSwitcherOpen(false);
      }}
      className={cn(
        "relative flex h-full w-[264px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl",
        className
      )}
    >
      {/* frosted lighting: thin top edge + soft brand glow behind the header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />

      {/* workspace switcher */}
      <div className="relative z-30 px-2.5 pb-2 pt-2.5">
        <button
          type="button"
          onClick={() => setSwitcherOpen((o) => !o)}
          className="group/ws flex h-11 w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 outline-none transition-colors hover:bg-white/[0.05] focus-visible:ring-1 focus-visible:ring-brand/60"
        >
          <span className="relative h-7 w-7 shrink-0">
            <span
              aria-hidden
              className="absolute inset-0 rounded-[9px] blur-[6px] opacity-60"
              style={{ background: `linear-gradient(135deg, ${workspace.from}, ${workspace.to})` }}
            />
            <span
              className="relative flex h-7 w-7 items-center justify-center rounded-[9px] text-[13px] font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${workspace.from}, ${workspace.to})` }}
            >
              {workspace.name.charAt(0)}
            </span>
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[13px] font-semibold leading-tight text-white">
              {workspace.name}
            </span>
            <span className="block truncate text-[11px] leading-tight text-zinc-500">
              {workspace.plan}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover/ws:text-zinc-300" />
        </button>

        <AnimatePresence>
          {switcherOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="absolute inset-x-2.5 top-[52px] z-40 overflow-hidden rounded-xl border border-white/10 bg-[#101018]/95 p-1 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
              {WORKSPACES.map((ws, i) => {
                const selected = i === workspaceIdx;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => {
                      setWorkspaceIdx(i);
                      setSwitcherOpen(false);
                    }}
                    className="group/w flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left outline-none transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05]"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${ws.from}, ${ws.to})` }}
                    >
                      {ws.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium leading-tight text-zinc-200">
                        {ws.name}
                      </span>
                      <span className="block truncate text-[10.5px] leading-tight text-zinc-500">
                        {ws.plan}
                      </span>
                    </span>
                    {selected ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-brand-soft" />
                    ) : null}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-3 h-px bg-white/[0.06]" />

      {/* navigation */}
      <nav className="relative z-10 flex-1 px-2">
        <GroupLabel>Platform</GroupLabel>
        {platform.map((item) => {
          const idx = NAV.indexOf(item);
          const isActive = idx === activeIdx;
          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => selectItem(idx)}
              onFocus={() => selectItem(idx)}
              onClick={() => selectItem(idx)}
              className="group/i relative flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 outline-none focus-visible:ring-1 focus-visible:ring-brand/60"
            >
              {isActive && <ActivePill uid={uid} />}
              <ItemBody item={item} active={isActive} />
            </button>
          );
        })}

        {/* collapsible section */}
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setManualTeam((o) => !o)}
            className="group/t relative flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 outline-none focus-visible:ring-1 focus-visible:ring-brand/60"
          >
            <Users className="h-[17px] w-[17px] shrink-0 text-zinc-500 transition-colors group-hover/t:text-zinc-300" />
            <span className="text-[13px] font-medium text-zinc-400 transition-colors group-hover/t:text-zinc-200">
              Team
            </span>
            <span className="ml-auto flex items-center gap-2">
              <span className="rounded-full bg-white/[0.04] px-1.5 py-px text-[10px] font-medium tabular-nums text-zinc-500">
                {teamCount}
              </span>
              <motion.span
                animate={{ rotate: teamOpen ? 90 : 0 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="text-zinc-500"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.span>
            </span>
          </button>

          <AnimatePresence initial={false}>
            {teamOpen && (
              <motion.div
                key="team-items"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.34, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="relative ml-[18px] mt-0.5 border-l border-white/[0.07] pl-2">
                  {team.map((item) => {
                    const idx = NAV.indexOf(item);
                    const isActive = idx === activeIdx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => selectItem(idx)}
                        onFocus={() => selectItem(idx)}
                        onClick={() => selectItem(idx)}
                        className="group/i relative flex h-[30px] w-full items-center gap-2.5 rounded-lg px-2.5 outline-none focus-visible:ring-1 focus-visible:ring-brand/60"
                      >
                        {isActive && <ActivePill uid={uid} />}
                        <ItemBody item={item} active={isActive} sub />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <GroupLabel>Account</GroupLabel>
        {account.map((item) => {
          const idx = NAV.indexOf(item);
          const isActive = idx === activeIdx;
          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => selectItem(idx)}
              onFocus={() => selectItem(idx)}
              onClick={() => selectItem(idx)}
              className="group/i relative flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 outline-none focus-visible:ring-1 focus-visible:ring-brand/60"
            >
              {isActive && <ActivePill uid={uid} />}
              <ItemBody item={item} active={isActive} />
            </button>
          );
        })}
      </nav>

      {/* user chip */}
      <div className="relative z-10 mt-auto px-2 pb-2.5 pt-1.5">
        <div className="mx-1 mb-1.5 h-px bg-white/[0.06]" />
        <div className="group/u flex h-12 items-center gap-2.5 rounded-xl px-2 transition-colors hover:bg-white/[0.04]">
          <span className="relative h-8 w-8 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-glow to-brand text-[12px] font-semibold text-white">
              MV
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#0b0b10]">
              <span className="relative h-full w-full rounded-full bg-emerald-400">
                {!reduceMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
                  />
                )}
              </span>
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium leading-tight text-white">
              Mara Vance
            </div>
            <div className="truncate text-[11px] leading-tight text-zinc-500">
              mara@lumenite.io
            </div>
          </div>
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 outline-none transition-colors hover:bg-white/[0.06] hover:text-zinc-200 focus-visible:ring-1 focus-visible:ring-brand/60"
            aria-label="Account menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void p-5">
      {/* ambient color so the frosted panel has something to blur over */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-6 h-56 w-56 rounded-full bg-brand/25 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-4 h-56 w-56 rounded-full bg-glow/20 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <SidebarNav className="max-h-full" />
    </div>
  );
}
