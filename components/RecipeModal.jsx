"use client";

import { useEffect, useState } from "react";
import { usePlan, PLAN_MAX } from "@/app/providers";
import { lookupMeal, getIngredients, toPlanMeal } from "@/lib/mealdb";

export default function RecipeModal({ mealId, onClose }) {
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState(false);
  const { addMeal, hasMeal, isFull, showToast } = usePlan();

  useEffect(() => {
    let live = true;
    setMeal(null);
    setError(false);
    lookupMeal(mealId)
      .then((m) => live && (m ? setMeal(m) : setError(true)))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [mealId]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const added = meal && hasMeal(meal.idMeal);

  function handleAdd() {
    if (!meal || added) return;
    if (isFull) {
      showToast(`Your week is full (${PLAN_MAX} dinners max) 🎉`);
      return;
    }
    addMeal(toPlanMeal(meal));
    showToast(`${meal.strMeal} added to your week! 🍽️`);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {!meal && !error && <div className="loader"><span /><span /><span /></div>}
        {error && (
          <div className="empty">
            <span className="empty-emoji">🫠</span>
            <h3>Couldn&apos;t load that recipe</h3>
            <button className="btn btn-sm" onClick={onClose}>Close</button>
          </div>
        )}
        {meal && (
          <>
            <div className="modal-hero">
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <button className="modal-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <h2>{meal.strMeal}</h2>
              <div className="tag-row">
                {meal.strCategory && <span className="tag tag-coral">{meal.strCategory}</span>}
                {meal.strArea && <span className="tag tag-mint">{meal.strArea}</span>}
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  className={`btn ${added ? "btn-mint" : "btn-coral"}`}
                  onClick={handleAdd}
                  disabled={added}
                >
                  {added ? "✓ In your week" : "+ Add to my week"}
                </button>
                {meal.strYoutube && (
                  <a
                    className="btn btn-ghost"
                    style={{ marginLeft: 10 }}
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ▶ Watch video
                  </a>
                )}
              </div>
              <div className="modal-cols">
                <div>
                  <div className="section-label">🧺 Ingredients</div>
                  <ul className="ing-list">
                    {getIngredients(meal).map((ing, i) => (
                      <li key={i}>
                        <b>{ing.measure}</b> {ing.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="section-label">👩‍🍳 Method</div>
                  <p className="instructions">{meal.strInstructions}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
