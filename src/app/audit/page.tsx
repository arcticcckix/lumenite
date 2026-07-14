import type { Metadata } from "next";
import { AuditTool } from "@/components/site/audit";

export const metadata: Metadata = {
  title: "Free AI Site Audit",
  description:
    "Paste your URL and Lumenite's AI scans your site, finds every section you can upgrade, and shows the exact components to use.",
};

export default function AuditPage() {
  return <AuditTool />;
}
