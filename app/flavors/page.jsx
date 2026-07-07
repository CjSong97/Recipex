"use client";

import { useState } from "react";
import Link from "next/link";
import FlavorGraph from "@/components/FlavorGraph";
import { NODES, CATEGORY_STYLE, getPairs, ALL_INGREDIENTS } from "@/data/pairings";

export default function FlavorsPage() {
  const [selected, setSelected] = useState("chicken");
  const [pickerOpen, setPickerOpen] = useState(false);
  const pairs = getPairs(selected, 10);
  const cat = NODES[selected];
  const style = CATEGORY_STYLE[cat] || {};

  return (
    <>
      <header className="page-head">
        <h1>
          Flavor <span className="accent">Lab</span>
        </h1>
        <p>
          Click around the pairing graph to find ingredients that love each
          other — then jump straight to recipes.
        </p>
      </header>

      <div className="flavor-layout">
        <div className="graph-panel">
          <FlavorGraph center={selected} onSelect={setSelected} />
        </div>

        <aside className="side-panel">
          <div className="side-card" key={selected}>
            <div className="row-between">
              <h3>{selected}</h3>
              <span
                className="tag"
                style={{ background: style.color || "#eee" }}
              >
                {style.label || "Ingredient"}
              </span>
            </div>
            <p className="muted" style={{ fontSize: "0.85rem", margin: "6px 0 4px" }}>
              Strongest pairings:
            </p>
            {pairs.slice(0, 7).map(([name, strength]) => (
              <div
                key={name}
                className="pair-bar-row"
                onClick={() => setSelected(name)}
                title={`Explore ${name}`}
              >
                <span className="pair-name">{name}</span>
                <div className="pair-bar-track">
                  <div
                    className="pair-bar-fill"
                    style={{ width: `${Math.round(strength * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <Link
                href={`/?ingredient=${encodeURIComponent(selected)}`}
                className="btn btn-coral btn-sm"
              >
                🍽️ Find recipes with {selected}
              </Link>
            </div>
          </div>

          <div className="side-card">
            <div className="row-between">
              <div className="section-label" style={{ marginBottom: 0 }}>
                🧅 Pick an ingredient
              </div>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setPickerOpen((o) => !o)}
              >
                {pickerOpen ? "Hide" : "Show all"}
              </button>
            </div>
            {pickerOpen && (
              <div className="ingredient-picker" style={{ marginTop: 12 }}>
                {ALL_INGREDIENTS.map((name) => (
                  <button
                    key={name}
                    className={`chip${name === selected ? " on" : ""}`}
                    style={{ fontSize: "0.78rem", padding: "5px 11px" }}
                    onClick={() => setSelected(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="side-card">
            <div className="section-label">🔬 About this graph</div>
            <p className="muted" style={{ fontSize: "0.83rem" }}>
              Pairing strengths are a curated dataset inspired by{" "}
              <a
                href="https://github.com/lamypark/FlavorGraph"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "underline" }}
              >
                FlavorGraph
              </a>
              , a deep-learning model of 1M+ recipes and chemical compound
              data. Solid lines connect to the centre ingredient; dashed lines
              show neighbours that also pair with each other. Run{" "}
              <code>scripts/build_flavorgraph.py</code> to regenerate from the
              real embeddings.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
