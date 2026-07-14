import { NextResponse } from "next/server";
import { analyze, type AuditReport } from "@/lib/audit/detect";

// Real server-side audit. Removed from the static GitHub Pages build (the
// client falls back to a simulated report there). Costs ~$0 per call: fetch +
// heuristics. The optional Claude Haiku layer only rewrites section pitches and
// only runs when ANTHROPIC_API_KEY is set.

export const runtime = "nodejs";
export const maxDuration = 20;

const MAX_BYTES = 1_500_000; // 1.5 MB cap
const FETCH_TIMEOUT_MS = 8000;

// --- naive per-instance rate limit (swap for KV/Upstash in production) ---
const HITS = new Map<string, { n: number; t: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now - rec.t > WINDOW_MS) {
    HITS.set(ip, { n: 1, t: now });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_PER_WINDOW;
}

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h === "0.0.0.0") return true;
  // block obvious private / link-local / loopback IP literals (SSRF)
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (h.includes(":")) return true; // raw IPv6 literal — refuse
  return false;
}

function normalizeUrl(raw: string): URL | null {
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u;
  } catch {
    return null;
  }
}

async function fetchHtml(u: URL): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(u.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "LumeniteAuditBot/1.0 (+https://lumenite-ui.example.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const finalHost = new URL(res.url).hostname;
    if (isBlockedHost(finalHost)) throw new Error("blocked-redirect");

    const reader = res.body?.getReader();
    if (!reader) return await res.text();
    let received = 0;
    const chunks: Uint8Array[] = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        received += value.length;
        chunks.push(value);
        if (received > MAX_BYTES) {
          reader.cancel();
          break;
        }
      }
    }
    return new TextDecoder().decode(concat(chunks));
  } finally {
    clearTimeout(timer);
  }
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

// Optional: rewrite the top section pitches with Claude Haiku for a personal
// touch. Cheap + capped. Silently skipped if no key or on any error.
async function aiEnhance(report: AuditReport): Promise<AuditReport> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return report;
  try {
    const top = report.sections.filter((s) => !s.found).slice(0, 4);
    if (top.length === 0) return report;
    const prompt = `You are a website conversion copywriter for a UI component library. For each section below on the site "${report.title}", write ONE punchy sentence (max 22 words) telling the owner why upgrading it matters. Return strict JSON array of strings in the same order.\n\nSections: ${top
      .map((s) => s.label)
      .join(", ")}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return report;
    const data = await res.json();
    const text = data?.content?.[0]?.text ?? "";
    const arr = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1));
    top.forEach((s, i) => {
      if (typeof arr[i] === "string" && arr[i].length > 8) s.pitch = arr[i];
    });
    report.generatedNote = "Personalized by Lumenite AI.";
    return report;
  } catch {
    return report;
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many audits — give it a minute and try again." },
      { status: 429 }
    );
  }

  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url) {
    return NextResponse.json({ error: "Enter a URL to audit." }, { status: 400 });
  }
  const u = normalizeUrl(url);
  if (!u || isBlockedHost(u.hostname)) {
    return NextResponse.json(
      { error: "That doesn't look like a public website URL." },
      { status: 400 }
    );
  }

  let html: string;
  try {
    html = await fetchHtml(u);
  } catch {
    return NextResponse.json(
      {
        error:
          "Couldn't reach that site (it may block bots or be offline). Try another URL.",
      },
      { status: 502 }
    );
  }

  const report = await aiEnhance(analyze(html, u.toString()));
  return NextResponse.json({ report });
}
