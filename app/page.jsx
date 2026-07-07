"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import FilterControls from "@/components/FilterControls";
import {
  searchMeals,
  filterByCategory,
  filterByArea,
  filterByIngredient,
  randomMeals,
  listAreas,
  PROTEIN_CATEGORIES,
} from "@/lib/mealdb";

function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ingredient = searchParams.get("ingredient") || "";

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const reqId = useRef(0);

  // Cuisine chips
  useEffect(() => {
    listAreas().then(setAreas).catch(() => setAreas([]));
  }, []);

  // Debounce search text
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  // Main fetch
  useEffect(() => {
    const id = ++reqId.current;
    setLoading(true);
    setError(false);

    async function run() {
      if (debouncedQ) {
        let results = await searchMeals(debouncedQ);
        if (category) results = results.filter((m) => m.strCategory === category);
        if (area) results = results.filter((m) => m.strArea === area);
        return results;
      }
      if (category && area) {
        const [byCat, byArea] = await Promise.all([
          filterByCategory(category),
          filterByArea(area),
        ]);
        const areaIds = new Set(byArea.map((m) => m.idMeal));
        return byCat.filter((m) => areaIds.has(m.idMeal));
      }
      if (category) return filterByCategory(category);
      if (area) return filterByArea(area);
      if (ingredient) return filterByIngredient(ingredient);
      return randomMeals(8);
    }

    run()
      .then((results) => {
        if (reqId.current !== id) return;
        setMeals(results);
        setLoading(false);
      })
      .catch(() => {
        if (reqId.current !== id) return;
        setError(true);
        setLoading(false);
      });
  }, [debouncedQ, category, area, ingredient, shuffleKey]);

  const noFilters = !debouncedQ && !category && !area && !ingredient;

  const headline = useMemo(() => {
    if (ingredient) return <>Recipes with <span className="accent">{ingredient}</span></>;
    if (noFilters) return <>What&apos;s for dinner <span className="accent">this week?</span></>;
    return <>Your <span className="accent">picks</span></>;
  }, [ingredient, noFilters]);

  return (
    <>
      <header className="page-head">
        <h1>{headline}</h1>
        <p>
          Search the open recipe library, filter by protein or cuisine, and build
          your week of dinners.
        </p>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder="Search recipes… (try “curry” or “tacos”)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {noFilters && (
          <button
            className="btn btn-sunny"
            onClick={() => setShuffleKey((k) => k + 1)}
            title="Shuffle suggestions"
          >
            🎲 Shuffle
          </button>
        )}
      </div>

      {ingredient && (
        <div className="chip-row">
          <button className="chip on-coral on" onClick={() => router.push("/")}>
            🧅 {ingredient} ✕
          </button>
          <span className="muted" style={{ alignSelf: "center", fontSize: "0.85rem" }}>
            from the Flavor Lab — clear to browse everything
          </span>
        </div>
      )}

      <FilterControls
        categories={PROTEIN_CATEGORIES}
        areas={areas}
        category={category}
        area={area}
        onCategory={setCategory}
        onArea={setArea}
      />

      {loading && (
        <div className="loader">
          <span />
          <span />
          <span />
        </div>
      )}

      {!loading && error && (
        <div className="empty">
          <span className="empty-emoji">📡</span>
          <h3>Couldn&apos;t reach the recipe library</h3>
          <p>Check your connection and try again.</p>
          <button className="btn btn-coral" onClick={() => setShuffleKey((k) => k + 1)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && meals.length === 0 && (
        <div className="empty">
          <span className="empty-emoji">🍽️</span>
          <h3>No recipes match</h3>
          <p>Try loosening a filter — some cuisine + protein combos are rare.</p>
        </div>
      )}

      {!loading && !error && meals.length > 0 && (
        <section className="grid">
          {meals.map((m, i) => (
            <RecipeCard key={m.idMeal} meal={m} index={i} onOpen={setModalId} />
          ))}
        </section>
      )}

      {modalId && <RecipeModal mealId={modalId} onClose={() => setModalId(null)} />}
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="loader">
          <span />
          <span />
          <span />
        </div>
      }
    >
      <DiscoverPage />
    </Suspense>
  );
}
