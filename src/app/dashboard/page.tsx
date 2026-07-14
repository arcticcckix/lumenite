import type { Metadata } from "next";
import { Dashboard } from "@/components/site/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Activate your license and access Pro components and templates.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
