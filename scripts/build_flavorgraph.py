"""
Regenerate data/pairings.js from the real FlavorGraph embeddings.

FlavorGraph (https://github.com/lamypark/FlavorGraph) publishes node
embeddings learned from 1M+ recipes plus chemical compound data. This script
computes cosine similarity between ingredient vectors and writes the top-K
pairings for a whitelist of everyday dinner ingredients.

Usage:
  1. git clone https://github.com/lamypark/FlavorGraph
  2. Download their pretrained embedding pickle (see the repo README,
     "FlavorGraph Node Embedding") into FlavorGraph/output/
  3. pip install numpy pandas
  4. python scripts/build_flavorgraph.py \
       --nodes FlavorGraph/input/nodes_191120.csv \
       --embedding FlavorGraph/output/FlavorGraph_embedding.pickle \
       --out data/pairings.generated.js

Then review the output and swap it in for data/pairings.js (keep the
CATEGORY_STYLE / NODES structure — the script writes matching exports).
"""

import argparse
import json
import pickle
import re

import numpy as np
import pandas as pd

# Everyday dinner ingredients to include, mapped to a display category.
# FlavorGraph node names use underscores, e.g. "olive_oil".
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
    """FlavorGraph node name -> display name used in the app."""
    n = name.replace("_", " ")
    n = re.sub(r"\s+cheese$", "", n) if n != "goat cheese" else n
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--nodes", required=True, help="nodes_191120.csv from FlavorGraph/input")
    ap.add_argument("--embedding", required=True, help="pretrained embedding pickle")
    ap.add_argument("--out", default="data/pairings.generated.js")
    args = ap.parse_args()

    nodes = pd.read_csv(args.nodes)
    # ingredient nodes only
    ing = nodes[nodes["node_type"] == "ingredient"]
    name_to_id = dict(zip(ing["name"], ing["node_id"].astype(str)))

    with open(args.embedding, "rb") as f:
        emb = pickle.load(f)  # dict: node_id (str) -> np.array

    # Collect vectors for whitelisted ingredients present in the graph
    vecs, names = [], []
    for raw_name in WHITELIST:
        node_id = name_to_id.get(raw_name)
        if node_id and node_id in emb:
            names.append(raw_name)
            vecs.append(np.asarray(emb[node_id], dtype=float))
    if not names:
        raise SystemExit("No whitelisted ingredients found — check node names against nodes CSV.")

    M = np.vstack(vecs)
    M = M / np.linalg.norm(M, axis=1, keepdims=True)
    sim = M @ M.T  # cosine similarity

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

    with open(args.out, "w", encoding="utf-8") as f:
        f.write("// Generated from FlavorGraph embeddings by scripts/build_flavorgraph.py\n")
        f.write("// Paste CATEGORY_STYLE + helper exports from data/pairings.js, or replace\n")
        f.write("// only NODES and PAIRS there with the objects below.\n\n")
        f.write("export const NODES = ")
        f.write(json.dumps(nodes_out, indent=2))
        f.write(";\n\nexport const PAIRS = ")
        f.write(json.dumps(pairs, indent=2))
        f.write(";\n")

    print(f"Wrote {args.out} with {len(names)} ingredients.")


if __name__ == "__main__":
    main()
