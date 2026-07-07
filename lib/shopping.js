// Unified shopping list: parse measures, merge duplicate ingredients across
// recipes (summing quantities when units match), and group by store aisle.

const UNIT_ALIASES = {
  tsp: "tsp", tsps: "tsp", teaspoon: "tsp", teaspoons: "tsp",
  tbsp: "tbsp", tbsps: "tbsp", tbs: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
  g: "g", gr: "g", gram: "g", grams: "g",
  kg: "kg", kilogram: "kg", kilograms: "kg",
  ml: "ml", milliliter: "ml", millilitres: "ml", milliliters: "ml",
  l: "l", liter: "l", litre: "l", liters: "l", litres: "l",
  cup: "cup", cups: "cup",
  oz: "oz", ounce: "oz", ounces: "oz",
  lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
  clove: "clove", cloves: "clove",
  can: "can", cans: "can", tin: "can", tins: "can",
  slice: "slice", slices: "slice",
  pinch: "pinch", pinches: "pinch",
  dash: "dash", dashes: "dash",
  sprig: "sprig", sprigs: "sprig",
  bunch: "bunch", bunches: "bunch",
  piece: "piece", pieces: "piece",
  handful: "handful", handfuls: "handful",
  stick: "stick", sticks: "stick",
};

function parseQty(str) {
  const mixed = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = str.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const n = Number(str);
  return Number.isFinite(n) ? n : null;
}

/** "1 1/2 tbsp olive oil" → { qty: 1.5, unit: "tbsp", note: "olive oil" } */
export function parseMeasure(raw) {
  const s = (raw || "").trim().toLowerCase();
  if (!s) return { qty: null, unit: null, note: "" };
  const qm = s.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+)\s*/);
  let qty = null;
  let rest = s;
  if (qm) {
    qty = parseQty(qm[1].replace(/\s+/g, " ").trim());
    rest = s.slice(qm[0].length);
  }
  let unit = null;
  const um = rest.match(/^([a-z]+)\.?\s*/);
  if (um && UNIT_ALIASES[um[1]]) {
    unit = UNIT_ALIASES[um[1]];
    rest = rest.slice(um[0].length);
  }
  return { qty, unit, note: rest.trim() };
}

function formatNumber(n) {
  const rounded = Math.round(n * 100) / 100;
  return String(rounded);
}

/** Merge a list of parsed entries into a compact display string. */
function formatEntries(entries) {
  const sums = new Map(); // unitKey -> total qty
  const texts = new Set(); // unparseable measures kept verbatim
  for (const e of entries) {
    if (e.qty != null) {
      const key = e.unit || "";
      sums.set(key, (sums.get(key) || 0) + e.qty);
    } else if (e.raw && e.raw.trim()) {
      texts.add(e.raw.trim());
    }
  }
  const parts = [];
  for (const [unit, total] of sums) {
    parts.push(unit ? `${formatNumber(total)} ${unit}` : `${formatNumber(total)}`);
  }
  for (const t of texts) parts.push(t);
  return parts.join(" + ");
}

export const AISLES = [
  { id: "produce", label: "Produce", emoji: "🥬", bg: "#e2f6d9" },
  { id: "meat", label: "Meat & Fish", emoji: "🥩", bg: "#ffe3e0" },
  { id: "dairy", label: "Dairy & Eggs", emoji: "🥛", bg: "#fff3cd" },
  { id: "bakery", label: "Bakery", emoji: "🥖", bg: "#f6e7d8" },
  { id: "pantry", label: "Pantry", emoji: "🥫", bg: "#ece4f7" },
  { id: "spices", label: "Spices & Seasoning", emoji: "🧂", bg: "#d8f5ee" },
  { id: "other", label: "Everything Else", emoji: "🛒", bg: "#e8f4fb" },
];

