import chalk from "chalk";
import { appendFileSync, writeFileSync } from "fs";

import {
  splitEvery,
  readInputs,
  add,
  ascending,
  difference,
  intersection,
  union,
  addArray,
  derivative,
  min,
  max,
  mod,
} from "../helpers";

const dirs = { se: [1, 1], sw: [1, -1], ne: [-1, 1], nw: [-1, -1], e: [0, 2], w: [0, -2] };

function getMap(input: string) {
  return input
    .split("\n")
    .map((l) =>
      JSON.stringify(l.match(/((?:s|n)(?:w|e))|(w|e)/g).reduce((a, b) => a.map((x, j) => x + dirs[b][j]), [0, 0]))
    )
    .reduce((a, b) => (a.has(b) ? a.set(b, (a.get(b) + 1) % 2) : a.set(b, 1)), new Map());
}

function part1(input: string) {
  return [...getMap(input).values()].reduce((a, b) => a + b);
}

function part2(input: string) {
  const map = getMap(input);
  map.forEach((v, coord) => map.set(coord, [v, 0]));
  const getAdj = (coord) =>
    Object.entries(dirs).map(([_, dir]) => JSON.stringify(JSON.parse(coord).map((y, i) => dir[i] + y)));
  const countAdjBlackTiles = (coord) =>
    getAdj(coord)
      .map((c) => map.get(c))
      .filter((x) => x && x[0]).length;

  const step = () => {
    map.forEach(([isBlack, changed], coord) => {
      [coord, ...getAdj(coord)].forEach((_coord) => {
        const count = countAdjBlackTiles(_coord);
        const _isBlack = map.has(_coord) ? map.get(_coord)[0] : 0;
        if ((_isBlack && (count == 0 || count > 2)) || (!_isBlack && count == 2)) {
          map.set(_coord, [_isBlack, 1]);
        }
      });
    });
    map.forEach(([isBlack, changed], coord) => {
      if (changed) {
        map.set(coord, [Number(!isBlack), 0]);
      }
    });
  };
  for (let i = 0; i < 100; i++) {
    step();
  }

  return [...map.values()].map((x) => x[0]).reduce((a, b) => a + b); //?
}

const { input, example } = readInputs({ day: 24 });

// part1(example); //?
// part2(example); //?
// part1(example); //?
console.log(part2(input)); //?
// part1(input); //?

// console.log(part2(example));

// part1(input);
// console.log(part2(input));
