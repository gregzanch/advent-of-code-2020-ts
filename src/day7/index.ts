//@ts-nocheck

const input = require("fs").readFileSync("res/7/input", "utf8") as string;

interface Bag {
  color: string;
  contains: Map<Bag, number>;
  containedBy: Set<Bag>;
}

class Bag implements Bag {
  constructor(color: string) {
    this.color = color;
    this.contains = new Map<Bag, number>();
    this.containedBy = new Set<Bag>();
  }
  //   get containsTotal() {
  //     let count = this.contains.size;
  //     this.contains.forEach((n, b) => {
  //       count += n * b.containsTotal;
  //     });
  //     return count;
  //   }
}

function parseBagName(str: string) {
  const color = str.split(" ").slice(0, 2).join(" ").trim();
  return color;
}

function parseBagCount(str: string) {
  const parseBagCountRegExp = new RegExp(/(\d+)\s(\w+\s\w+)\sbag/gim);
  let m;
  while ((m = parseBagCountRegExp.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === parseBagCountRegExp.lastIndex) {
      parseBagCountRegExp.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    let matches = m.slice(1, 3);
    if (matches.length == 2) {
      matches[0] = Number(matches[0]);
    }
    return matches;
  }
}

function parseBagContains(str) {
  return str
    .split("contain")[1]
    .split(/\s?,\s?/gim)
    .map((y) => y.trim().replace(".", ""))
    .map(parseBagCount);
}

const lines = input.split("\n");
const bags = lines
  .map((line) => new Bag(parseBagName(line)))
  .reduce((a, b) => Object.assign(a, { [b.color]: b }), {});

lines.forEach((line) => {
  const bag = bags[parseBagName(line)] as Bag;
  const parsedContains = parseBagContains(line);
  if (parsedContains) {
    parsedContains
      .filter((x) => x)
      .forEach((x) => {
        const id = x[1];
        if (bags[id]) {
          bag.contains.set(bags[id], x[0]);
          (bags[id] as Bag).containedBy.add(bag);
        }
      });
  }
});

function canContainBag(bag: Bag) {
  return bag.contains.has(bag);
}

function getContainedCount(color: string) {
  let c = new Set<string>();
  function recurse(bag: Bag) {
    if (bag.color !== color) {
      c.add(bag.color);
    }
    if (bag.containedBy.size > 0) {
      bag.containedBy.forEach(recurse);
    }
  }
  recurse(bags[color]);
  return c.size;
}

getContainedCount("shiny gold");

// function getContainsCount(color: string) {
//   const bag = bags[color];
//   if (!bag) return;
//   let count = 0;
//   function recurse(bag: Bag, n: number) {
//     count += (bag.containsTotal;
//     console.log(bag.color);
//     bag.contains.forEach((val, containedBag) => {
//       recurse(containedBag);
//     });
//   }
//   recurse(bag);
//   return count;
// }

function traverse(bag: Bag, count = 0) {
  if (bag.contains.size > 0) {
    bag.contains.forEach((n: number, b: Bag) => {
      for (let i = 0; i < n; i++) {
        count = traverse(b, count + 1);
      }
    });
  }
  return count;
}

traverse(bags["shiny gold"]); //?
