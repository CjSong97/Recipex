"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const PlanContext = createContext(null);

export const PLAN_MAX = 5;
const STORAGE_KEY = "recipex-plan-v1";

export default function Providers({ children }) {
  const [plan, setPlan] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Load once from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPlan(JSON.parse(raw));
    } catch (e) {
      // corrupted storage — start fresh
    }
    setLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      // storage full or unavailable — ignore
    }
  }, [plan, loaded]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const addMeal = useCallback(
    (meal) => {
      let added = false;
      setPlan((prev) => {
        if (prev.length >= PLAN_MAX) return prev;
        if (prev.some((m) => m.id === meal.id)) return prev;
        added = true;
        return [...prev, meal];
      });
      return added;
    },
    []
  );

  const removeMeal = useCallback((id) => {
    setPlan((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearPlan = useCallback(() => setPlan([]), []);

  const value = {
    plan,
    loaded,
    addMeal,
    removeMeal,
    clearPlan,
    showToast,
    hasMeal: (id) => plan.some((m) => m.id === id),
    isFull: plan.length >= PLAN_MAX,
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside Providers");
  return ctx;
}
