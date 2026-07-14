import type { RegistryEntry } from "./types";
import StepperDemo from "@/components/library/stepper";
import BreadcrumbsDemo from "@/components/library/breadcrumbs";
import TagInputDemo from "@/components/library/tag-input";
import TimelineHorizontalDemo from "@/components/library/timeline-horizontal";
import GaugeDemo from "@/components/library/gauge";
import MegaMenuDemo from "@/components/library/mega-menu";
import KanbanBoardDemo from "@/components/library/kanban-board";
import TestimonialCarouselDemo from "@/components/library/testimonial-carousel";

export const signatureGEntries: RegistryEntry[] = [
  {
    slug: "stepper",
    name: "Stepper",
    description:
      "A multi-step progress stepper with an animated connecting line and spring checks.",
    category: "forms",
    tier: "free",
    component: StepperDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "breadcrumbs",
    name: "Breadcrumbs",
    description:
      "An animated breadcrumb trail with chevron separators and a hover underline slide.",
    category: "navigation",
    tier: "free",
    component: BreadcrumbsDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "tag-input",
    name: "Tag Input",
    description:
      "A chip input that types and springs new tags in on a loop, with removable chips.",
    category: "forms",
    tier: "free",
    component: TagInputDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "timeline-horizontal",
    name: "Horizontal Timeline",
    description:
      "A horizontal milestone timeline with a progress fill that activates each card as it passes.",
    category: "grids",
    tier: "free",
    component: TimelineHorizontalDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "gauge",
    name: "Gauge",
    description:
      "An animated gauge with a gradient arc and a value that eases to its reading on a loop.",
    category: "grids",
    tier: "pro",
    component: GaugeDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "mega-menu",
    name: "Mega Menu",
    description:
      "A nav item that drops a rich mega-menu panel of icon links and a featured promo tile.",
    category: "navigation",
    tier: "pro",
    component: MegaMenuDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "kanban-board",
    name: "Kanban Board",
    description:
      "A compact three-column board where a task card animates between columns on a loop.",
    category: "sections",
    tier: "pro",
    component: KanbanBoardDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "testimonial-carousel",
    name: "Testimonial Carousel",
    description:
      "A single-testimonial carousel that auto-rotates quotes with avatars, ratings, and dots.",
    category: "testimonials",
    tier: "free",
    component: TestimonialCarouselDemo,
    previewClassName: "h-[440px]",
  },
];
