"use client";

import { useState } from "react";

const PAGE_SIZE = 8;

function FilterPanel({ options, value, onChange, accent }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(options.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const visible = options.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="filter-panel">
      <div className="chip-row" style={{ margin: 0 }}>
        {value && (
          <button className="chip on" onClick={() => onChange("")}>
            ✕ Clear
          </button>
        )}
        {visible.map((opt) => (
          <button
            key={opt}
            className={`chip${value === opt ? ` on on-${accent}` : ""}`}
            onClick={() => onChange(value === opt ? "" : opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {pages > 1 && (
        <div className="pager">
          <button
            className="pager-btn"
            aria-label="Previous options"
            onClick={() => setPage((p) => (p - 1 + pages) % pages)}
          >
            ‹
          </button>
          <div className="pager-dots">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                className={`pager-dot${i === safePage ? " on" : ""}`}
                aria-label={`Page ${i + 1} of ${pages}`}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
          <button
            className="pager-btn"
            aria-label="Next options"
            onClick={() => setPage((p) => (p + 1) % pages)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default function FilterControls({
  categories,
  areas,
  category,
  area,
  onCategory,
  onArea,
}) {
  const [open, setOpen] = useState(null); // "protein" | "cuisine" | null

  function toggle(which) {
    setOpen((o) => (o === which ? null : which));
  }

  return (
    <div className="filters">
      <div className="filter-bar">
        <button
          className={`filter-trigger${category ? " has-value" : ""}${open === "protein" ? " open" : ""}`}
          onClick={() => toggle("protein")}
          aria-expanded={open === "protein"}
        >
          🍗 {category ? category : "Protein"}
          <span className={`caret${open === "protein" ? " up" : ""}`}>▾</span>
        </button>
        <button
          className={`filter-trigger${area ? " has-value" : ""}${open === "cuisine" ? " open" : ""}`}
          onClick={() => toggle("cuisine")}
          aria-expanded={open === "cuisine"}
          disabled={areas.length === 0}
        >
          🌍 {area ? area : "Cuisine"}
          <span className={`caret${open === "cuisine" ? " up" : ""}`}>▾</span>
        </button>
        {(category || area) && (
          <button
            className="filter-reset"
            onClick={() => {
              onCategory("");
              onArea("");
            }}
          >
            Reset ✕
          </button>
        )}
      </div>

      {open === "protein" && (
        <FilterPanel
          key="protein"
          options={categories}
          value={category}
          onChange={onCategory}
          accent="coral"
        />
      )}
      {open === "cuisine" && (
        <FilterPanel
          key="cuisine"
          options={areas}
          value={area}
          onChange={onArea}
          accent="grape"
        />
      )}
    </div>
  );
}
