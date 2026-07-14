import type { RegistryEntry } from "./types";
import MarqueeVerticalDemo from "@/components/library/marquee-vertical";
import ColorPickerDemo from "@/components/library/color-picker";
import EmptyStateDemo from "@/components/library/empty-state";
import PaginationDemo from "@/components/library/pagination";
import FaqSearchDemo from "@/components/library/faq-search";
import SidebarNavDemo from "@/components/library/sidebar-nav";
import ProgressRingGroupDemo from "@/components/library/progress-ring-group";
import ChatThreadDemo from "@/components/library/chat-thread";

export const signatureHEntries: RegistryEntry[] = [
  {
    slug: "marquee-vertical",
    name: "Vertical Marquee",
    description:
      "Columns of cards scrolling vertically at different speeds with top and bottom fades.",
    category: "testimonials",
    tier: "free",
    component: MarqueeVerticalDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    description:
      "A saturation square, hue slider, hex readout, and preset swatches that ease through colors.",
    category: "forms",
    tier: "pro",
    component: ColorPickerDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "empty-state",
    name: "Empty State",
    description:
      "A tasteful empty state with a floating CSS illustration, copy, and primary and secondary actions.",
    category: "sections",
    tier: "free",
    component: EmptyStateDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "pagination",
    name: "Pagination",
    description:
      "Numbered pagination with a sliding active pill and prev/next controls, auto-advancing.",
    category: "navigation",
    tier: "free",
    component: PaginationDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "faq-search",
    name: "FAQ Search",
    description:
      "A searchable FAQ that types a query, filters, highlights the match, and expands answers.",
    category: "sections",
    tier: "free",
    component: FaqSearchDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "sidebar-nav",
    name: "Sidebar Nav",
    description:
      "An app sidebar with grouped icon items, a sliding active indicator, workspace switcher and user chip.",
    category: "navigation",
    tier: "pro",
    component: SidebarNavDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "progress-ring-group",
    name: "Progress Rings",
    description:
      "A row of gradient circular progress rings that sweep to their values with center readouts.",
    category: "grids",
    tier: "free",
    component: ProgressRingGroupDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "chat-thread",
    name: "Chat Thread",
    description:
      "A messaging thread with alternating bubbles, avatars, and a typing indicator that resolves on a loop.",
    category: "sections",
    tier: "pro",
    component: ChatThreadDemo,
    previewClassName: "h-[440px]",
  },
];
