"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePlan } from "@/app/providers";
import { buildShoppingList } from "@/lib/shopping";

export default function ShoppingListPage() {
  const { plan, loaded } = usePlan();
  const aisles = useMemo(() => buildShoppingList(plan), [plan]);
  const totalItems = aisles.reduce((n, a) => n + a.items.length, 0);

  return (
    <>
      <header className="page-head">
        <h1>
          Shopping <span className="accent">list</span>
        </h1>
        <p>
          Every ingredient from your week, merged across recipes and grouped by
          aisle.
        </p>
      </header>

      {loaded && plan.length === 0 && (
        <div className="empty">
          <span className="empty-emoji">🛒</span>
          <h3>Your list is empty</h3>
          <p>Add some dinners to your week first — the list builds itself.</p>
          <Link href="/" className="btn btn-coral">
            Find dinners →
          </Link>
        </div>
      )}

      {plan.length > 0 && (
        <>
          <div className="row-between" style={{ marginBottom: 24 }}>
            <span className="muted" style={{ fontWeight: 700 }}>
              {totalItems} items · {plan.length} recipes
            </span>
            <Link href="/plan" className="btn btn-sm btn-ghost">
              ← Back to my week
            </Link>
          </div>

          {aisles.map((aisle, ai) => (
            <section
              key={aisle.id}
              className="aisle"
              style={{ animationDelay: `${ai * 80}ms` }}
            >
              <div className="aisle-head">
                <span className="aisle-emoji" style={{ background: aisle.bg }}>
                  {aisle.emoji}
                </span>
                <h3>{aisle.label}</h3>
                <span className="aisle-count">{aisle.items.length}</span>
              </div>
              <div className="shop-items">
                {aisle.items.map((item) => (
                  <div key={item.name} className="shop-item">
                    <div>
                      <span className="shop-name">{item.name}</span>
                      <span className="shop-recipes">
                        {item.recipes.join(" · ")}
                      </span>
                    </div>
                    {item.display && (
                      <span className="shop-qty">{item.display}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
          <div style={{ height: 40 }} />
        </>
      )}
    </>
  );
}
