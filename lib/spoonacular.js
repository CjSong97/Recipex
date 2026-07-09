// Second recipe source, layered on top of TheMealDB for more variety.
// Docs: https://spoonacular.com/food-api/docs
//
// Every function here normalizes Spoonacular's response shape into the
// exact shape TheMealDB returns (idMeal, strMeal, strMealThumb, strCategory,
// strArea, strInstructions, strIngredient1..20/strMeasure1..20, ...) so the
// rest of the app — toPlanMeal, getIngredients, RecipeCard, RecipeModal —
// doesn't need to know which API a recipe came from. See lib/recipeSources.js
// for the merge layer that combines both.
//
// Spoonacular ids are prefixed "sp-" so they never collide with MealDB's
// numeric ids and so lib/recipeSources.js can route lookupMeal() correctly.

const ID_PREFIX = "sp-";

async function get(path, params = {}) {
  const qs = new URLSearchParams({ path, ...params });
  const res = await fetch(`/api/spoonacular?${qs.toString()}`);
  if (!res.ok) throw new Error(`Spoonacular request failed: ${res.status}`);
  return res.json();
}

function stripHtml(s) {
  return (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Spoonacular's `cuisines` is an array; MealDB's strArea is one string. */
function firstCuisine(cuisines) {
  return (cuisines && cuisines[0]) || "";
}

function firstDishType(dishTypes) {
  const t = (dishTypes && dishTypes[0]) || "";
  return t ? t.replace(/\b\w/g, (c) => c.toUpperCase()) : "";
}

/** Normalize a lightweight complexSearch result (no ingredients/instructions). */
function normalizePartial(r) {
  return {
    idMeal: `${ID_PREFIX}${r.id}`,
    strMeal: r.title,
    strMealThumb: r.image || "",
    strCategory: firstDishType(r.dishTypes),
    strArea: firstCuisine(r.cuisines),
  };
}

/** Normalize a full /recipes/{id}/information response into MealDB shape. */
function normalizeFull(r) {
  const out = {
    idMeal: `${ID_PREFIX}${r.id}`,
    strMeal: r.title,
    strMealThumb: r.image || "",
    strCategory: firstDishType(r.dishTypes),
    strArea: firstCuisine(r.cuisines),
    strYoutube: "",
    strSource: r.sourceUrl || r.spoonacularSourceUrl || "",
  };

  let instructions = stripHtml(r.instructions);
  if (!instructions && Array.isArray(r.analyzedInstructions) && r.analyzedInstructions.length) {
    instructions = r.analyzedInstructions
      .flatMap((block) => (block.steps || []).map((s) => s.step))
      .join(" ");
  }
  out.strInstructions = instructions;

  const ingredients = r.extendedIngredients || [];
  ingredients.slice(0, 20).forEach((ing, i) => {
    const n = i + 1;
    out[`strIngredient${n}`] = ing.name || ing.originalName || "";
    const amount = ing.amount ? Number(ing.amount).toString() : "";
    out[`strMeasure${n}`] = [amount, ing.unit].filter(Boolean).join(" ");
  });

  return out;
}

export function isSpoonacularId(id) {
  return typeof id === "string" && id.startsWith(ID_PREFIX);
}

function rawId(id) {
  return id.slice(ID_PREFIX.length);
}

/** Full-text search — matches mealdb.searchMeals's contract (partial meals). */
export async function searchMeals(query) {
  const data = await get("recipes/complexSearch", { query, number: "12" });
  return (data.results || []).map(normalizePartial);
}

export async function filterByCuisine(area) {
  const data = await get("recipes/complexSearch", { cuisine: area, number: "12" });
  return (data.results || []).map(normalizePartial);
}

export async function filterByType(category) {
  const data = await get("recipes/complexSearch", { type: category, number: "12" });
  return (data.results || []).map(normalizePartial);
}

export async function filterByIngredient(ingredient) {
  const data = await get("recipes/findByIngredients", { ingredients: ingredient, number: "12" });
  return (Array.isArray(data) ? data : []).map((r) =>
    normalizePartial({ id: r.id, title: r.title, image: r.image })
  );
}

export async function randomMeals(n) {
  const data = await get("recipes/random", { number: String(n) });
  return (data.recipes || []).map(normalizeFull);
}

/** Full recipe by id — id should already be "sp-<n>" as returned above. */
export async function lookupMeal(id) {
  const data = await get(`recipes/${rawId(id)}/information`, {});
  if (data.error || !data.id) return null;
  return normalizeFull(data);
}
