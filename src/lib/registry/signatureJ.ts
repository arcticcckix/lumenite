import type { RegistryEntry } from "./types";
import ActivityHeatmapDemo from "@/components/library/activity-heatmap";
import StatusTimelineDemo from "@/components/library/status-timeline";
import TreeViewDemo from "@/components/library/tree-view";
import PhoneInputDemo from "@/components/library/phone-input";
import BannerAlertDemo from "@/components/library/banner-alert";
import SplitButtonDemo from "@/components/library/split-button";
import TabsVerticalDemo from "@/components/library/tabs-vertical";
import MetricCardGroupDemo from "@/components/library/metric-card-group";

export const signatureJEntries: RegistryEntry[] = [
  {
    slug: "activity-heatmap",
    name: "Activity Heatmap",
    description:
      "A contribution-style heatmap with intensity-tinted cells, a legend, and a brightening wave.",
    category: "grids",
    tier: "free",
    component: ActivityHeatmapDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "status-timeline",
    name: "Status Timeline",
    description:
      "A status-page timeline with colored status dots and entries that slide in on a loop.",
    category: "sections",
    tier: "free",
    component: StatusTimelineDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "tree-view",
    name: "Tree View",
    description:
      "A file-tree explorer with expand/collapse folders, type icons, and an auto-moving selection.",
    category: "navigation",
    tier: "pro",
    component: TreeViewDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "phone-input",
    name: "Phone Input",
    description:
      "An international phone field with a country selector and formatted number, animated on a loop.",
    category: "forms",
    tier: "free",
    component: PhoneInputDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "banner-alert",
    name: "Banner Alert",
    description:
      "Info, success, warning, and error banners with an action and a dismiss that collapses.",
    category: "sections",
    tier: "free",
    component: BannerAlertDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "split-button",
    name: "Split Button",
    description:
      "A primary action plus a chevron menu of alternates that updates the primary with a spring.",
    category: "buttons",
    tier: "free",
    component: SplitButtonDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "tabs-vertical",
    name: "Vertical Tabs",
    description:
      "Vertical tabs with a sliding indicator and icons that crossfade a matching content panel.",
    category: "navigation",
    tier: "free",
    component: TabsVerticalDemo,
    previewClassName: "h-[440px]",
  },
  {
    slug: "metric-card-group",
    name: "Metric Cards",
    description:
      "A row of KPI cards with count-up values, trend chips, and sparklines that draw in.",
    category: "grids",
    tier: "pro",
    component: MetricCardGroupDemo,
    previewClassName: "h-[440px]",
  },
];
