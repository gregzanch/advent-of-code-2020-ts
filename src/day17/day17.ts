import { env } from "process";
import * as helpers from "../helpers";

/* 
During a cycle, all cubes simultaneously change their state according to the following rules:

If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.

*/

function part1(input: string) {
  type Coord = [number, number, number];
  const encode = (x: Coord) => JSON.stringify(x) as string;
  const decode = (x: string) => JSON.parse(x) as Coord;
  function getOffsets(n: number) {
    const offsets = [] as Coord[];
    for (let ii = -1; ii <= 1; ii++) {
      for (let jj = -1; jj <= 1; jj++) {
        for (let kk = -1; kk <= 1; kk++) {
          if (ii == 0 && jj == 0 && kk == 0) continue;
          const coord: Coord = [ii, jj, kk];
          offsets.push(coord);
        }
      }
    }
    return offsets;
  }

  const parseActive = () => {
    const active = new Set<string>();
    input
      .split("\n")
      .forEach((x, i) => x.split("").forEach((y, j) => y === "#" && active.add(JSON.stringify([i, j, 0]))));
    return active;
  };

  const offsets = getOffsets(3);

  const getActiveNeighborCount = (active: Set<string>) => (inactive: Set<string>) => (
    i: number,
    j: number,
    k: number
  ) => (addToInactive = false) => {
    let count = 0;
    offsets.forEach((offset) => {
      const coord: Coord = [i + offset[0], j + offset[1], k + offset[2]];
      const encoded = encode(coord);
      if (active.has(encoded)) {
        count++;
      } else if (addToInactive) {
        inactive.add(encoded);
      }
    });
    return count;
  };

  const active = parseActive();
  function step() {
    const inactive = new Set<string>();
    const getActive = getActiveNeighborCount(active)(inactive); //?
    // const _changes = [] as [string, boolean][];
    const changes = new Map<string, boolean>();
    active.forEach((coord) => {
      const count = getActive(...decode(coord))(true);
      if (!helpers.between(count, 2, 3)) {
        console.log(coord, false);
        changes.set(coord, false);
      }
    });
    inactive.forEach((coord) => {
      const count = getActive(...decode(coord))(false);
      if (helpers.between(count, 3, 3)) {
        console.log(coord, true);
        changes.set(coord, true);
      }
    });

    changes.forEach((action, coord) => {
      if (action) {
        console.log(coord, "ADDED");
        active.add(coord);
      } else {
        console.log(coord, "DELETED");
        active.delete(coord);
      }
    });
  }

  for (let i = 0; i < 6; i++) {
    console.log(active.size);
    step();
    console.log(active.size);
  }

  // getCombinations(1) //?
  // getCombinations(3) //?
  // getCombinations(3) //?
}

function part2(input: string) {
  type Coord = [number, number, number, number];
  const encode = (x: Coord) => JSON.stringify(x) as string;
  const decode = (x: string) => JSON.parse(x) as Coord;
  function getOffsets() {
    const offsets = [] as Coord[];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            if (i == 0 && j == 0 && k == 0 && l == 0) continue;
            const coord: Coord = [i, j, k, l];
            offsets.push(coord);
          }
        }
      }
    }
    return offsets;
  }

  const parseActive = () => {
    const active = new Set<string>();
    input
      .split("\n")
      .forEach((x, i) => x.split("").forEach((y, j) => y === "#" && active.add(JSON.stringify([i, j, 0, 0]))));
    return active;
  };

  const offsets = getOffsets();

  const getActiveNeighborCount = (active: Set<string>) => (inactive: Set<string>) => (c: Coord) => (
    addToInactive = false
  ) => {
    let count = 0;
    offsets.forEach((offset) => {
      const coord: Coord = helpers.addArray(offset, c);
      const encoded = encode(coord);
      if (active.has(encoded)) {
        count++;
      } else if (addToInactive) {
        inactive.add(encoded);
      }
    });
    return count;
  };

  const active = parseActive();
  function step() {
    const inactive = new Set<string>();
    const getActive = getActiveNeighborCount(active)(inactive); //?
    // const _changes = [] as [string, boolean][];
    const changes = new Map<string, boolean>();
    active.forEach((coord) => {
      const count = getActive(decode(coord))(true);
      if (!helpers.between(count, 2, 3)) {
        console.log(coord, false);
        changes.set(coord, false);
      }
    });
    inactive.forEach((coord) => {
      const count = getActive(decode(coord))(false);
      if (helpers.between(count, 3, 3)) {
        console.log(coord, true);
        changes.set(coord, true);
      }
    });

    changes.forEach((action, coord) => {
      if (action) {
        console.log(coord, "ADDED");
        active.add(coord);
      } else {
        console.log(coord, "DELETED");
        active.delete(coord);
      }
    });
  }

  for (let i = 0; i < 6; i++) {
    console.log(active.size);
    step();
    console.log(active.size);
  }

  // getCombinations(1) //?
  // getCombinations(3) //?
  // getCombinations(3) //?
}

// part1( as string)
const input = helpers.readPuzzleInput({ day: 17 }) as string;
// part1(input); //?
part2(input); //?
