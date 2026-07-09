// Merge layer over TheMealDB (lib/mealdb.js) and Spoonacular (lib/spoonacular.js).
//
// Both sources normalize to the same MealDB-shaped object, so callers
// (app/page.jsx, RecipeCard, RecipeModal) can treat the result of any
// function here exactly like a plain mealdb.js call — toPlanMeal and
// getIngredients from mealdb.js work unchanged on Spoonacular-sourced meals.
//
// Design choices:
// - Spoonacular calls are best-effort: if the API key isn't configured, the
//   free quota (50 points/day) is exhausted, or the request errors, we log
//   nothing user-facing and just fall back to MealDB-only results.
// - Results are deduped by lowercased title, MealDB-first, since the two
//   catalogs overlap heavily on common dishes.
// - listAreas() and PROTEIN_CATEGORIES stay MealDB-only for now — merging
//   two different cuisine/category taxonomies cleanly is more than this
//   needs; Spoonacular recipes still surface under filters whose plain-
//   English label happens to match (e.g. "Italian", "Chicken").

import * as mealdb from "./mealdb";
import * as spoonacular from "./spoonacular";

export { getIngredients, toPlanMeal, PROTEIN_CATEGORIES, listAreas } from "./mealdb";

function dedupe(meals) {
  const seen = new Set();
  const out = [];
  for (const m of meals) {
    const key = (m.strMeal || "").trim().toLowerCase();
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    out.push(m);
  }
  return out;
}

async function settle(promise) {
  try {
    return await promise;
  } catch {
    return [];
  }
}

async function combine(mealdbCall, spoonacularCall) {
  const [a, b] = await Promise.all([settle(mealdbCall), settle(spoonacularCall)]);
  return dedupe([...(a || []), ...(b || [])]);
}

export async function searchMeals(query) {
  return combine(mealdb.searchMeals(query), spoonacular.searchMeals(query));
}

export async function filterByCategory(category) {
  return combine(mealdb.filterByCategory(category), spoonacular.filterByType(category));
}

export async function filterByArea(area) {
  return combine(mealdb.filterByArea(area), spoonacular.filterByCuisine(area));
}

export async function filterByIngredient(ingredient) {
  return combine(mealdb.filterByIngredient(ingredient), spoonacular.filterByIngredient(ingredient));
}

export async function randomMeals(n) {
  // Weight toward MealDB (free, unlimited) and top up with a couple of
  // Spoonacular picks so the free tier's 50 pts/day stretches further.
  const spoonN = Math.min(2, n);
  const mealdbN = n - spoonN;
  const [a, b] = await Promise.all([
    settle(mealdb.randomMeals(mealdbN)),
    settle(spoonacular.randomMeals(spoonN)),
  ]);
  return dedupe([...(a || []), ...(b || [])]);
}

/** Dispatches to the right source based on id prefix ("sp-" = Spoonacular). */
export async function lookupMeal(id) {
  return spoonacular.isSpoonacularId(id) ? spoonacular.lookupMeal(id) : mealdb.lookupMeal(id);
}
