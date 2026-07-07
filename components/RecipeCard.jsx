"use client";

import { useState } from "react";
import { usePlan, PLAN_MAX } from "@/app/providers";
import { lookupMeal, toPlanMeal } from "@/lib/mealdb";

/**
 * meal may be a full meal object (from search/random) or a partial one
 * (from filter endpoints: idMeal, strMeal, strMealThumb only).
 */
export default function RecipeCard({ meal, index = 0, onOpen }) {
  const { addMeal, hasMeal, isFull, showToast } = usePlan();
  const [busy, setBusy] = useState(false);
  const added = hasMeal(meal.idMeal);

  async function handleAdd() {
    if (added || busy) return;
    if (isFull) {
      showToast(`Your week is full (${PLAN_MAX} dinners max) 🎉`);
      return;
    }
    setBusy(true);
    try {
      // Filter endpoints return partial meals — fetch full details so the
      // shopping list has ingredients.
      const full = meal.strInstructions ? meal : await lookupMeal(meal.idMeal);
      if (full) {
        addMeal(toPlanMeal(full));
        showToast(`${full.strMeal} added to your week! 🍽️`);
      }
    } catch (e) {
      showToast("Couldn't add that one — try again?");
    }
    setBusy(false);
  }

  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 12) * 55}ms` }}>
      <div className="card-img-wrap" onClick={() => onOpen(meal.idMeal)}>
        <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
      </div>
      <div className="card-body">
        <h3 className="card-title" onClick={() => onOpen(meal.idMeal)}>
          {meal.strMeal}
        </h3>
        {(meal.strCategory || meal.strArea) && (
          <div className="tag-row">
            {meal.strCategory && <span className="tag tag-coral">{meal.strCategory}</span>}
            {meal.strArea && <span className="tag tag-mint">{meal.strArea}</span>}
          </div>
        )}
        <div className="card-actions">
          <button
            className={`add-btn${added ? " added" : ""}${isFull && !added ? " full" : ""}`}
            onClick={handleAdd}
            disabled={added || busy}
          >
            {added ? "✓ In your week" : busy ? "Adding…" : "+ Add to week"}
          </button>
        </div>
      </div>
    </article>
  );
}
