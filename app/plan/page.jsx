"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlan, PLAN_MAX } from "@/app/providers";
import RecipeModal from "@/components/RecipeModal";

const CATEGORY_EMOJI = {
  Chicken: "🐔",
  Beef: "🥩",
  Pork: "🥓",
  Lamb: "🐑",
  Seafood: "🐟",
  Pasta: "🍝",
  Vegetarian: "🥦",
  Vegan: "🌱",
  Dessert: "🍰",
  Breakfast: "🍳",
  Side: "🥗",
  Starter: "🥣",
  Goat: "🐐",
  Miscellaneous: "🍲",
};

export default function PlanPage() {
  const { plan, loaded, removeMeal, clearPlan, showToast } = usePlan();
  const [modalId, setModalId] = useState(null);

  const proteins = [...new Set(plan.map((m) => m.category).filter(Boolean))];
  const cuisines = [...new Set(plan.map((m) => m.area).filter(Boolean))];

  return (
    <>
      <header className="page-head">
        <h1>
          My <span className="accent">week</span>
        </h1>
        <p>Pick 3–5 dinners. Keep an eye on variety, then grab your shopping list.</p>
      </header>

      <div className="plan-meter">
        <div className="plan-dots">
          {Array.from({ length: PLAN_MAX }, (_, i) => (
            <span key={i} className={`plan-dot${i < plan.length ? " filled" : ""}`} />
          ))}
        </div>
        <span className="muted" style={{ fontWeight: 700 }}>
          {plan.length}/{PLAN_MAX} dinners
          {plan.length >= 3 && plan.length <= 5 ? " — nice week! ✨" : ""}
        </span>
      </div>

      {plan.length > 0 && (
        <div className="variety-strip">
          {proteins.map((p, i) => (
            <span key={p} className="variety-pill" style={{ animationDelay: `${i * 60}ms` }}>
              {CATEGORY_EMOJI[p] || "🍲"} {p}
            </span>
          ))}
          {cuisines.map((c, i) => (
            <span
              key={c}
              className="variety-pill"
              style={{ animationDelay: `${(proteins.length + i) * 60}ms`, background: "var(--grape-soft)" }}
            >
              🌍 {c}
            </span>
          ))}
        </div>
      )}

      {loaded && plan.length === 0 && (
        <div className="empty">
          <span className="empty-emoji">🧑‍🍳</span>
          <h3>Nothing planned yet</h3>
          <p>Head to Discover and add 3–5 dinners you&apos;re excited about.</p>
          <Link href="/" className="btn btn-coral">
            Find dinners →
          </Link>
        </div>
      )}

      {plan.map((meal, i) => (
        <div key={meal.id} className="plan-row" style={{ animationDelay: `${i * 70}ms` }}>
          <img src={meal.thumb} alt={meal.name} />
          <div className="plan-info">
            <h3>{meal.name}</h3>
            <div className="tag-row">
              {meal.category && <span className="tag tag-coral">{meal.category}</span>}
              {meal.area && <span className="tag tag-mint">{meal.area}</span>}
              <span className="tag tag-grape">{meal.ingredients.length} ingredients</span>
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => setModalId(meal.id)}>
            View
          </button>
          <button
            className="remove-btn"
            aria-label={`Remove ${meal.name}`}
            onClick={() => {
              removeMeal(meal.id);
              showToast(`${meal.name} removed`);
            }}
          >
            ✕
          </button>
        </div>
      ))}

      {plan.length > 0 && (
        <div className="row-between" style={{ padding: "10px 0 60px" }}>
          <Link href="/list" className="btn btn-mint">
            🛒 Get shopping list
          </Link>
          <button
            className="btn btn-ghost"
            onClick={() => {
              clearPlan();
              showToast("Week cleared — fresh start!");
            }}
          >
            Clear week
          </button>
        </div>
      )}

      {modalId && <RecipeModal mealId={modalId} onClose={() => setModalId(null)} />}
    </>
  );
}
