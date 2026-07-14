import type { Metadata } from "next";
import { PricingView } from "@/components/site/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free. Go Pro once and own every premium component, template, and future release. No subscription.",
};

export default function PricingPage() {
  return <PricingView />;
}
