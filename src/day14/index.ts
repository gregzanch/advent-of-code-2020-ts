import { assert } from "console";
import {
  readPuzzleInput,
  int,
  isInteger,
  comma,
  truthy,
  toIndexed,
  digits,
  toNumbers,
  getIndex,
  ascending,
  via,
  applyAt,
  match,
  swap,
  subtract,
  multiply,
  add,
} from "../helpers";

const input = readPuzzleInput({ day: 14, seperator: "\n" }) as string[];

type Bus = [number, number];

const closest = (time: number) => (bus: Bus) => {
  let t = 0;
  while (!isInteger((time + t) / bus[1])) t++;
  return [t, bus];
};

const getBusses = (input: string[]) => {
  return input[1] //?
    .split(comma)
    .map(toIndexed)
    .filter(applyAt(1)(match(digits)))
    .map(toNumbers) as Bus[];
};

function modInverse(a: number, m: number) {
  let [m0, x, y, quotient, temp] = [m, 1, 0, 0, 0];
  if (m == 1) return 0;
  while (a > 1) {
    quotient = int(a / m);
    temp = m;
    m = a % m;
    a = temp;
    temp = y;
    y = x - quotient * y;
    x = temp;
  }
  if (x < 0) x = x + m0;
  return x;
}

function chineseRemainderTheorem(numbers: number[], remainders: number[]) {
  assert(numbers.length == remainders.length, "input arrays should be same length");
  const prod = numbers.reduce(multiply); //?
  return (
    numbers
      .map((num, index) => {
        const frac = int(prod / num);
        return remainders[index] * modInverse(frac, num) * frac;
      })
      .reduce(add) % prod
  );
}

function part1(input: string[]) {
  const time = Number(input[0]);
  const busses = getBusses(input);
  const [waitTime, bus] = busses.map(closest(time)).sort(via(0)(ascending))[0] as [number, Bus];
  return waitTime * bus[1];
}

function part2(input: string[]) {
  const busses = getBusses(input); //?
  const rem = [0, ...busses.map((x) => -x.reduce(subtract)).slice(1)];
  const num = busses.map(getIndex(1));
  chineseRemainderTheorem(num, rem); //?
}

// part2(input);
