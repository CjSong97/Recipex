"""
Regenerate data/pairings.js from real ingredient-embedding data.

Two supported sources — pick whichever you have access to:

SOURCE 1: Epicure (recommended — same project the Flavor Lab is modeled on)
  Epicure (https://huggingface.co/datasets/Kaikaku/epicure-corpus-resources,
  paper: arXiv:2605.22391) publishes 300-dim ingredient embeddings trained on
  4M+ recipes across 11 corpora (RecipeNLG, XiaChuFang, Povarenok, etc.),
  released under CC BY 4.0. It's a direct, better-maintained analogue of
  FlavorGraph — cite the paper if you ship the regenerated pairings.

  1. Download epicure_cooc.csv from the "Files and versions" tab at
     https://huggingface.co/datasets/Kaikaku/epicure-corpus-resources
     (co-occurrence embedding — closest to "what pairs with what"; core/chem
     variants are also available if you want semantic or flavor-chemistry
     similarity instead). No login required, ~3-5 MB.
  2. pip install numpy pandas
  3. python scripts/build_flavorgraph.py \
       --epicure-csv epicure_cooc.csv \
       --out data/pairings.generated.js

SOURCE 2: FlavorGraph (original)
  FlavorGraph (https://github.com/lamypark/FlavorGraph) publishes node
  embeddings learned from 1M+ recipes plus chemical compound data.
  1. git clone https://github.com/lamypark/FlavorGraph
  2. Download their pretrained embedding pickle (see the repo README,
     "FlavorGraph Node Embedding") into FlavorGraph/output/
  3. pip install numpy pandas
  4. python scripts/build_flavorgraph.py \
       --nodes FlavorGraph/input/nodes_191120.csv \
       --embedding FlavorGraph/output/FlavorGraph_embedding.pickle \
       --out data/pairings.generated.js

Either way: review the output and swap it in for data/pairings.js (keep the
CATEGORY_STYLE export — the script only regenerates NODES and PAIRS).
"""

import argparse
import json
import pickle
import re

import numpy as np
import pandas as pd

# Everyday dinner ingredients to include, mapped to a display category.
# Node names use underscores, e.g. "olive_oil" — matches both FlavorGraph's
# and Epicure's canonical vocabulary conventions.
WHITELIST = {
    # protein
    "chicken": "protein", "beef": "protein", "pork": "protein",
    "lamb": "protein", "salmon": "protein", "shrimp": "protein",
    "cod": "protein", "tofu": "protein", "egg": "protein",
    "bacon": "protein", "chorizo": "protein", "duck": "protein",
    # vegetable
    "onion": "vegetable", "garlic": "vegetable", "tomato": "vegetable",
    "potato": "vegetable", "carrot": "vegetable", "celery": "vegetable",
    "bell_pepper": "vegetable", "mushroom": "vegetable",
    "spinach": "vegetable", "broccoli": "vegetable",
    "cauliflower": "vegetable", "zucchini": "vegetable",
    "eggplant": "vegetable", "cabbage": "vegetable", "kale": "vegetable",
    "pea": "vegetable", "green_bean": "vegetable", "corn": "vegetable",
    "pumpkin": "vegetable", "beet": "vegetable", "asparagus": "vegetable",
    "leek": "vegetable", "avocado": "vegetable", "cucumber": "vegetable",
    "sweet_potato": "vegetable", "olive": "vegetable",
    # herb
    "basil": "herb", "parsley": "herb", "cilantro": "herb", "thyme": "herb",
    "rosemary": "herb", "mint": "herb", "dill": "herb", "oregano": "herb",
    "sage": "herb", "chive": "herb", "lemongrass": "herb",
    # spice
    "cumin": "spice", "paprika": "spice", "chili": "spice",
    "black_pepper": "spice", "ginger": "spice", "turmeric": "spice",
    "cinnamon": "spice", "nutmeg": "spice", "curry_powder": "spice",
    "garam_masala": "spice",
    # fruit
    "lemon": "fruit", "lime": "fruit", "orange": "fruit", "apple": "fruit",
    "mango": "fruit", "pineapple": "fruit", "pomegranate": "fruit",
    # dairy
    "butter": "dairy", "cream": "dairy", "parmesan_cheese": "dairy",
    "feta_cheese": "dairy", "mozzarella_cheese": "dairy",
    "cheddar_cheese": "dairy", "yogurt": "dairy", "goat_cheese": "dairy",
    # pantry
    "olive_oil": "pantry", "soy_sauce": "pantry", "fish_sauce": "pantry",
    "miso": "pantry", "honey": "pantry", "mustard": "pantry",
    "vinegar": "pantry", "coconut_milk": "pantry", "rice": "pantry",
    "pasta": "pantry", "noodle": "pantry", "chickpea": "pantry",
    "lentil": "pantry", "red_wine": "pantry", "white_wine": "pantry",
    # nut
    "almond": "nut", "walnut": "nut", "peanut": "nut", "cashew": "nut",
    "pine_nut": "nut", "sesame": "nut",
}

