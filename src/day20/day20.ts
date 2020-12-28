import { Grid } from "../Grid";
import * as helpers from "../helpers";

type TBLR = {
  top: string;
  bottom: string;
  left: string;
  right: string;
};

interface Tile {
  id: number;
  original: TBLR;
  modified: TBLR;
}

type Neighbors = {
  top: Tile | true;
  bottom: Tile | true;
  left: Tile | true;
  right: Tile | true;
};

type Side = keyof Neighbors;

type Opposite = {
  top: Side;
  bottom: Side;
  left: Side;
  right: Side;
};

const opposite: Opposite = {
  top: "bottom",
  left: "right",
  right: "left",
  bottom: "top",
};

const SIDES = ["top", "bottom", "left", "right"] as ["top", "bottom", "left", "right"];

const transpose = <T>(array: T[][]) => array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
const flipHor = <T>(array: T[][]) => array.map((x) => x.reverse());
const flipVer = <T>(array: T[][]) => array.map((x) => [...x]).reverse();
const rotate = <T>(array: T[][]) => flipVer(transpose(array));
const derotate = <T>(array: T[][]) => transpose(flipVer(array));

let testarr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

flipVer(transpose(testarr));

class Tile implements Tile {
  inputString: string;
  neighbors: Neighbors;
  potentialNeighbors: {
    top: Set<Tile>;
    bottom: Set<Tile>;
    right: Set<Tile>;
    left: Set<Tile>;
  };
  oriented = false;
  grid: string[][];
  constructor({ id, original, inputString, grid }) {
    this.id = id;
    this.original = original;
    this.modified = { ...original };
    this.inputString = inputString;
    this.inputString;
    this.neighbors = {} as Neighbors;
    this.potentialNeighbors = {
      top: new Set<Tile>(),
      bottom: new Set<Tile>(),
      left: new Set<Tile>(),
      right: new Set<Tile>(),
    };
    this.grid = grid;
  }

  get isFree() {
    return this.openSides.length == SIDES.length;
  }

  get openSides() {
    return SIDES.filter((side) => !this.neighbors.hasOwnProperty(side));
  }

  hasPotential(side: Side) {
    return this.potentialNeighbors[side].size != 0;
  }

  get potentialMap() {
    return SIDES.map((side) => Number(this.hasPotential(side)));
  }

  rotate() {
    const bottom = this.modified.left;
    const top = this.modified.right;
    const left = this.modified.top.split("").reverse().join("");
    const right = this.modified.bottom.split("").reverse().join("");
    this.modified = {
      bottom,
      top,
      left,
      right,
    };

    const pbottom = this.potentialNeighbors.left;
    const ptop = this.potentialNeighbors.right;
    const pleft = this.potentialNeighbors.top;
    const pright = this.potentialNeighbors.bottom;

    this.potentialNeighbors.left = pleft;
    this.potentialNeighbors.right = pright;
    this.potentialNeighbors.top = ptop;
    this.potentialNeighbors.bottom = pbottom;

    this.grid = flipVer(transpose(this.grid));

    return this;
  }

  flipHor() {
    const bottom = this.modified.bottom.split("").reverse().join("");
    const top = this.modified.top.split("").reverse().join("");
    const left = this.modified.right;
    const right = this.modified.left;
    this.modified = {
      bottom,
      top,
      left,
      right,
    };

    const pleft = this.potentialNeighbors.right;
    const pright = this.potentialNeighbors.left;

    this.potentialNeighbors.left = pleft;
    this.potentialNeighbors.right = pright;

    this.grid = flipHor(this.grid);

    return this;
  }

  flipVer() {
    const bottom = this.modified.top;
    const top = this.modified.bottom;
    const left = this.modified.left.split("").reverse().join("");
    const right = this.modified.right.split("").reverse().join("");
    this.modified = {
      bottom,
      top,
      left,
      right,
    };

    const pbottom = this.potentialNeighbors.top;
    const ptop = this.potentialNeighbors.bottom;

    this.potentialNeighbors.top = ptop;
    this.potentialNeighbors.bottom = pbottom;
    this.grid = flipVer(this.grid);
    return this;
  }

