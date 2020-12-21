import { readInputs, add, ascending } from "../helpers";

type Ingredient = string;
type Allergen = string;
type AllergenMap = Map<Allergen, Set<Ingredient>>;
type Food = {
  id?: number;
  ingredients: Set<string>;
  allergens: Set<string>;
};

function parse(str: string) {
  const [ing, cont] = str.split("(");
  const ings = ing.trim().split(/ /g);
  const conts = cont
    .split(/[ ,()]+/g)
    .filter((x) => x)
    .slice(1);
  return {
    ingredients: new Set(ings),
    allergens: new Set(conts),
  };
}

function findAllInstancesOfAllergen(foods: Food[], allergen) {
  return foods.filter((x) => x.allergens.has(allergen));
}

function findAllInstancesOfIngredient(foods: Food[], ingredient) {
  return foods.filter((x) => x.ingredients.has(ingredient));
}

function intersection<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  // intersect can be simulated via
  return new Set([...set1].filter((x) => set2.has(x)));
}

function difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  // difference can be simulated via
  return new Set([...set1].filter((x) => !set2.has(x)));
}

function union<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  // union can be simulated via
  return new Set([...set1, ...set2]);
}

function combineFoods(foods: Food[]) {
  const ingredients = new Set<string>();
  const allergens = new Set<string>();
  foods.forEach((food) => {
    food.ingredients.forEach(ingredients.add);
    food.allergens.forEach(allergens.add);
  });
  return { ingredients, allergens } as Food;
}

const combineIngredients = (map: AllergenMap) => {
  let combinedIngredients = new Set<Ingredient>();
  map.forEach((ingredients) => {
    combinedIngredients = union(combinedIngredients, ingredients);
  });
  return combinedIngredients;
};

const countInstancesOf = (map: AllergenMap) => (ingredient: Ingredient) => {
  let count = 0;
  map.forEach((ingredients) => {
    if (ingredients.has(ingredient)) {
      count += 1;
    }
  });
  return count;
};

const getPossibilityCount = (map: AllergenMap) => {
  let count = 0;
  map.forEach((ingredients) => {
    count += ingredients.size;
  });
  return count;
};

const splitMapBy = (fn: (allergen: Allergen, ingredients: Set<Ingredient>) => boolean) => (map: AllergenMap) => {
  const group1 = new Map() as AllergenMap;
  const group2 = new Map() as AllergenMap;

  for (const [allergen, ingredients] of map) {
    if (fn(allergen, ingredients)) {
      group1.set(allergen, ingredients);
    } else {
      group2.set(allergen, ingredients);
    }
  }
  return [group1, group2];
};

function getFoods(input: string) {
  const lines = input.split("\n");
  const foods = lines.map(parse);
  return foods;
}

function getAllergens(foods: Food[]) {
  const allergenMap = new Map() as AllergenMap;
  let allIngredients = new Set<Ingredient>();

  foods.forEach((food) => {
    allIngredients = union(allIngredients, food.ingredients);
    food.allergens.forEach((allergen) => {
      if (allergenMap.has(allergen)) {
        allergenMap.set(allergen, intersection(allergenMap.get(allergen), food.ingredients));
      } else {
        allergenMap.set(allergen, food.ingredients);
      }
    });
  });

  function step() {
    const [knowns, unknowns] = splitMapBy((allergen, ingredients) => ingredients.size == 1)(allergenMap);
    const knownIngredients = combineIngredients(knowns);
    for (const [allergen, ingredients] of unknowns) {
      //allergenMap.get(allergen)
      allergenMap.set(allergen, difference(ingredients, knownIngredients));
    }
  }

  while (getPossibilityCount(allergenMap) != allergenMap.size) {
    step();
  }

  return { allergenMap, allIngredients };
}

function part1(input: string) {
  const foods = getFoods(input);
  const { allergenMap, allIngredients } = getAllergens(foods);

  const containsNoAllergens = difference(allIngredients, combineIngredients(allergenMap));
  return [...containsNoAllergens]
    .map((ingredient) => findAllInstancesOfIngredient(foods, ingredient).length)
    .reduce(add);
}

function part2(input: string) {
  const foods = getFoods(input);
  const { allergenMap, allIngredients } = getAllergens(foods);
  return [...allergenMap]
    .sort((a, b) => ascending([...a[0]][0], [...b[0]][0]))
    .map((x) => [...x[1]][0])
    .join(",");
}

const { input, example } = readInputs({ day: 21 });

// console.log(part1(example));
// console.log(part2(example));

console.log(part1(input));
console.log(part2(input));
