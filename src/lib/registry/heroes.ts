import type { RegistryEntry } from "./types";
import LampHeroDemo from "@/components/library/lamp-hero";
import SpotlightHeroDemo from "@/components/library/spotlight-hero";
import HeroParallaxGridDemo from "@/components/library/hero-parallax-grid";
import FloatingNavbarDemo from "@/components/library/floating-navbar";
import DockMenuDemo from "@/components/library/dock-menu";
import SidebarRevealDemo from "@/components/library/sidebar-reveal";
import StickyScrollRevealDemo from "@/components/library/sticky-scroll-reveal";
import TimelineDemo from "@/components/library/timeline";
import LinkPreviewHoverDemo from "@/components/library/link-preview-hover";

export const heroesEntries: RegistryEntry[] = [
  {
    slug: "lamp-hero",
    name: "Lamp Hero",
    description:
      "An Aceternity-style lamp: a glowing horizontal light bar with a conic gradient cone illuminating a headline.",
    category: "heroes",
    tier: "free",
    component: LampHeroDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "spotlight-hero",
    name: "Spotlight Hero",
    description:
      "A hero section with a large angled SVG spotlight sweeping in behind the headline.",
    category: "heroes",
    tier: "free",
    component: SpotlightHeroDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "hero-parallax-grid",
    name: "Hero Parallax Grid",
    description:
      "Scroll-driven parallax rows of gradient product cards that tilt in 3D as you scroll.",
    category: "heroes",
    tier: "pro",
    component: HeroParallaxGridDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "floating-navbar",
    name: "Floating Navbar",
    description:
      "A navbar that hides on scroll down and reappears floating and condensed on scroll up.",
    category: "navigation",
    tier: "free",
    component: FloatingNavbarDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "dock-menu",
    name: "Dock Menu",
    description:
      "A macOS-style dock with icon magnification that follows the cursor.",
    category: "navigation",
    tier: "free",
    component: DockMenuDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "sidebar-reveal",
    name: "Sidebar Reveal",
    description:
      "A collapsible icon sidebar that expands on hover, sliding labels into view.",
    category: "navigation",
    tier: "pro",
    component: SidebarRevealDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "sticky-scroll-reveal",
    name: "Sticky Scroll Reveal",
    description:
      "Left content stays sticky while right-side entries scroll and activate in sequence.",
    category: "grids",
    tier: "pro",
    component: StickyScrollRevealDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "timeline",
    name: "Timeline",
    description:
      "A vertical timeline with a scroll-progress line that fills as entries fade in.",
    category: "grids",
    tier: "free",
    component: TimelineDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "link-preview-hover",
    name: "Link Preview Hover",
    description:
      "An inline link that reveals a floating animated preview card on hover.",
    category: "navigation",
    tier: "pro",
    component: LinkPreviewHoverDemo,
    previewClassName: "h-[420px]",
  },
];
