"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
  forceY,
} from "d3-force";
import { NODES, CATEGORY_STYLE, getPairs, PAIRS } from "@/data/pairings";

const W = 720;
const H = 540;

/** Ego graph: the selected ingredient at the center, its pairings around it,
 *  plus links between neighbors that also pair with each other. */
export default function FlavorGraph({ center, onSelect }) {
  const [positions, setPositions] = useState([]);
  const simRef = useRef(null);

  const { nodes, links } = useMemo(() => {
    const pairs = getPairs(center, 10);
    const nodes = [
      { id: center, strength: 1, isCenter: true, fx: W / 2, fy: H / 2 },
      ...pairs.map(([name, strength]) => ({ id: name, strength, isCenter: false })),
    ];
    const links = pairs.map(([name, strength]) => ({
      source: center,
      target: name,
      strength,
    }));
    // Cross-links between neighbors that pair with each other
    const neighborSet = new Set(pairs.map(([n]) => n));
    for (const [a] of pairs) {
      for (const [b, s] of PAIRS[a] || []) {
        if (neighborSet.has(b) && a < b) {
          links.push({ source: a, target: b, strength: s, cross: true });
        }
      }
    }
    return { nodes, links };
  }, [center]);

  useEffect(() => {
    // d3 mutates node objects — give it copies.
    const simNodes = nodes.map((n) => ({ ...n, x: W / 2 + (Math.random() - 0.5) * 200, y: H / 2 + (Math.random() - 0.5) * 200 }));
    const simLinks = links.map((l) => ({ ...l }));

    const sim = forceSimulation(simNodes)
      .force(
        "link",
        forceLink(simLinks)
          .id((d) => d.id)
          .distance((l) => (l.cross ? 150 : 110 + (1 - l.strength) * 130))
          .strength((l) => (l.cross ? 0.15 : 0.7))
      )
      .force("charge", forceManyBody().strength(-420))
      .force("collide", forceCollide().radius((d) => nodeRadius(d) + 26))
      .force("x", forceX(W / 2).strength(0.06))
      .force("y", forceY(H / 2).strength(0.08));

    sim.on("tick", () => {
      setPositions(
        simNodes.map((n) => ({
          id: n.id,
          x: Math.max(50, Math.min(W - 50, n.x)),
          y: Math.max(44, Math.min(H - 44, n.y)),
          strength: n.strength,
          isCenter: n.isCenter,
        }))
      );
    });

    simRef.current = sim;
    return () => sim.stop();
  }, [nodes, links]);

  const posMap = new Map(positions.map((p) => [p.id, p]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Flavor pairings for ${center}`}>
      {links.map((l, i) => {
        const s = posMap.get(typeof l.source === "object" ? l.source.id : l.source);
        const t = posMap.get(typeof l.target === "object" ? l.target.id : l.target);
        if (!s || !t) return null;
        return (
          <line
            key={i}
            className="graph-link"
            x1={s.x}
            y1={s.y}
            x2={t.x}
            y2={t.y}
            strokeWidth={l.cross ? 1.2 : 1.5 + l.strength * 3.5}
            strokeDasharray={l.cross ? "4 5" : "none"}
            opacity={l.cross ? 0.5 : 0.9}
          />
        );
      })}
      {positions.map((p) => {
        const cat = NODES[p.id];
        const style = CATEGORY_STYLE[cat] || { color: "#ccc" };
        const r = nodeRadius(p);
        return (
          <g
            key={p.id}
            className="graph-node"
            transform={`translate(${p.x},${p.y})`}
            onClick={() => !p.isCenter && onSelect(p.id)}
          >
            <circle r={r} fill={style.color} />
            <text
              textAnchor="middle"
              y={r + 16}
              fontSize={p.isCenter ? 15 : 12.5}
            >
              {p.id}
            </text>
            {p.isCenter && (
              <text textAnchor="middle" y={5} fontSize="16">
                ⭐
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function nodeRadius(n) {
  return n.isCenter ? 34 : 13 + n.strength * 14;
}
