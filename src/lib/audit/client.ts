"use client";

import { simulateReport, type AuditReport } from "./detect";

const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type AuditResult =
  | { ok: true; report: AuditReport; demo: boolean }
  | { ok: false; error: string };

export async function runAudit(url: string): Promise<AuditResult> {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, error: "Enter your website URL." };

  if (IS_STATIC_DEMO) {
    // No server on GitHub Pages — return a deterministic simulated report so the
    // funnel is still fully demoable. Real scans run on the Vercel deployment.
    await new Promise((r) => setTimeout(r, 900)); // let the scanner animation play
    return { ok: true, report: simulateReport(trimmed), demo: true };
  }

  try {
    const res = await fetch(`${BASE}/api/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: trimmed }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Audit failed." };
    return { ok: true, report: data.report as AuditReport, demo: false };
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }
}
