//@ts-nocheck
import { type } from "os";
import { readPuzzleInput, reducers } from "../helpers";

const input = readPuzzleInput({
  day: 11,
  seperator: "\n",
}) as string[];

enum Seat {
  OCCUPIED = "#",
  OPEN = "L",
  FLOOR = ".",
}

const game = [
  input.map((x) => x.split("")) as Seat[][],
  input.map((x) => x.split("")) as Seat[][],
] as [Seat[][], Seat[][]];

const I = game[0].length - 1;
const J = game[0][0].length - 1;

const clamp = (a, b) => (v) => (v < a ? a : v > b ? b : v);

const CI = clamp(0, I);
const CJ = clamp(0, J);

function getAdjacentSeats(i, j, k) {
  const bottom = game[0][CI(i + 1)][CJ(j + 0)];
  const top = game[0][CI(i - 1)][CJ(j + 0)];
  const left = game[0][CI(i + 0)][CJ(j - 1)];
  const right = game[0][CI(i + 0)][CJ(j + 1)];
  const topright = game[0][CI(i - 1)][CJ(j + 1)];
  const topleft = game[0][CI(i - 1)][CJ(j - 1)];
  const bottomright = game[0][CI(i + 1)][CJ(j + 1)];
  const bottomleft = game[0][CI(i + 1)][CJ(j - 1)];

  if (i == 0) {
    if (j == 0) {
      return [bottom, right, bottomright];
    } else if (j == J) {
      return [bottom, left, bottomleft];
    } else {
      return [bottom, right, bottomright, left, bottomleft];
    }
  } else if (i == I) {
    if (j == 0) {
      return [top, right, topright];
    } else if (j == J) {
      return [top, left, topleft];
    } else {
      return [top, right, topright, left, topleft];
    }
  } else {
    if (j == 0) {
      return [
        bottom,
        top,
        // left,
        right,
        topright,
        // topleft,
        bottomright,
        // bottomleft,
      ];
    } else if (j == J) {
      return [
        bottom,
        top,
        left,
        // right,
        // topright,
        topleft,
        // bottomright,
        bottomleft,
      ];
    } else {
      return [
        bottom,
        top,
        left,
        right,
        topright,
        topleft,
        bottomright,
        bottomleft,
      ];
    }
  }
}

function lookWhile(
  position: [number, number],
  direction: [number, number],
  condition: (res: Seat) => boolean
): Seat | boolean {
  const [i, j] = position;
  const [x, y] = direction;
  let [xo, yo] = [x, y];
  let iter = 0;

  function look() {
    xo = x + x * iter;
    yo = y + y * iter;
    if (i + yo < 0 || i + yo > I || j + xo < 0 || j + xo > J) {
      return false;
    } else {
      iter++;
      return game[0][i + yo][j + xo];
    }
  }

  let otherSeat = look();
  while (otherSeat && !condition(otherSeat)) {
    otherSeat = look();
  }
  return otherSeat;
}

let k = 0;

function step() {
  let changesMade = 0;
  for (let i = 0; i < game[0].length; i++) {
    for (let j = 0; j < game[0][i].length; j++) {
      switch (game[0][i][j]) {
        case "#":
          {
            if (
              getAdjacentSeats(i, j, k).filter((x) => x === "#").length >= 4
            ) {
              game[1][i][j] = "L";
              changesMade += 1;
            }
          }
          break;
        case "L":
          {
            if (
              getAdjacentSeats(i, j, k).filter((x) => x === "#").length == 0
            ) {
              game[1][i][j] = "#";
              changesMade += 1;
            }
          }
          break;
        case ".":
          break;
        default:
          break;
      }
    }
  }
  k = 1;
  return true;
}

const directions = [
  [-1, +0],
  [-1, -1],
  [+0, -1],
  [+1, -1],
  [+1, +0],
  [+1, +1],
  [+0, +1],
  [-1, +1],
];

const seatIsOccupied = (x) => x === Seat.OCCUPIED;
const seatIsOpen = (x) => x === Seat.OPEN;
const seatIsFloor = (x) => x === Seat.FLOOR;

function step2() {
  for (let i = 0; i < game[0].length; i++) {
    for (let j = 0; j < game[0][i].length; j++) {
      switch (game[0][i][j]) {
        case Seat.OCCUPIED:
          {
            if (
              directions
                .map((direction) =>
                  lookWhile(
                    [i, j],
                    direction,
                    (seat) => seatIsOccupied(seat) || seatIsOpen(seat)
                  )
                )
                .filter(seatIsOccupied).length >= 5
            ) {
              game[1][i][j] = "L";
            }
          }
          break;
        case Seat.OPEN:
          {
            if (
              directions
                .map((direction) =>
                  lookWhile(
                    [i, j],
                    direction,
                    (seat) => seatIsOccupied(seat) || seatIsOpen(seat)
                  )
                )
                .filter(seatIsOccupied).length == 0
            ) {
              game[1][i][j] = "#";
            }
          }
          break;
        case ".":
          break;
        default:
          break;
      }
    }
  }
  k = 1;
}

function wereChangesMade() {
  for (let i = 0; i < game[0].length; i++) {
    for (let j = 0; j < game[0][i].length; j++) {
      if (game[0][i][j] !== game[1][i][j]) {
        return true;
      }
    }
  }
  return false;
  //   let flat0 = game[0].flat(2);
  //   let flat1 = game[1].flat(2);
  //   return flat0.filter((x, i) => x !== flat1[i]).length > 0;
}

function copy() {
  for (let i = 0; i < game[0].length; i++) {
    for (let j = 0; j < game[0][i].length; j++) {
      game[0][i][j] = game[1][i][j];
    }
  }
}

function formatGame() {
  return game[0].map((x) => x.join("")).join("\n");
}

function print(z) {
  //   console.clear();
  console.log(`---------------------${z}---------------------\n`);
  console.log(formatGame());
}

function solve1() {
  let changes = true;

  let z = 0;
  while (changes) {
    console.log(getAdjacentSeats(0, 0, k).filter((x) => x === "#"));
    print(z);
    step();
    changes = wereChangesMade();
    copy();
    z++;
  }
  console.log(z);

  const occupied = game[0]
    .map((x) => x.filter((y) => y === "#").length)
    .reduce(reducers.sum);

  return occupied;
}

async function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

async function solve2(m?) {
  //   let i = 4;
  //   let j = 0;
  //   lookWhile([i, j], [0, -1], (res) => res === ".");
  let changes = true;

  let z = 0;
  while (changes && z < (typeof m === "undefined" ? Infinity : m)) {
    // console.log(getAdjacentSeats(0, 0, k).filter(seatIsOccupied);
    // await sleep(100);
    step2();
    changes = wereChangesMade();
    copy();
    print(z);
    z++;
  }
  //   console.log(z);

  const occupied = game[0]
    .map((x) => x.filter(seatIsOccupied).length)
    .reduce(reducers.sum);

  console.log(occupied);
  return occupied;
}

let i = 0;
let j = 6;
game[0][i][j];
step2();
copy();
directions
  .map((direction) =>
    lookWhile(
      [i, j],
      direction,
      (seat) => seatIsOccupied(seat) || seatIsOpen(seat)
    )
  )
  .filter(seatIsOccupied).length >= 5; //?

solve2().finally(() => {});