  reset() {
    this.modified = { ...this.original };
  }

  get inset() {
    return this.grid.slice(1, -1).map((x) => x.slice(1, -1));
    // return this.grid.slice(1, -1).map((x) => x.slice(1, -1));
  }

  get lines() {
    return this.inset.map((x) => x.join(""));
    // return this.grid.map((x) => x.join(""));
  }

  getNeighbor(side: Side) {
    if (this.hasPotential(side)) {
      return [...this.potentialNeighbors[side].values()][0];
    }
  }
}

function parse(str: string) {
  const chunks = str.split("\n\n");
  return chunks.map((chunk) => {
    const [idchunk, ...rest] = chunk.split("\n");
    const id = Number(idchunk.split(/[\s:]/g).filter((x) => x.match(/\d+/g))[0]);
    const lines = rest.filter((x) => x.length > 0);
    const [top, bottom] = [lines[0], lines[lines.length - 1]];
    let inverted = lines.map((x) => [x[0], x[x.length - 1]]);
    let [leftarr, rightarr] = [[] as string[], [] as string[]];
    inverted.forEach((x) => {
      leftarr.push(x[0]);
      rightarr.push(x[1]);
    });
    const left = leftarr.join("");
    const right = rightarr.join("");
    const sides = {
      top,
      bottom,
      left,
      right,
    };
    return new Tile({
      id,
      original: sides,
      inputString: chunk,
      grid: lines.map((x) => x.split("")),
    });
  });
}

