import type { RegistryEntry } from "./types";
import ShimmerButtonDemo from "@/components/library/shimmer-button";
import MovingBorderButtonDemo from "@/components/library/moving-border-button";
import MagneticButtonDemo from "@/components/library/magnetic-button";
import GlowButtonDemo from "@/components/library/glow-button";
import AnimatedTabsDemo from "@/components/library/animated-tabs";
import SpotlightInputDemo from "@/components/library/spotlight-input";
import NewsletterSignupDemo from "@/components/library/newsletter-signup";
import MultiStepFormDemo from "@/components/library/multi-step-form";
import AnimatedCheckboxGroupDemo from "@/components/library/animated-checkbox-group";

export const buttonsEntries: RegistryEntry[] = [
  {
    slug: "shimmer-button",
    name: "Shimmer Button",
    description: "A dark button with a traveling shimmer highlight.",
    category: "buttons",
    tier: "free",
    component: ShimmerButtonDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "moving-border-button",
    name: "Moving Border Button",
    description: "A glowing dot travels continuously around the button border.",
    category: "buttons",
    tier: "free",
    component: MovingBorderButtonDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "magnetic-button",
    name: "Magnetic Button",
    description: "A button that magnetically pulls toward the cursor with a spring release.",
    category: "buttons",
    tier: "free",
    component: MagneticButtonDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "glow-button",
    name: "Glow Button",
    description: "A gradient glow that intensifies and scales on hover and press.",
    category: "buttons",
    tier: "free",
    component: GlowButtonDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "animated-tabs",
    name: "Animated Tabs",
    description: "Tabs with a sliding pill indicator powered by layoutId.",
    category: "navigation",
    tier: "free",
    component: AnimatedTabsDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "spotlight-input",
    name: "Spotlight Input",
    description: "An input with a focus glow ring and an animated floating label.",
    category: "forms",
    tier: "free",
    component: SpotlightInputDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "newsletter-signup",
    name: "Newsletter Signup",
    description: "A polished email capture row with an animated success state.",
    category: "forms",
    tier: "free",
    component: NewsletterSignupDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "multi-step-form",
    name: "Multi-Step Form",
    description: "A 3-step animated form with a progress bar and slide transitions.",
    category: "forms",
    tier: "pro",
    component: MultiStepFormDemo,
    previewClassName: "h-[480px]",
  },
  {
    slug: "animated-checkbox-group",
    name: "Animated Checkbox Group",
    description: "Checkboxes with a springy check draw and selected chips.",
    category: "forms",
    tier: "pro",
    component: AnimatedCheckboxGroupDemo,
    previewClassName: "h-[480px]",
  },
];
