//@ts-nocheck
import { diff, readPuzzleInput, max } from "../helpers";
const { abs } = Math;

const ROWS = Array(128)
  .fill(0)
  .map((x, i) => i);
const COLS = Array(8)
  .fill(0)
  .map((x, i) => i);

const delta = (a: number, b: number) => b - a;
const interpolateLinear = (amt: number) => (x: number, y: number) => x + delta(x, y) * amt;
const halfStep = interpolateLinear(0.5);
const upperHalfRange = (range: [number, number]) => [halfStep(...range), range[1]];
const lowerHalfRange = (range: [number, number]) => [range[0], halfStep(...range)];

function decodeID(code: string) {
  const ops = code.split("");
  let rowsRange = [0, 128];
  let colsRange = [0, 8];
  ops.forEach((op, i) => {
    switch (op) {
      case "F":
        rowsRange = lowerHalfRange(rowsRange);
        break;
      case "L":
        colsRange = lowerHalfRange(colsRange);
        break;
      case "B":
        rowsRange = upperHalfRange(rowsRange);
        break;
      case "R":
        colsRange = upperHalfRange(colsRange);
        break;
      default:
        break;
    }
  });
  return rowsRange[0] * 8 + colsRange[0];
}

const input = readPuzzleInput({ day: 5 });
const codes = input.split("\n");
const ids = codes.map(decodeID);

const part1 = ids.reduce(max);

const seats = ROWS.map((row) => COLS.map((col) => row * 8 + col))
  .flat()
  .flat();
ids; //?
const difference = diff(seats, ids).sort(); //?
diff([1, 2, 3], [2, 3, 4]); //?