// Ordered rules: first match wins. Multi-word / specific terms live in
// earlier rules so "black pepper" hits spices before "pepper" hits produce.
const RULES = [
  {
    id: "spices",
    terms: [
      "black pepper", "white pepper", "peppercorn", "cayenne", "chilli powder",
      "chili powder", "paprika", "cumin", "turmeric", "coriander seed",
      "ground coriander", "ground ginger", "cinnamon", "nutmeg", "clove",
      "allspice", "garam masala", "curry powder", "five spice", "star anise",
      "cardamom", "fennel seed", "mustard seed", "dried oregano", "oregano",
      "dried thyme", "dried basil", "bay leaf", "bay leaves", "salt",
      "chilli flakes", "chili flakes", "red pepper flakes", "saffron", "sumac",
      "za'atar", "italian seasoning", "mixed spice", "stock cube", "bouillon",
      "vanilla", "baking powder", "bicarbonate", "baking soda", "yeast",
    ],
  },
  {
    id: "meat",
    terms: [
      "chicken", "beef", "pork", "lamb", "bacon", "sausage", "mince", "steak",
      "turkey", "duck", "ham", "chorizo", "pancetta", "prosciutto", "salmon",
      "cod", "haddock", "tuna", "prawn", "shrimp", "fish", "anchov", "mackerel",
      "crab", "lobster", "mussel", "clam", "squid", "scallop", "veal", "goat",
      "meatball", "brisket", "rib", "sardine", "trout", "sea bass", "monkfish",
    ],
  },
  {
    id: "dairy",
    terms: [
      "milk", "butter", "cheese", "cheddar", "parmesan", "mozzarella", "feta",
      "ricotta", "mascarpone", "cream", "yogurt", "yoghurt", "egg", "ghee",
      "creme fraiche", "crème fraîche", "buttermilk", "halloumi", "paneer",
      "gruyere", "brie", "goats cheese", "custard",
    ],
  },
  {
    id: "bakery",
    terms: [
      "bread", "baguette", "tortilla", "wrap", "pitta", "pita", "bun", "roll",
      "naan", "brioche", "ciabatta", "croissant", "muffin", "breadcrumb",
      "puff pastry", "filo", "shortcrust", "pastry",
    ],
  },
  {
    id: "produce",
    terms: [
      "onion", "garlic", "tomato", "pepper", "carrot", "celery", "lemon",
      "lime", "orange", "apple", "banana", "potato", "spinach", "mushroom",
      "ginger", "chilli", "chili", "jalapeno", "avocado", "cucumber", "lettuce",
      "zucchini", "courgette", "aubergine", "eggplant", "spring onion",
      "scallion", "shallot", "leek", "broccoli", "cauliflower", "cabbage",
      "kale", "pea", "green bean", "bean sprout", "corn", "sweetcorn", "squash",
      "pumpkin", "beetroot", "radish", "asparagus", "basil", "parsley",
      "cilantro", "coriander", "thyme", "rosemary", "mint", "dill", "sage",
      "chive", "lemongrass", "watercress", "rocket", "arugula", "fennel",
      "mango", "pineapple", "berr", "grape", "pear", "peach", "plum", "fig",
      "date", "pomegranate", "olive", "turnip", "parsnip", "swede", "okra",
      "bok choy", "pak choi", "salad",
    ],
  },
  {
    id: "pantry",
    terms: [
      "rice", "pasta", "spaghetti", "penne", "macaroni", "noodle", "lasagne",
      "lasagna", "flour", "sugar", "oil", "vinegar", "stock", "broth",
      "soy sauce", "fish sauce", "oyster sauce", "worcestershire", "sriracha",
      "hot sauce", "ketchup", "mustard", "mayonnaise", "tomato puree",
      "tomato paste", "passata", "chopped tomatoes", "canned tomatoes",
      "coconut milk", "coconut cream", "bean", "lentil", "chickpea", "tahini",
      "peanut butter", "honey", "maple syrup", "golden syrup", "treacle",
      "jam", "chocolate", "cocoa", "coconut", "almond", "walnut", "cashew",
      "peanut", "pecan", "pistachio", "pine nut", "sesame", "raisin",
      "sultana", "apricot", "couscous", "quinoa", "bulgur", "polenta", "oats",
      "cornflour", "cornstarch", "gelatin", "wine", "beer", "brandy", "rum",
      "sherry", "mirin", "sake", "curry paste", "miso", "harissa", "pesto",
      "gochujang", "capers", "sun dried",
    ],
  },
];

export function categorize(name) {
  const n = name.toLowerCase();
  for (const rule of RULES) {
    if (rule.terms.some((t) => n.includes(t))) return rule.id;
  }
  return "other";
}

/**
 * Build the unified list from the weekly plan.
 * Returns aisle groups: [{ id, label, emoji, bg, items: [{ name, display, recipes }] }]
 */
export function buildShoppingList(plan) {
  const map = new Map();
  for (const meal of plan) {
    for (const ing of meal.ingredients || []) {
      const key = ing.name.trim().toLowerCase();
      if (!key) continue;
      if (!map.has(key)) {
        map.set(key, { name: key, entries: [], recipes: new Set() });
      }
      const item = map.get(key);
      item.entries.push({ ...parseMeasure(ing.measure), raw: ing.measure });
      item.recipes.add(meal.name);
    }
  }

  const items = [...map.values()].map((item) => ({
    name: item.name,
    display: formatEntries(item.entries),
    recipes: [...item.recipes],
    category: categorize(item.name),
  }));

  return AISLES.map((aisle) => ({
    ...aisle,
    items: items
      .filter((i) => i.category === aisle.id)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0);
}