TOP_K = 10


def pretty(name: str) -> str:
    """node name -> display name used in the app."""
    n = name.replace("_", " ")
    n = re.sub(r"\s+cheese$", "", n) if n != "goat cheese" else n
    return n


def write_pairings(names, sim, out_path):
    """Shared writer: names is the list of whitelisted node names (matched
    order to `sim`'s rows/cols), sim is a symmetric cosine-similarity matrix."""
    pairs = {}
    for i, name in enumerate(names):
        order = np.argsort(-sim[i])
        top = [
            [pretty(names[j]), round(float((sim[i, j] + 1) / 2), 2)]  # map [-1,1] -> [0,1]
            for j in order
            if j != i
        ][:TOP_K]
        pairs[pretty(name)] = top

    nodes_out = {pretty(k): v for k, v in WHITELIST.items() if k in names}

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/build_flavorgraph.py\n")
        f.write("// Paste CATEGORY_STYLE from data/pairings.js, or replace only\n")
        f.write("// NODES and PAIRS there with the objects below.\n\n")
        f.write("export const NODES = ")
        f.write(json.dumps(nodes_out, indent=2))
        f.write(";\n\nexport const PAIRS = ")
        f.write(json.dumps(pairs, indent=2))
        f.write(";\n")

    print(f"Wrote {out_path} with {len(names)} ingredients.")


def build_from_epicure(csv_path, out_path):
    df = pd.read_csv(csv_path)
    dim_cols = [c for c in df.columns if c.startswith("dim_")]
    if not dim_cols:
        raise SystemExit(f"No dim_* columns found in {csv_path} — is this the right file?")

    name_to_vec = {row["name"]: row[dim_cols].to_numpy(dtype=float) for _, row in df.iterrows()}

    names, vecs = [], []
    for raw_name in WHITELIST:
        if raw_name in name_to_vec:
            names.append(raw_name)
            vecs.append(name_to_vec[raw_name])
    if not names:
        raise SystemExit(
            "No whitelisted ingredients found in the Epicure vocabulary — "
            "check spelling against canonical_vocabulary.parquet's `name` column."
        )

    M = np.vstack(vecs)
    M = M / np.linalg.norm(M, axis=1, keepdims=True)
    sim = M @ M.T
    write_pairings(names, sim, out_path)


def build_from_flavorgraph(nodes_path, embedding_path, out_path):
    nodes = pd.read_csv(nodes_path)
    ing = nodes[nodes["node_type"] == "ingredient"]
    name_to_id = dict(zip(ing["name"], ing["node_id"].astype(str)))

    with open(embedding_path, "rb") as f:
        emb = pickle.load(f)  # dict: node_id (str) -> np.array

    names, vecs = [], []
    for raw_name in WHITELIST:
        node_id = name_to_id.get(raw_name)
        if node_id and node_id in emb:
            names.append(raw_name)
            vecs.append(np.asarray(emb[node_id], dtype=float))
    if not names:
        raise SystemExit("No whitelisted ingredients found — check node names against nodes CSV.")

    M = np.vstack(vecs)
    M = M / np.linalg.norm(M, axis=1, keepdims=True)
    sim = M @ M.T
    write_pairings(names, sim, out_path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--epicure-csv", help="epicure_cooc.csv (or core/chem) from the Epicure dataset")
    ap.add_argument("--nodes", help="nodes_191120.csv from FlavorGraph/input")
    ap.add_argument("--embedding", help="FlavorGraph pretrained embedding pickle")
    ap.add_argument("--out", default="data/pairings.generated.js")
    args = ap.parse_args()

    if args.epicure_csv:
        build_from_epicure(args.epicure_csv, args.out)
    elif args.nodes and args.embedding:
        build_from_flavorgraph(args.nodes, args.embedding, args.out)
    else:
        raise SystemExit(
            "Provide either --epicure-csv, or both --nodes and --embedding. See this "
            "script's module docstring for where to get each."
        )


if __name__ == "__main__":
    main()
