//@ts-nocheck
import { readPuzzleInput, derivative } from "../helpers";

const input = readPuzzleInput({
  day: 10,
  seperator: "\n",
}) as string[];

const joltages = input.map((x) => Number(x));

const numbers = joltages.sort((a, b) => a - b);

const differenceArray = [numbers[0], ...derivative(numbers), 3];

const part1 = differenceArray.filter((x) => x == 1).length * differenceArray.filter((x) => x == 3).length; //?

function solve(arr: number[], n = 3) {
  // const temp = new Map<number, number[]>();
  const temp = {} as { [key: number]: number[] };
  for (let i = 0; i < arr.length; i++) {
    let offset = 1;
    let subarray = [] as number[];
    while (arr[i + offset] - arr[i] <= n) {
      subarray.push(arr[i + offset]);
      offset++;
    }
    temp[arr[i]] = subarray;
  }
  return temp;
}

function sum(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i];
  }
  return s;
}

numbers; //?

let map = solve([0, ...numbers, numbers[numbers.length - 1] + 3], 3); //?
const cache = {} as { [key: number]: number };
function recurse(node: number) {
  node; //?
  if (map[node].length == 0) {
    return 1;
  }
  if (cache[node]) {
    return cache[node];
  }

  let combinations = sum(map[node].map(recurse));
  cache[node] = combinations; //?
  return combinations;

  //for each thing sum the combintions and return
}

recurse(0); //?
