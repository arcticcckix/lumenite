import type { RegistryEntry } from "./types";
import HowItWorksDemo from "@/components/library/how-it-works";
import CtaBannerDemo from "@/components/library/cta-banner";
import TestimonialWallDemo from "@/components/library/testimonial-wall";
import TeamGridDemo from "@/components/library/team-grid";
import ChangelogFeedDemo from "@/components/library/changelog-feed";
import CookieConsentDemo from "@/components/library/cookie-consent";
import ChatBubbleDemo from "@/components/library/chat-bubble";
import MegaFooterDemo from "@/components/library/mega-footer";

export const sectionsEntries: RegistryEntry[] = [
  {
    slug: "how-it-works",
    name: "How It Works",
    description:
      "Three-step process section with a line that draws between steps as they enter the viewport.",
    category: "sections",
    tier: "free",
    component: HowItWorksDemo,
    previewClassName: "h-[460px]",
  },
  {
    slug: "cta-banner",
    name: "CTA Banner",
    description:
      "Full-width gradient CTA banner with grain texture, floating orbs and a magnetic button.",
    category: "sections",
    tier: "free",
    component: CtaBannerDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "testimonial-wall",
    name: "Testimonial Wall",
    description:
      "Masonry-style wall of testimonial cards with staggered entrance and hover highlight.",
    category: "testimonials",
    tier: "pro",
    component: TestimonialWallDemo,
    previewClassName: "h-[460px]",
  },
  {
    slug: "team-grid",
    name: "Team Grid",
    description:
      "Team member grid with gradient-initial avatars and a role reveal that slides up on hover.",
    category: "sections",
    tier: "free",
    component: TeamGridDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "changelog-feed",
    name: "Changelog Feed",
    description:
      "Vertical release feed with version badges, dates and an animated left-border progress line.",
    category: "sections",
    tier: "free",
    component: ChangelogFeedDemo,
    previewClassName: "h-[460px]",
  },
  {
    slug: "cookie-consent",
    name: "Cookie Consent",
    description:
      "Polished corner cookie-consent card that springs in on mount and collapses on choice.",
    category: "sections",
    tier: "free",
    component: CookieConsentDemo,
    previewClassName: "h-[420px]",
  },
  {
    slug: "chat-bubble",
    name: "Chat Bubble",
    description:
      "Floating chat button that expands into a mini chat panel with a typing indicator.",
    category: "sections",
    tier: "pro",
    component: ChatBubbleDemo,
    previewClassName: "h-[460px]",
  },
  {
    slug: "mega-footer",
    name: "Mega Footer",
    description:
      "Large footer with a newsletter row, link columns, social icons and a top border glow.",
    category: "sections",
    tier: "free",
    component: MegaFooterDemo,
    previewClassName: "h-[460px]",
  },
];
