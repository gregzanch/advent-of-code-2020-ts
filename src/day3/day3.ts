import { readPuzzleInput } from "../helpers";
export {};
(() => {
  const map = readPuzzleInput({ day: 3, seperator: "\n" });

  function getFeature(pos: number, pattern: string) {
    const index = pos % pattern.length;
    return pattern[index];
  }

  getFeature(36, map[0]);
  function getTrees(slope: number[]) {
    let current = 0;
    let trees = 0;
    for (let i = 0; i < map.length; i += slope[1]) {
      if (getFeature(current, map[i]) === "#") {
        trees += 1;
      }
      current += slope[0];
    }

    return trees;
  }

  let slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  getTrees(slopes[1]); //?

  let trees = slopes.map(getTrees).reduce((a, b) => a * b); //?
})();
