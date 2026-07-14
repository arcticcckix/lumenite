import type { RegistryEntry } from "./types";
import AnimatedModalDemo from "@/components/library/animated-modal";
import MultiStepLoaderDemo from "@/components/library/multi-step-loader";
import SparklesTextDemo from "@/components/library/sparkles-text";
import SpinningTextDemo from "@/components/library/spinning-text";
import SpotlightCursorDemo from "@/components/library/spotlight-cursor";
import GooeyNavDemo from "@/components/library/gooey-nav";
import ScrollProgressDemo from "@/components/library/scroll-progress";
import PricingToggleDemo from "@/components/library/pricing-toggle";

export const signatureEEntries: RegistryEntry[] = [
  {
    slug: "animated-modal",
    name: "Animated Modal",
    description:
      "A modal that springs in over a blurred backdrop, auto-cycling open and closed in the demo.",
    category: "effects",
    tier: "free",
    component: AnimatedModalDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "multi-step-loader",
    name: "Multi Step Loader",
    description:
      "A loading overlay that steps through status messages, checking each off as it completes.",
    category: "effects",
    tier: "free",
    component: MultiStepLoaderDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "sparkles-text",
    name: "Sparkles Text",
    description:
      "A gradient headline with small star sparkles popping and fading around the letters.",
    category: "text",
    tier: "free",
    component: SparklesTextDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "spinning-text",
    name: "Spinning Text",
    description:
      "Text laid around a continuously rotating circle with a mark in the center.",
    category: "text",
    tier: "free",
    component: SpinningTextDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "spotlight-cursor",
    name: "Spotlight Cursor",
    description:
      "A soft circular spotlight that brightens dimmed content as it follows the cursor or drifts.",
    category: "effects",
    tier: "free",
    component: SpotlightCursorDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "gooey-nav",
    name: "Gooey Nav",
    description:
      "A nav whose active indicator is a gooey liquid blob that stretches between items.",
    category: "navigation",
    tier: "free",
    component: GooeyNavDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "scroll-progress",
    name: "Scroll Progress",
    description:
      "A gradient reading-progress bar with a circular percentage indicator over an article layout.",
    category: "navigation",
    tier: "free",
    component: ScrollProgressDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "pricing-toggle",
    name: "Pricing Toggle",
    description:
      "A monthly/annual billing toggle whose price rolls between values with a save chip.",
    category: "forms",
    tier: "free",
    component: PricingToggleDemo,
    previewClassName: "h-[440px]",
  },
];
