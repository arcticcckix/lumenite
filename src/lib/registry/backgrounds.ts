import type { RegistryEntry } from "./types";
import AuroraBackgroundDemo from "@/components/library/aurora-background";
import BackgroundBeamsDemo from "@/components/library/background-beams";
import SparklesDemo from "@/components/library/sparkles";
import GridBeamBackgroundDemo from "@/components/library/grid-beam-background";
import MeteorsDemo from "@/components/library/meteors";
import ShootingStarsDemo from "@/components/library/shooting-stars";
import WavyBackgroundDemo from "@/components/library/wavy-background";
import GlowOrbsDemo from "@/components/library/glow-orbs";
import NoiseGradientDemo from "@/components/library/noise-gradient";

export const backgroundsEntries: RegistryEntry[] = [
  {
    slug: "aurora-background",
    name: "Aurora Background",
    description: "An animated aurora gradient backdrop that drifts softly behind content.",
    category: "backgrounds",
    tier: "free",
    component: AuroraBackgroundDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "background-beams",
    name: "Background Beams",
    description: "SVG animated light beams tracing curved paths across a dark canvas.",
    category: "backgrounds",
    tier: "free",
    component: BackgroundBeamsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "sparkles",
    name: "Sparkles",
    description: "A canvas particle field of twinkling sparkles.",
    category: "effects",
    tier: "free",
    component: SparklesDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "grid-beam-background",
    name: "Grid Beam Background",
    description: "A dot/grid background with a traveling glow beam along its lines.",
    category: "backgrounds",
    tier: "free",
    component: GridBeamBackgroundDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "meteors",
    name: "Meteors",
    description: "A meteor shower of diagonal light streaks falling across a card.",
    category: "effects",
    tier: "free",
    component: MeteorsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "shooting-stars",
    name: "Shooting Stars",
    description: "A canvas starfield with periodic shooting stars streaking by.",
    category: "backgrounds",
    tier: "pro",
    component: ShootingStarsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "wavy-background",
    name: "Wavy Background",
    description: "Layered, animated flowing wave blobs rendered on canvas.",
    category: "backgrounds",
    tier: "pro",
    component: WavyBackgroundDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "glow-orbs",
    name: "Glow Orbs",
    description: "Slow-drifting, blurred gradient orbs floating behind your content.",
    category: "backgrounds",
    tier: "free",
    component: GlowOrbsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "noise-gradient",
    name: "Noise Gradient",
    description: "A grainy gradient hero backdrop using an SVG turbulence filter.",
    category: "backgrounds",
    tier: "free",
    component: NoiseGradientDemo,
    previewClassName: "h-[420px]",
  },
];
