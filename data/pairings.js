// Curated ingredient pairing graph, inspired by FlavorGraph
// (https://github.com/lamypark/FlavorGraph) — a deep-learning model of
// ingredient relationships trained on 1M+ recipes and chemical compound data.
//
// This static dataset keeps the Flavor Lab instant and offline. To regenerate
// it from the real FlavorGraph embeddings, see scripts/build_flavorgraph.py.

export const CATEGORY_STYLE = {
  protein: { color: "#ff8577", label: "Protein" },
  vegetable: { color: "#8fd9a8", label: "Vegetable" },
  herb: { color: "#6fcf97", label: "Herb" },
  spice: { color: "#ffc531", label: "Spice" },
  fruit: { color: "#ffa94d", label: "Fruit" },
  dairy: { color: "#74c0e3", label: "Dairy" },
  pantry: { color: "#a78bda", label: "Pantry" },
  nut: { color: "#d4a373", label: "Nuts & Seeds" },
};

export const NODES = {
  // proteins
  chicken: "protein", beef: "protein", pork: "protein", lamb: "protein",
  salmon: "protein", shrimp: "protein", cod: "protein", tofu: "protein",
  egg: "protein", bacon: "protein", chorizo: "protein", duck: "protein",
  // vegetables
  onion: "vegetable", garlic: "vegetable", tomato: "vegetable",
  potato: "vegetable", carrot: "vegetable", celery: "vegetable",
  "bell pepper": "vegetable", mushroom: "vegetable", spinach: "vegetable",
  broccoli: "vegetable", cauliflower: "vegetable", zucchini: "vegetable",
  eggplant: "vegetable", cabbage: "vegetable", kale: "vegetable",
  peas: "vegetable", "green beans": "vegetable", corn: "vegetable",
  pumpkin: "vegetable", beetroot: "vegetable", asparagus: "vegetable",
  leek: "vegetable", avocado: "vegetable", cucumber: "vegetable",
  "sweet potato": "vegetable", olives: "vegetable",
  // herbs
  basil: "herb", parsley: "herb", cilantro: "herb", thyme: "herb",
  rosemary: "herb", mint: "herb", dill: "herb", oregano: "herb",
  sage: "herb", chives: "herb", lemongrass: "herb",
  // spices & aromatics
  cumin: "spice", paprika: "spice", chili: "spice", "black pepper": "spice",
  ginger: "spice", turmeric: "spice", cinnamon: "spice", nutmeg: "spice",
  "curry powder": "spice", "garam masala": "spice",
  // fruit
  lemon: "fruit", lime: "fruit", orange: "fruit", apple: "fruit",
  mango: "fruit", pineapple: "fruit", pomegranate: "fruit",
  // dairy
  butter: "dairy", cream: "dairy", parmesan: "dairy", feta: "dairy",
  mozzarella: "dairy", cheddar: "dairy", yogurt: "dairy",
  "goat cheese": "dairy",
  // pantry
  "olive oil": "pantry", "soy sauce": "pantry", "fish sauce": "pantry",
  miso: "pantry", honey: "pantry", mustard: "pantry", vinegar: "pantry",
  "coconut milk": "pantry", rice: "pantry", pasta: "pantry",
  noodles: "pantry", chickpeas: "pantry", lentils: "pantry",
  "red wine": "pantry", "white wine": "pantry",
  // nuts & seeds
  almond: "nut", walnut: "nut", peanut: "nut", cashew: "nut",
  "pine nuts": "nut", sesame: "nut",
};

