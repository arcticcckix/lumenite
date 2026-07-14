import { NextResponse } from "next/server";

// Validates a Whop license/membership key server-side.
// Set WHOP_API_KEY in the deployment environment (Vercel → Settings → Env Vars).
// Docs: https://dev.whop.com — GET /api/v2/memberships/{id}/validate_license
//
// NOTE: this route is removed automatically for the GitHub Pages static
// showcase build (see .github/workflows/deploy.yml); the client falls back to
// demo-mode validation there.

export async function POST(req: Request) {
  const { key } = (await req.json().catch(() => ({}))) as { key?: string };
  if (!key || typeof key !== "string") {
    return NextResponse.json(
      { valid: false, error: "Missing license key." },
      { status: 400 }
    );
  }

  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        valid: false,
        error:
          "License server not configured yet (WHOP_API_KEY missing). Contact support.",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://api.whop.com/api/v2/memberships/${encodeURIComponent(
        key.trim()
      )}/validate_license`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata: {} }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { valid: false, error: "License key is not valid or has expired." },
        { status: 200 }
      );
    }

    const data = await res.json();
    const valid = data?.valid !== false && data?.status !== "expired";
    return NextResponse.json({
      valid,
      plan: data?.plan?.plan_type === "team" ? "team" : "pro",
      email: data?.email ?? undefined,
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Could not reach the license provider." },
      { status: 502 }
    );
  }
}
