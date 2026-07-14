import type { RegistryEntry } from "./types";
import CardFlipDemo from "@/components/library/card-flip";
import CarouselDemo from "@/components/library/carousel";
import SkeletonLoaderDemo from "@/components/library/skeleton-loader";
import FeatureTabsDemo from "@/components/library/feature-tabs";
import MiniChartsDemo from "@/components/library/mini-charts";
import NotificationCenterDemo from "@/components/library/notification-center";
import CalendarWidgetDemo from "@/components/library/calendar-widget";
import ImageTrailDemo from "@/components/library/image-trail";

export const signatureFEntries: RegistryEntry[] = [
  {
    slug: "card-flip",
    name: "Card Flip",
    description:
      "A 3D flip card revealing details on the back, auto-flipping on a gentle loop.",
    category: "cards",
    tier: "free",
    component: CardFlipDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "carousel",
    name: "Carousel",
    description:
      "A snap carousel of gradient slides with dot indicators and auto-advance.",
    category: "effects",
    tier: "free",
    component: CarouselDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "skeleton-loader",
    name: "Skeleton Loader",
    description:
      "Shimmering placeholder blocks that crossfade into loaded content, then loop back.",
    category: "effects",
    tier: "free",
    component: SkeletonLoaderDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "feature-tabs",
    name: "Feature Tabs",
    description:
      "Vertical feature tabs that crossfade a matching preview panel, auto-advancing.",
    category: "sections",
    tier: "free",
    component: FeatureTabsDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "mini-charts",
    name: "Mini Charts",
    description:
      "A dashboard card with an animated line chart, growing bars, and a sweeping donut.",
    category: "grids",
    tier: "pro",
    component: MiniChartsDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "notification-center",
    name: "Notification Center",
    description:
      "A bell with an unread count that opens a sliding feed and a mark-all-read action.",
    category: "sections",
    tier: "pro",
    component: NotificationCenterDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "calendar-widget",
    name: "Calendar Widget",
    description:
      "A clean month calendar with a highlighted today, selected day pill, and event dots.",
    category: "forms",
    tier: "pro",
    component: CalendarWidgetDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "image-trail",
    name: "Image Trail",
    description:
      "Gradient tiles trail and fade behind the cursor, driven by a seeded path at rest.",
    category: "effects",
    tier: "free",
    component: ImageTrailDemo,
    previewClassName: "h-[440px]",
  },
];
