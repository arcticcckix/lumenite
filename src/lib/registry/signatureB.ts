import type { RegistryEntry } from "./types";
import TerminalDemo from "@/components/library/terminal";
import DeviceMockupDemo from "@/components/library/device-mockup";
import TweetCardDemo from "@/components/library/tweet-card";
import CodeComparisonDemo from "@/components/library/code-comparison";
import AnimatedListDemo from "@/components/library/animated-list";
import OrbitingLogosDemo from "@/components/library/orbiting-logos";
import ConfettiButtonDemo from "@/components/library/confetti-button";

export const signatureBEntries: RegistryEntry[] = [
  {
    slug: "terminal",
    name: "Terminal",
    description:
      "A macOS-style terminal window that types out a realistic install command with colored output and a blinking cursor, looping on a clean cycle.",
    category: "cards",
    tier: "free",
    component: TerminalDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "device-mockup",
    name: "Device Mockup",
    description:
      "A rounded browser window with a URL bar containing a tiny animated dashboard — growing chart bars and live activity rows.",
    category: "cards",
    tier: "pro",
    component: DeviceMockupDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "tweet-card",
    name: "Tweet Card",
    description:
      "A polished embedded-social-post card with a gradient avatar, verified badge, and a heart that fills and ticks up its count on click.",
    category: "testimonials",
    tier: "free",
    component: TweetCardDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "code-comparison",
    name: "Code Comparison",
    description:
      "A before/after diff view with red and green line highlights, line numbers, and filename tab headers over realistic React code.",
    category: "cards",
    tier: "pro",
    component: CodeComparisonDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "animated-list",
    name: "Animated List",
    description:
      "A vertical activity feed where gradient-tile notification cards slide and stack in one by one on a loop.",
    category: "sections",
    tier: "free",
    component: AnimatedListDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "orbiting-logos",
    name: "Orbiting Logos",
    description:
      "A central brand tile with integration icon chips orbiting at three radii and speeds, built from pure transforms.",
    category: "effects",
    tier: "free",
    component: OrbitingLogosDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "confetti-button",
    name: "Confetti Button",
    description:
      "A button that bursts a seeded canvas confetti spray on click, with tasteful theme-matched colors and a springy press state.",
    category: "buttons",
    tier: "free",
    component: ConfettiButtonDemo,
    previewClassName: "h-[420px]",
  },
];
