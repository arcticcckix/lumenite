import type { Metadata } from "next";
import { Gallery } from "@/components/site/gallery";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Browse every Lumenite UI component, live previews, copy-paste source, built with Tailwind CSS and Framer Motion.",
};

export default function ComponentsPage() {
  return <Gallery />;
}