export const PAIRS = {
  chicken: [["lemon", 0.93], ["garlic", 0.91], ["thyme", 0.88], ["rosemary", 0.85], ["ginger", 0.84], ["paprika", 0.82], ["soy sauce", 0.8], ["honey", 0.78], ["coconut milk", 0.74], ["mushroom", 0.72]],
  beef: [["black pepper", 0.92], ["garlic", 0.9], ["onion", 0.89], ["red wine", 0.86], ["mushroom", 0.85], ["rosemary", 0.8], ["soy sauce", 0.78], ["mustard", 0.75], ["carrot", 0.72], ["chili", 0.7]],
  pork: [["apple", 0.9], ["sage", 0.87], ["garlic", 0.85], ["honey", 0.83], ["ginger", 0.8], ["soy sauce", 0.79], ["mustard", 0.77], ["cabbage", 0.74], ["paprika", 0.72], ["pineapple", 0.68]],
  lamb: [["rosemary", 0.93], ["garlic", 0.9], ["mint", 0.89], ["cumin", 0.84], ["yogurt", 0.8], ["oregano", 0.76], ["lemon", 0.75], ["eggplant", 0.7], ["pomegranate", 0.66], ["cinnamon", 0.62]],
  salmon: [["lemon", 0.94], ["dill", 0.91], ["soy sauce", 0.84], ["ginger", 0.82], ["honey", 0.78], ["asparagus", 0.74], ["miso", 0.73], ["cream", 0.7], ["cucumber", 0.66], ["sesame", 0.65]],
  shrimp: [["garlic", 0.93], ["lime", 0.88], ["chili", 0.87], ["lemongrass", 0.8], ["butter", 0.79], ["cilantro", 0.77], ["fish sauce", 0.74], ["coconut milk", 0.73], ["parsley", 0.68], ["pasta", 0.65]],
  cod: [["lemon", 0.9], ["parsley", 0.85], ["butter", 0.83], ["potato", 0.8], ["peas", 0.74], ["chorizo", 0.7], ["tomato", 0.68], ["dill", 0.66], ["olive oil", 0.64], ["capers", 0.6]],
  tofu: [["soy sauce", 0.93], ["ginger", 0.88], ["sesame", 0.86], ["garlic", 0.84], ["chili", 0.79], ["miso", 0.77], ["noodles", 0.74], ["mushroom", 0.7], ["broccoli", 0.66], ["peanut", 0.65]],
  egg: [["bacon", 0.9], ["chives", 0.85], ["cheddar", 0.82], ["butter", 0.8], ["spinach", 0.76], ["mushroom", 0.74], ["tomato", 0.72], ["potato", 0.7], ["parmesan", 0.68], ["black pepper", 0.66]],
  bacon: [["egg", 0.9], ["maple", 0.82], ["onion", 0.8], ["potato", 0.78], ["cabbage", 0.74], ["mushroom", 0.72], ["cheddar", 0.7], ["peas", 0.66], ["leek", 0.65], ["tomato", 0.62]],
  chorizo: [["potato", 0.84], ["egg", 0.8], ["chickpeas", 0.78], ["bell pepper", 0.76], ["paprika", 0.75], ["cod", 0.7], ["tomato", 0.7], ["rice", 0.66], ["shrimp", 0.64], ["kale", 0.6]],
  duck: [["orange", 0.92], ["honey", 0.84], ["ginger", 0.78], ["soy sauce", 0.76], ["cherry", 0.72], ["five spice", 0.7], ["red wine", 0.66], ["cabbage", 0.62], ["pomegranate", 0.6], ["thyme", 0.58]],

  onion: [["garlic", 0.95], ["tomato", 0.88], ["beef", 0.89], ["butter", 0.8], ["thyme", 0.76], ["celery", 0.75], ["carrot", 0.75], ["bell pepper", 0.72], ["bacon", 0.8], ["mushroom", 0.7]],
  garlic: [["onion", 0.95], ["olive oil", 0.92], ["chili", 0.85], ["ginger", 0.84], ["parsley", 0.8], ["tomato", 0.82], ["lemon", 0.78], ["butter", 0.77], ["shrimp", 0.93], ["chicken", 0.91]],
  tomato: [["basil", 0.95], ["garlic", 0.82], ["mozzarella", 0.88], ["olive oil", 0.85], ["onion", 0.88], ["oregano", 0.8], ["pasta", 0.79], ["feta", 0.72], ["cucumber", 0.7], ["chili", 0.66]],
  potato: [["butter", 0.9], ["rosemary", 0.85], ["cream", 0.8], ["cheddar", 0.78], ["bacon", 0.78], ["leek", 0.75], ["garlic", 0.74], ["chives", 0.72], ["egg", 0.7], ["paprika", 0.65]],
  carrot: [["ginger", 0.82], ["honey", 0.8], ["cumin", 0.75], ["onion", 0.75], ["celery", 0.74], ["orange", 0.7], ["peas", 0.66], ["lentils", 0.64], ["parsley", 0.6], ["butter", 0.6]],
  celery: [["onion", 0.75], ["carrot", 0.74], ["apple", 0.68], ["walnut", 0.66], ["lentils", 0.6], ["butter", 0.58], ["thyme", 0.56], ["potato", 0.54], ["chicken", 0.6], ["tomato", 0.52]],
  "bell pepper": [["onion", 0.72], ["chorizo", 0.76], ["tomato", 0.7], ["chili", 0.68], ["paprika", 0.66], ["rice", 0.64], ["feta", 0.62], ["eggplant", 0.6], ["garlic", 0.65], ["corn", 0.58]],
  mushroom: [["garlic", 0.85], ["butter", 0.84], ["thyme", 0.8], ["cream", 0.78], ["beef", 0.85], ["parmesan", 0.72], ["soy sauce", 0.7], ["egg", 0.74], ["pasta", 0.68], ["miso", 0.62]],
  spinach: [["feta", 0.84], ["garlic", 0.8], ["egg", 0.76], ["cream", 0.74], ["nutmeg", 0.72], ["chickpeas", 0.68], ["lemon", 0.66], ["parmesan", 0.64], ["pine nuts", 0.62], ["yogurt", 0.58]],
  broccoli: [["garlic", 0.78], ["chili", 0.72], ["soy sauce", 0.7], ["cheddar", 0.68], ["lemon", 0.66], ["almond", 0.62], ["sesame", 0.62], ["tofu", 0.66], ["pasta", 0.58], ["ginger", 0.56]],
  cauliflower: [["cumin", 0.76], ["turmeric", 0.74], ["cheddar", 0.72], ["curry powder", 0.7], ["tahini", 0.64], ["garlic", 0.66], ["chickpeas", 0.62], ["almond", 0.58], ["capers", 0.54], ["parsley", 0.52]],
  zucchini: [["garlic", 0.72], ["basil", 0.7], ["parmesan", 0.68], ["tomato", 0.66], ["lemon", 0.64], ["mint", 0.6], ["feta", 0.58], ["pine nuts", 0.54], ["olive oil", 0.62], ["oregano", 0.5]],
  eggplant: [["garlic", 0.76], ["tomato", 0.74], ["miso", 0.7], ["yogurt", 0.66], ["lamb", 0.7], ["basil", 0.62], ["parmesan", 0.6], ["chili", 0.58], ["sesame", 0.56], ["pomegranate", 0.52]],
  cabbage: [["bacon", 0.74], ["pork", 0.74], ["caraway", 0.66], ["ginger", 0.62], ["sesame", 0.6], ["butter", 0.58], ["apple", 0.56], ["carrot", 0.54], ["vinegar", 0.6], ["mustard", 0.52]],
  kale: [["garlic", 0.7], ["chili", 0.64], ["lemon", 0.62], ["chickpeas", 0.6], ["parmesan", 0.58], ["chorizo", 0.6], ["almond", 0.52], ["olive oil", 0.6], ["sesame", 0.5], ["potato", 0.48]],
  peas: [["mint", 0.8], ["butter", 0.72], ["bacon", 0.66], ["feta", 0.62], ["parmesan", 0.6], ["cream", 0.58], ["lemon", 0.56], ["dill", 0.54], ["carrot", 0.66], ["rice", 0.52]],
  "green beans": [["garlic", 0.68], ["almond", 0.66], ["lemon", 0.62], ["sesame", 0.58], ["butter", 0.58], ["chili", 0.54], ["tomato", 0.52], ["soy sauce", 0.52], ["bacon", 0.5], ["mustard", 0.46]],
  corn: [["butter", 0.78], ["lime", 0.72], ["chili", 0.7], ["feta", 0.66], ["cilantro", 0.64], ["bacon", 0.6], ["avocado", 0.58], ["paprika", 0.54], ["bell pepper", 0.58], ["cream", 0.52]],
  pumpkin: [["sage", 0.78], ["cinnamon", 0.74], ["nutmeg", 0.7], ["coconut milk", 0.66], ["ginger", 0.64], ["parmesan", 0.6], ["chili", 0.56], ["honey", 0.56], ["walnut", 0.52], ["cream", 0.5]],
  beetroot: [["goat cheese", 0.82], ["walnut", 0.72], ["dill", 0.66], ["orange", 0.62], ["yogurt", 0.6], ["horseradish", 0.56], ["mint", 0.52], ["lentils", 0.5], ["feta", 0.58], ["apple", 0.46]],
  asparagus: [["parmesan", 0.76], ["lemon", 0.74], ["butter", 0.72], ["egg", 0.68], ["salmon", 0.74], ["garlic", 0.62], ["pasta", 0.56], ["chives", 0.54], ["olive oil", 0.6], ["cream", 0.5]],
  leek: [["potato", 0.75], ["butter", 0.72], ["cream", 0.68], ["thyme", 0.62], ["bacon", 0.65], ["cheddar", 0.58], ["chicken", 0.6], ["mustard", 0.52], ["egg", 0.5], ["white wine", 0.5]],
  avocado: [["lime", 0.86], ["cilantro", 0.8], ["chili", 0.74], ["tomato", 0.7], ["corn", 0.58], ["egg", 0.6], ["cucumber", 0.56], ["sesame", 0.52], ["shrimp", 0.6], ["onion", 0.55]],
  cucumber: [["dill", 0.78], ["yogurt", 0.76], ["mint", 0.72], ["feta", 0.68], ["tomato", 0.7], ["vinegar", 0.62], ["sesame", 0.56], ["avocado", 0.56], ["lime", 0.52], ["salmon", 0.66]],
  "sweet potato": [["chili", 0.72], ["lime", 0.68], ["coconut milk", 0.66], ["cumin", 0.64], ["honey", 0.62], ["feta", 0.58], ["black beans", 0.56], ["ginger", 0.54], ["cinnamon", 0.52], ["peanut", 0.5]],
  olives: [["feta", 0.78], ["tomato", 0.72], ["lemon", 0.66], ["oregano", 0.64], ["garlic", 0.62], ["chicken", 0.58], ["pasta", 0.54], ["orange", 0.46], ["capers", 0.6], ["olive oil", 0.66]],

  basil: [["tomato", 0.95], ["mozzarella", 0.86], ["garlic", 0.8], ["pasta", 0.76], ["olive oil", 0.74], ["pine nuts", 0.72], ["parmesan", 0.7], ["lemon", 0.6], ["zucchini", 0.7], ["strawberry", 0.5]],
  parsley: [["garlic", 0.8], ["lemon", 0.78], ["olive oil", 0.7], ["cod", 0.85], ["butter", 0.62], ["tomato", 0.6], ["chickpeas", 0.58], ["bulgur", 0.56], ["mushroom", 0.54], ["potato", 0.52]],
  cilantro: [["lime", 0.88], ["chili", 0.82], ["avocado", 0.8], ["cumin", 0.74], ["coconut milk", 0.7], ["ginger", 0.68], ["fish sauce", 0.64], ["corn", 0.64], ["shrimp", 0.77], ["yogurt", 0.56]],
  thyme: [["chicken", 0.88], ["mushroom", 0.8], ["lemon", 0.74], ["onion", 0.76], ["potato", 0.68], ["beef", 0.66], ["honey", 0.6], ["carrot", 0.56], ["leek", 0.62], ["red wine", 0.54]],
  rosemary: [["lamb", 0.93], ["potato", 0.85], ["chicken", 0.85], ["garlic", 0.78], ["olive oil", 0.7], ["lemon", 0.64], ["beef", 0.8], ["honey", 0.56], ["white wine", 0.52], ["bread", 0.5]],
  mint: [["lamb", 0.89], ["peas", 0.8], ["yogurt", 0.76], ["cucumber", 0.72], ["lime", 0.68], ["feta", 0.64], ["mango", 0.58], ["chili", 0.54], ["pomegranate", 0.56], ["chocolate", 0.5]],
  dill: [["salmon", 0.91], ["cucumber", 0.78], ["yogurt", 0.72], ["lemon", 0.7], ["potato", 0.64], ["egg", 0.6], ["beetroot", 0.66], ["cream", 0.56], ["mustard", 0.54], ["shrimp", 0.52]],
  oregano: [["tomato", 0.8], ["feta", 0.74], ["lemon", 0.7], ["garlic", 0.68], ["chicken", 0.66], ["olive oil", 0.64], ["lamb", 0.76], ["eggplant", 0.56], ["olives", 0.64], ["mozzarella", 0.52]],
  sage: [["pork", 0.87], ["butter", 0.82], ["pumpkin", 0.78], ["pasta", 0.62], ["chicken", 0.6], ["onion", 0.58], ["apple", 0.6], ["walnut", 0.52], ["parmesan", 0.5], ["white wine", 0.46]],
  chives: [["egg", 0.85], ["potato", 0.72], ["cream", 0.66], ["salmon", 0.62], ["butter", 0.6], ["goat cheese", 0.56], ["mushroom", 0.5], ["cucumber", 0.46], ["cheddar", 0.5], ["asparagus", 0.54]],
  lemongrass: [["coconut milk", 0.84], ["ginger", 0.8], ["chili", 0.76], ["lime", 0.74], ["fish sauce", 0.7], ["shrimp", 0.8], ["chicken", 0.64], ["cilantro", 0.6], ["garlic", 0.58], ["noodles", 0.54]],

  cumin: [["cilantro", 0.74], ["chili", 0.76], ["lamb", 0.84], ["chickpeas", 0.72], ["carrot", 0.75], ["yogurt", 0.64], ["lentils", 0.68], ["cauliflower", 0.76], ["paprika", 0.62], ["lime", 0.58]],
  paprika: [["chicken", 0.82], ["chorizo", 0.75], ["potato", 0.65], ["egg", 0.58], ["cream", 0.56], ["bell pepper", 0.66], ["chickpeas", 0.54], ["pork", 0.72], ["corn", 0.54], ["cauliflower", 0.5]],
  chili: [["garlic", 0.85], ["lime", 0.8], ["cilantro", 0.82], ["ginger", 0.74], ["shrimp", 0.87], ["chocolate", 0.56], ["honey", 0.6], ["mango", 0.62], ["corn", 0.7], ["peanut", 0.64]],
  "black pepper": [["beef", 0.92], ["egg", 0.66], ["parmesan", 0.64], ["butter", 0.6], ["cream", 0.58], ["lemon", 0.56], ["pasta", 0.6], ["mushroom", 0.54], ["chicken", 0.6], ["honey", 0.46]],
  ginger: [["garlic", 0.84], ["soy sauce", 0.82], ["chili", 0.74], ["lime", 0.7], ["honey", 0.68], ["carrot", 0.82], ["coconut milk", 0.66], ["chicken", 0.84], ["sesame", 0.62], ["turmeric", 0.6]],
  turmeric: [["coconut milk", 0.74], ["ginger", 0.6], ["cauliflower", 0.74], ["rice", 0.62], ["lentils", 0.6], ["chicken", 0.58], ["yogurt", 0.54], ["cumin", 0.66], ["honey", 0.44], ["black pepper", 0.5]],
  cinnamon: [["apple", 0.88], ["honey", 0.7], ["lamb", 0.62], ["pumpkin", 0.74], ["orange", 0.6], ["almond", 0.58], ["yogurt", 0.5], ["chocolate", 0.62], ["rice", 0.46], ["nutmeg", 0.6]],
  nutmeg: [["spinach", 0.72], ["cream", 0.68], ["pumpkin", 0.7], ["potato", 0.56], ["cinnamon", 0.6], ["cheese", 0.54], ["egg", 0.5], ["pasta", 0.46], ["apple", 0.5], ["butter", 0.44]],
  "curry powder": [["coconut milk", 0.8], ["chicken", 0.76], ["cauliflower", 0.7], ["lentils", 0.66], ["rice", 0.62], ["yogurt", 0.58], ["chickpeas", 0.62], ["shrimp", 0.56], ["potato", 0.54], ["mango", 0.5]],
  "garam masala": [["yogurt", 0.7], ["chicken", 0.72], ["lentils", 0.64], ["chickpeas", 0.62], ["tomato", 0.6], ["coconut milk", 0.58], ["cauliflower", 0.6], ["spinach", 0.56], ["rice", 0.5], ["ginger", 0.62]],

  lemon: [["chicken", 0.93], ["salmon", 0.94], ["garlic", 0.78], ["butter", 0.74], ["parsley", 0.78], ["asparagus", 0.74], ["yogurt", 0.62], ["honey", 0.64], ["olive oil", 0.7], ["dill", 0.7]],
  lime: [["cilantro", 0.88], ["avocado", 0.86], ["chili", 0.8], ["shrimp", 0.88], ["coconut milk", 0.72], ["mango", 0.7], ["fish sauce", 0.66], ["mint", 0.68], ["corn", 0.72], ["ginger", 0.7]],
  orange: [["duck", 0.92], ["carrot", 0.7], ["beetroot", 0.62], ["cinnamon", 0.6], ["almond", 0.58], ["chocolate", 0.6], ["fennel", 0.56], ["honey", 0.56], ["olives", 0.46], ["pomegranate", 0.5]],
  apple: [["pork", 0.9], ["cinnamon", 0.88], ["walnut", 0.7], ["cheddar", 0.66], ["celery", 0.68], ["sage", 0.6], ["cabbage", 0.56], ["honey", 0.6], ["butter", 0.54], ["goat cheese", 0.5]],
  mango: [["lime", 0.7], ["chili", 0.62], ["coconut milk", 0.6], ["cilantro", 0.56], ["mint", 0.58], ["shrimp", 0.54], ["yogurt", 0.52], ["rice", 0.46], ["curry powder", 0.5], ["avocado", 0.48]],
  pineapple: [["pork", 0.68], ["chili", 0.6], ["lime", 0.58], ["coconut milk", 0.56], ["cilantro", 0.5], ["rice", 0.46], ["ginger", 0.48], ["ham", 0.52], ["mint", 0.44], ["shrimp", 0.46]],
  pomegranate: [["lamb", 0.66], ["feta", 0.6], ["mint", 0.56], ["walnut", 0.56], ["eggplant", 0.52], ["yogurt", 0.5], ["orange", 0.5], ["duck", 0.6], ["cucumber", 0.44], ["chickpeas", 0.44]],

  butter: [["potato", 0.9], ["garlic", 0.77], ["mushroom", 0.84], ["sage", 0.82], ["lemon", 0.74], ["shrimp", 0.79], ["peas", 0.72], ["corn", 0.78], ["egg", 0.8], ["pasta", 0.7]],
  cream: [["mushroom", 0.78], ["potato", 0.8], ["pasta", 0.74], ["leek", 0.68], ["nutmeg", 0.68], ["chicken", 0.66], ["salmon", 0.7], ["spinach", 0.74], ["black pepper", 0.58], ["white wine", 0.56]],
  parmesan: [["pasta", 0.9], ["basil", 0.7], ["mushroom", 0.72], ["asparagus", 0.76], ["egg", 0.68], ["tomato", 0.66], ["spinach", 0.64], ["zucchini", 0.68], ["pine nuts", 0.6], ["black pepper", 0.64]],
  feta: [["spinach", 0.84], ["olives", 0.78], ["tomato", 0.72], ["cucumber", 0.68], ["mint", 0.64], ["watermelon", 0.6], ["beetroot", 0.58], ["corn", 0.66], ["oregano", 0.74], ["lemon", 0.6]],
  mozzarella: [["tomato", 0.88], ["basil", 0.86], ["olive oil", 0.7], ["pasta", 0.62], ["eggplant", 0.58], ["oregano", 0.52], ["garlic", 0.56], ["chicken", 0.54], ["bell pepper", 0.5], ["olives", 0.5]],
  cheddar: [["egg", 0.82], ["potato", 0.78], ["broccoli", 0.68], ["apple", 0.66], ["bacon", 0.7], ["corn", 0.6], ["mustard", 0.58], ["cauliflower", 0.72], ["leek", 0.58], ["bread", 0.56]],
  yogurt: [["mint", 0.76], ["cucumber", 0.76], ["lamb", 0.8], ["garlic", 0.66], ["dill", 0.72], ["honey", 0.68], ["cumin", 0.64], ["garam masala", 0.7], ["lemon", 0.62], ["beetroot", 0.6]],
  "goat cheese": [["beetroot", 0.82], ["honey", 0.72], ["walnut", 0.68], ["thyme", 0.62], ["spinach", 0.58], ["fig", 0.6], ["chives", 0.56], ["asparagus", 0.52], ["lemon", 0.5], ["olive oil", 0.5]],

  "olive oil": [["garlic", 0.92], ["tomato", 0.85], ["lemon", 0.7], ["basil", 0.74], ["rosemary", 0.7], ["bread", 0.64], ["oregano", 0.64], ["vinegar", 0.66], ["olives", 0.66], ["parsley", 0.7]],
  "soy sauce": [["ginger", 0.82], ["garlic", 0.8], ["sesame", 0.78], ["honey", 0.7], ["tofu", 0.93], ["rice", 0.68], ["noodles", 0.7], ["chicken", 0.8], ["beef", 0.78], ["mushroom", 0.7]],
  "fish sauce": [["lime", 0.66], ["chili", 0.68], ["lemongrass", 0.7], ["cilantro", 0.64], ["shrimp", 0.74], ["noodles", 0.62], ["peanut", 0.56], ["garlic", 0.6], ["coconut milk", 0.58], ["ginger", 0.56]],
  miso: [["tofu", 0.77], ["salmon", 0.73], ["eggplant", 0.7], ["sesame", 0.66], ["ginger", 0.62], ["mushroom", 0.62], ["noodles", 0.58], ["honey", 0.54], ["butter", 0.52], ["rice", 0.56]],
  honey: [["lemon", 0.64], ["ginger", 0.68], ["yogurt", 0.68], ["mustard", 0.72], ["chicken", 0.78], ["goat cheese", 0.72], ["cinnamon", 0.7], ["walnut", 0.6], ["carrot", 0.8], ["soy sauce", 0.7]],
  mustard: [["honey", 0.72], ["pork", 0.77], ["beef", 0.75], ["cheddar", 0.58], ["dill", 0.54], ["potato", 0.56], ["vinegar", 0.6], ["chicken", 0.6], ["leek", 0.52], ["cream", 0.5]],
  vinegar: [["olive oil", 0.66], ["mustard", 0.6], ["cucumber", 0.62], ["cabbage", 0.6], ["honey", 0.56], ["beetroot", 0.54], ["tomato", 0.5], ["shallot", 0.5], ["chili", 0.48], ["garlic", 0.5]],
  "coconut milk": [["lemongrass", 0.84], ["curry powder", 0.8], ["ginger", 0.66], ["lime", 0.72], ["chili", 0.7], ["chicken", 0.74], ["turmeric", 0.74], ["rice", 0.64], ["cilantro", 0.7], ["shrimp", 0.73]],
  rice: [["soy sauce", 0.68], ["egg", 0.66], ["chicken", 0.66], ["coconut milk", 0.64], ["peas", 0.52], ["turmeric", 0.62], ["sesame", 0.56], ["chili", 0.54], ["ginger", 0.56], ["chorizo", 0.66]],
  pasta: [["parmesan", 0.9], ["tomato", 0.79], ["basil", 0.76], ["garlic", 0.74], ["cream", 0.74], ["olive oil", 0.7], ["mushroom", 0.68], ["black pepper", 0.6], ["shrimp", 0.65], ["butter", 0.7]],
  noodles: [["soy sauce", 0.7], ["sesame", 0.68], ["ginger", 0.64], ["chili", 0.62], ["tofu", 0.74], ["peanut", 0.62], ["shrimp", 0.6], ["lime", 0.56], ["fish sauce", 0.62], ["miso", 0.58]],
  chickpeas: [["cumin", 0.72], ["garlic", 0.66], ["lemon", 0.64], ["spinach", 0.68], ["tomato", 0.62], ["yogurt", 0.58], ["chorizo", 0.78], ["curry powder", 0.62], ["tahini", 0.66], ["chili", 0.56]],
  lentils: [["cumin", 0.68], ["carrot", 0.64], ["tomato", 0.6], ["garlic", 0.58], ["curry powder", 0.66], ["spinach", 0.56], ["yogurt", 0.52], ["coconut milk", 0.54], ["celery", 0.6], ["beetroot", 0.5]],
  "red wine": [["beef", 0.86], ["mushroom", 0.66], ["thyme", 0.54], ["garlic", 0.56], ["onion", 0.58], ["duck", 0.66], ["chocolate", 0.5], ["rosemary", 0.5], ["lamb", 0.6], ["tomato", 0.52]],
  "white wine": [["cream", 0.56], ["garlic", 0.58], ["shrimp", 0.6], ["chicken", 0.58], ["leek", 0.5], ["mussels", 0.62], ["butter", 0.56], ["parsley", 0.5], ["lemon", 0.54], ["cod", 0.52]],

  almond: [["green beans", 0.66], ["broccoli", 0.62], ["apple", 0.56], ["honey", 0.56], ["orange", 0.58], ["cinnamon", 0.58], ["cauliflower", 0.58], ["yogurt", 0.5], ["chicken", 0.5], ["chocolate", 0.54]],
  walnut: [["beetroot", 0.72], ["goat cheese", 0.68], ["apple", 0.7], ["honey", 0.6], ["celery", 0.66], ["pomegranate", 0.56], ["sage", 0.52], ["pasta", 0.5], ["pumpkin", 0.52], ["cinnamon", 0.48]],
  peanut: [["chili", 0.64], ["noodles", 0.62], ["lime", 0.6], ["coconut milk", 0.58], ["tofu", 0.65], ["cilantro", 0.56], ["fish sauce", 0.56], ["honey", 0.52], ["ginger", 0.54], ["chicken", 0.56]],
  cashew: [["chicken", 0.6], ["chili", 0.56], ["coconut milk", 0.56], ["rice", 0.52], ["ginger", 0.52], ["curry powder", 0.54], ["broccoli", 0.5], ["soy sauce", 0.54], ["lime", 0.48], ["mango", 0.46]],
  "pine nuts": [["basil", 0.72], ["parmesan", 0.6], ["spinach", 0.62], ["zucchini", 0.54], ["pasta", 0.56], ["raisin", 0.5], ["cauliflower", 0.5], ["lemon", 0.48], ["olive oil", 0.52], ["eggplant", 0.5]],
  sesame: [["soy sauce", 0.78], ["ginger", 0.62], ["tofu", 0.86], ["noodles", 0.68], ["honey", 0.56], ["broccoli", 0.62], ["salmon", 0.65], ["cucumber", 0.56], ["chili", 0.58], ["miso", 0.66]],
};

/** Top pairings for an ingredient, filtered to nodes we know about. */
export function getPairs(name, limit = 10) {
  const pairs = PAIRS[name] || [];
  return pairs.filter(([n]) => NODES[n]).slice(0, limit);
}

export const ALL_INGREDIENTS = Object.keys(PAIRS).filter((n) => NODES[n]).sort();
