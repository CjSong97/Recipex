// Server-side proxy for the Spoonacular API.
//
// Why this exists: unlike TheMealDB, Spoonacular requires an API key and
// bills every call against a small daily point quota. That key must never
// ship in the client bundle (anyone could read it from the network tab and
// burn your quota), so all Spoonacular calls are routed through this route
// handler, which attaches the key server-side from process.env.
//
// Setup: copy .env.local.example to .env.local and fill in
// SPOONACULAR_API_KEY (get a free key at https://spoonacular.com/food-api/console,
// no credit card required for the free tier — 50 points/day).
//
// If no key is configured, this route returns 501 and lib/spoonacular.js's
// calls fail fast; lib/recipeSources.js catches that and silently falls back
// to TheMealDB-only results, so the app keeps working either way.

const SPOONACULAR_BASE = "https://api.spoonacular.com";

export async function GET(request) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "SPOONACULAR_API_KEY is not configured" },
      { status: 501 }
    );
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path) {
    return Response.json({ error: "Missing path" }, { status: 400 });
  }

  const upstream = new URL(`${SPOONACULAR_BASE}/${path}`);
  for (const [key, value] of searchParams.entries()) {
    if (key === "path") continue;
    upstream.searchParams.set(key, value);
  }
  upstream.searchParams.set("apiKey", apiKey);

  try {
    const res = await fetch(upstream.toString());
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return Response.json({ error: "Spoonacular request failed" }, { status: 502 });
  }
}
