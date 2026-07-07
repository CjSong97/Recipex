// Thin client for TheMealDB — a free & open recipe API.
// Docs: https://www.themealdb.com/api.php  (key "1" is the free tier)
const BASE = "https://www.themealdb.com/api/json/v1/1";

async function get(path) {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`MealDB request failed: ${res.status}`);
  return res.json();
}

/** Full-text search — returns full meal objects. */
export async function searchMeals(query) {
  const data = await get(`search.php?s=${encodeURIComponent(query)}`);
  return data.meals || [];
}

/** Filter by category (protein-ish), area (cuisine) or main ingredient.
 *  Returns partial meals: { idMeal, strMeal, strMealThumb }. */
export async function filterByCategory(category) {
  const data = await get(`filter.php?c=${encodeURIComponent(category)}`);
  return data.meals || [];
}

export async function filterByArea(area) {
  const data = await get(`filter.php?a=${encodeURIComponent(area)}`);
  return data.meals || [];
}

export async function filterByIngredient(ingredient) {
  // TheMealDB uses underscores for multi-word ingredients
  const slug = ingredient.trim().replace(/\s+/g, "_");
  const data = await get(`filter.php?i=${encodeURIComponent(slug)}`);
  return data.meals || [];
}

/** Full meal details by id. */
export async function lookupMeal(id) {
  const data = await get(`lookup.php?i=${encodeURIComponent(id)}`);
  return data.meals ? data.meals[0] : null;
}

/** One random meal. */
export async function randomMeal() {
  const data = await get("random.php");
  return data.meals ? data.meals[0] : null;
}

/** N unique random meals (the API only returns one at a time). */
export async function randomMeals(n) {
  const results = await Promise.all(
    Array.from({ length: n + 3 }, () => randomMeal().catch(() => null))
  );
  const seen = new Set();
  const meals = [];
  for (const m of results) {
    if (m && !seen.has(m.idMeal)) {
      seen.add(m.idMeal);
      meals.push(m);
    }
    if (meals.length >= n) break;
  }
  return meals;
}

/** All cuisine areas, e.g. ["American", "Italian", ...] */
export async function listAreas() {
  const data = await get("list.php?a=list");
  return (data.meals || []).map((m) => m.strArea).filter((a) => a && a !== "Unknown");
}

/** Extract [{ name, measure }] from a full meal object's 20 numbered fields. */
export function getIngredients(meal) {
  const out = [];
  for (let i = 1; i <= 20; i++) {
    const name = (meal[`strIngredient${i}`] || "").trim();
    const measure = (meal[`strMeasure${i}`] || "").trim();
    if (name) out.push({ name, measure });
  }
  return out;
}

/** Trim a full meal object down to what we persist in the weekly plan. */
export function toPlanMeal(meal) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumb: meal.strMealThumb,
    category: meal.strCategory || "",
    area: meal.strArea || "",
    ingredients: getIngredients(meal),
  };
}

/** Protein / dish-type filter chips (TheMealDB categories worth surfacing). */
export const PROTEIN_CATEGORIES = [
  "Chicken",
  "Beef",
  "Pork",
  "Lamb",
  "Seafood",
  "Pasta",
  "Vegetarian",
  "Vegan",
];