function part1(input: string) {
  const tiles = parse(input);
  const tileMap = new Map<number, Tile>();
  tiles.forEach((tile) => {
    tileMap.set(tile.id, tile);
  });

  function findMatches(tile: Tile, side: Side) {
    const matches = [] as Tile[];
    for (const [id, testTile] of tileMap) {
      if (testTile.isFree && tile.id != id) {
        let isMatch = false;
        Object.keys(opposite).forEach((s: Side) => {
          if (
            tile.modified[side] === testTile.modified[s] ||
            tile.modified[side] === testTile.modified[s].split("").reverse().join("")
          ) {
            isMatch = true;
          }
        });
        if (isMatch) {
          matches.push(testTile);
        }
      }
    }
    return matches;
  }

  tiles.forEach((tile) => {
    SIDES.map((side) => {
      const matches = findMatches(tile, side);
      matches.forEach((match) => {
        tile.potentialNeighbors[side].add(match);
      });
    });
  });

  const contraints = tiles.map((tile) => SIDES.map((side) => tile.potentialNeighbors[side].size));
  let prod = 1;
  tiles.forEach((tile) => {
    const sidemap = SIDES.map((side) => tile.potentialNeighbors[side].size);
    if (sidemap.reduce(helpers.add) == 2) {
      prod *= tile.id;
    }
  });

  // console.log("part1: ", prod);

  function firstInSet(set: Set<Tile>) {
    if (set.size == 1) {
      return [...set.values()][0];
    }
    return null;
  }

  const sortofEquals = (str1, str2) => str1 === str2 || str1 === str2.split("").reverse().join("");

  Math.sqrt(tiles.length);

  const corners = tiles.filter((tile) => tile.potentialMap.reduce(helpers.add) == 2);

  corners.map((x) => x.potentialMap);
  corners.map((x) => x.id);

  const visited = new Set<number>();

  function orient(tile: Tile, s: Side, map, i = 0) {
    const other = firstInSet(tile.potentialNeighbors[s]);
    if (other && !other.oriented) {
      while (!sortofEquals(tile.modified[s], other.modified[opposite[s]])) {
        other.rotate();
      }
      if (tile.modified[s] !== other.modified[opposite[s]]) {
        switch (s) {
          case "bottom":
          case "top":
            other.flipHor();
            break;
          case "left":
          case "right":
            other.flipVer();
            break;
          default:
            break;
        }
      }
      other.oriented = true;
      orient(other, s, map, i + 1);
    } else {
      if (i == tiles.length - 1) {
        return;
      } else {
        orient(tile, map[s], map, i);
      }
    }
  }

  const dirmap = {
    "0101": "bottom",
    "1001": "right",
    "1010": "top",
    "0110": "left",
  };
  const clockwisemap = {
    right: "top",
    top: "left",
    left: "bottom",
    bottom: "right",
  };
  corners[0].oriented = true;
  orient(corners[0], dirmap[corners[0].potentialMap.join("")], clockwisemap);

  const topLeft = tiles.filter((tile) => tile.potentialMap.join("") === "0101")[0];
  const topRight = tiles.filter((tile) => tile.potentialMap.join("") === "0110")[0];
  const bottomLeft = tiles.filter((tile) => tile.potentialMap.join("") === "1001")[0];
  const bottomRight = tiles.filter((tile) => tile.potentialMap.join("") === "1010")[0];

  const xlen = 96;

  function joinRight(tile: Tile, lines = [] as string[]) {
    const newLines = [] as string[];

    tile.lines.forEach((line, i) => {
      if (lines[i]) {
        newLines[i] = lines[i] + line;
      } else {
        newLines[i] = line;
      }
    });
    if (!tile.getNeighbor("right")) {
      return newLines;
    } else {
      if (newLines[0].length == xlen) {
        return newLines;
      } else {
        return joinRight(tile.getNeighbor("right"), newLines);
      }
    }
  }

  function joinRight2(tile: Tile, ids = [] as number[]) {
    const newIds = ids.concat(tile.id);
    if (!tile.getNeighbor("right")) {
      return newIds;
    } else {
      if (newIds.length == 12) {
        return newIds;
      } else {
        return joinRight2(tile.getNeighbor("right"), newIds);
      }
    }
  }

  function joinBottom(tile, lines = [] as string[]) {
    const newLines = lines.concat(joinRight(tile));
    if (!tile.getNeighbor("bottom")) {
      return newLines;
    }
    return joinBottom(tile.getNeighbor("bottom"), newLines);
  }
  function joinBottom2(tile, ids = [] as number[][]) {
    ids.push(joinRight2(tile));
    if (!tile.getNeighbor("bottom")) {
      return ids;
    }
    return joinBottom2(tile.getNeighbor("bottom"), ids);
  }

  const completeMaps = [] as string[][];

  let completeMap = joinBottom(topLeft).map((x) => x.split("")) as string[][];
  for (let i = 0; i < 4; i++) {
    completeMap = flipVer(completeMap);
    completeMaps.push(completeMap.map((x) => x.join("")));

    completeMap = transpose(completeMap);
    completeMaps.push(completeMap.map((x) => x.join("")));
  }
  completeMaps.map(findSeaMonsters).filter((x) => x)[0]; //?
}

function findSeaMonsters(map: string[]) {
  const monster = ["..................#.", "#....##....##....###", ".#..#..#..#..#..#..."];
  // const offsets =
  const offsets = monster
    .map((x, i) => {
      return x
        .split("")
        .map((y, j) => (y === "#" ? j : false))
        .filter((y) => y)
        .map((y) => [i, y] as [number, number]);
    })
    .flat(); //?
  // const monsterr = ["....................#...", "..#....##....##....###..", "...#..#..#..#..#..#....."];

  const grid = new Grid(
    map.map((x) => x.split("")),
    Grid.BoundaryConditions.none
  );

  const [Y, X] = grid.shape; //?
  let count = 0;
  for (let yo = 0; yo < Y; yo++) {
    for (let xo = 0; xo < X; xo++) {
      if (
        offsets.filter(([y, x]) => {
          try {
            return grid.get(yo + y, xo + x) === "#";
          } catch (err) {
            return false;
          }
        }).length == offsets.length
      ) {
        count += 15;
        offsets.forEach(([y, x]) => grid.set(yo + y, xo + x, "X"));
      }
    }
  }
  return count && grid.data.flat().filter((x) => x === "#").length; //?
}

function part2(input: string) {}

const puzzleInput = helpers.readPuzzleInput({ day: 20 }) as string;

part1(puzzleInput);
