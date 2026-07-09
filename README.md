# Recipex 🍳

A playful weekly dinner planner. Pick 3–5 dinners from an open recipe library, watch your protein/cuisine variety, get one unified shopping list, and explore ingredient pairings in the Flavor Lab.

## Features

- **Discover** — search TheMealDB and (optionally) Spoonacular for more variety, filter by protein/dish type and cuisine, or shuffle for random inspiration.
- **My Week** — a 3–5 dinner basket with variety pills showing your protein and cuisine spread.
- **Shopping List** — every ingredient across your week, duplicates merged (quantities summed when units match) and grouped by store aisle.
- **Flavor Lab** — an interactive ingredient-pairing graph inspired by [FlavorGraph](https://github.com/lamypark/FlavorGraph) / [Epicure](https://huggingface.co/datasets/Kaikaku/epicure-corpus-resources). Click nodes to explore, then jump to recipes using that ingredient.

Everything is stored in your browser's localStorage — no accounts, no required env vars.

## Recipe sources

TheMealDB is the primary source and needs no setup. Spoonacular is an optional
second source that adds more variety (and photos, unlike most bulk recipe
datasets) — see `.env.local.example` for the one env var to set. Without it,
the app runs on TheMealDB alone. Both are normalized to the same shape behind
`lib/recipeSources.js`, so the rest of the app doesn't know which API a given
recipe came from.

Spoonacular's free tier is 50 points/day (no credit card), so `recipeSources`
weights toward TheMealDB (unlimited) and only tops results up with a couple
of Spoonacular calls per search — quota exhaustion fails silently back to
MealDB-only results rather than breaking the page.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel (free)

Option A — CLI:

```bash
npm i -g vercel
vercel
```

Option B — Git: push this folder to a GitHub repo, then import it at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Next.js; no configuration needed.

## Regenerating flavor pairings from real embeddings

The Flavor Lab ships with a hand-curated pairing dataset (`data/pairings.js`) so it works instantly and offline. To rebuild it from real ingredient embeddings — either [Epicure](https://huggingface.co/datasets/Kaikaku/epicure-corpus-resources) (recommended) or the original [FlavorGraph](https://github.com/lamypark/FlavorGraph) — see the instructions at the top of `scripts/build_flavorgraph.py`.

## Stack

Next.js 14 (App Router) · React 18 · d3-force · hand-rolled CSS design system · TheMealDB API · Spoonacular API (optional)
