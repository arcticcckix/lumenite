"use client";

import { useCallback, useEffect, useState } from "react";

export interface License {
  key: string;
  plan: "pro" | "team";
  email?: string;
  validatedAt: string;
}

const STORAGE_KEY = "lumenite_license";
const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Demo keys that unlock the dashboard in static-demo mode (GitHub Pages). */
const DEMO_KEYS = ["DEMO-2026", "LUM-DEMO"];

export function getStoredLicense(): License | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as License) : null;
  } catch {
    return null;
  }
}

export async function activateLicense(
  key: string
): Promise<{ ok: true; license: License } | { ok: false; error: string }> {
  const trimmed = key.trim();
  if (!trimmed) return { ok: false, error: "Enter your license key." };

  if (IS_STATIC_DEMO) {
    // Static showcase build: no server. Accept demo keys and Whop-shaped keys
    // so the dashboard can be previewed. Real validation happens on the
    // server deployment via /api/license.
    const looksValid =
      DEMO_KEYS.includes(trimmed.toUpperCase()) ||
      /^(mem_|L-|LUM-)[A-Za-z0-9-]{4,}$/.test(trimmed);
    if (!looksValid)
      return {
        ok: false,
        error:
          "Invalid key. This showcase accepts the demo key DEMO-2026 — live deployments validate real Whop keys.",
      };
    const license: License = {
      key: trimmed,
      plan: "pro",
      validatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
    return { ok: true, license };
  }

  try {
    const res = await fetch(`${BASE}/api/license`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: trimmed }),
    });
    const data = await res.json();
    if (!res.ok || !data.valid)
      return { ok: false, error: data.error ?? "License key is not valid." };
    const license: License = {
      key: trimmed,
      plan: data.plan ?? "pro",
      email: data.email,
      validatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
    return { ok: true, license };
  } catch {
    return { ok: false, error: "Could not reach the license server. Try again." };
  }
}

export function clearLicense() {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
}

export function useLicense() {
  const [license, setLicense] = useState<License | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLicense(getStoredLicense());
    setLoaded(true);
  }, []);

  const activate = useCallback(async (key: string) => {
    const result = await activateLicense(key);
    if (result.ok) setLicense(result.license);
    return result;
  }, []);

  const deactivate = useCallback(() => {
    clearLicense();
    setLicense(null);
  }, []);

  return { license, loaded, activate, deactivate, isPro: !!license };
}
