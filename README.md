# Recipex 🍳

A playful weekly dinner planner. Pick 3–5 dinners from an open recipe library, watch your protein/cuisine variety, get one unified shopping list, and explore ingredient pairings in the Flavor Lab.

## Features

- **Discover** — search TheMealDB (free, open recipe API), filter by protein/dish type and cuisine, or shuffle for random inspiration.
- **My Week** — a 3–5 dinner basket with variety pills showing your protein and cuisine spread.
- **Shopping List** — every ingredient across your week, duplicates merged (quantities summed when units match) and grouped by store aisle.
- **Flavor Lab** — an interactive ingredient-pairing graph inspired by [FlavorGraph](https://github.com/lamypark/FlavorGraph). Click nodes to explore, then jump to recipes using that ingredient.

Everything is stored in your browser's localStorage — no accounts, no backend, no env vars.

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

## Regenerating flavor pairings from real FlavorGraph embeddings

The Flavor Lab ships with a hand-curated pairing dataset (`data/pairings.js`) so it works instantly and offline. To rebuild it from the actual FlavorGraph model output, see the instructions at the top of `scripts/build_flavorgraph.py`.

## Stack

Next.js 14 (App Router) · React 18 · d3-force · hand-rolled CSS design system · TheMealDB API
