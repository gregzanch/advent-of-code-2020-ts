import * as r from "ramda";
import { countIf } from "./helpers";
import ndarray from "ndarray";
const input = `
.....##.#.....#........#....##.
....#...#...#.#.......#........
.....##.#......#.......#.......
...##.........#...#............
........#...#.......#.........#
`.trim();

enum Seat {
  OCCUPIED = "#",
  OPEN = "L",
  FLOOR = ".",
}

function getGridSize(str: string) {
  const x = str.indexOf("\n");
  const y = (str.length - countIf((x) => x === "\n")(str)) / x;
  return [x, y]; //?
}

const board = r.pipe(
  // maps.splitBy('\n'),
  r.split("\n"),
  r.map(r.split(""))
)(input) as Seat[][];

const game = [board, r.clone(board)];

getGridSize(input); //?

const g = ndarray(input.split(""));

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
