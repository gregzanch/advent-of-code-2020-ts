//@ts-nocheck
import { diff } from "../helpers";
const input = require("fs").readFileSync("res/5/input", "utf8") as string;
const codes = input.split("\n");
const ROWS = Array(128)
  .fill(0)
  .map((x, i) => i);
const COLS = Array(8)
  .fill(0)
  .map((x, i) => i);

const upperHalf = (arr: number[]) => arr.slice(-arr.length / 2);

const lowerHalf = (arr: number[]) => arr.slice(0, arr.length / 2);

function decodeID(code: string) {
  const ops = code.split("");
  let rows = Array.from(ROWS);
  let cols = Array.from(COLS);
  let row;
  let col;
  ops.forEach((op, i) => {
    switch (op) {
      case "F":
        rows = lowerHalf(rows);
        break;
      case "L":
        cols = lowerHalf(cols);
        break;
      case "B":
        rows = upperHalf(rows);
        break;
      case "R":
        cols = upperHalf(cols);
        break;
      default:
        break;
    }
  });
  return rows[0] * 8 + cols[0];
}

const max = (a, b) => (a > b ? a : b);

const seats = ROWS.map((row) => COLS.map((col) => row * 8 + col))
  .flat()
  .flat();
const ids = codes.map(decodeID);

const part1 = ids.reduce(max);

const difference = diff(seats, ids).sort(); //?

difference.length; //?
