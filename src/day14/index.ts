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

type Command = "mask" | "mem";

const parseCommand = (str: string): ["mask", string[]] | ["mem", [number, number]] => {
  const [lhs, rhs] = str.split(" = ");
  if (lhs.startsWith("mask")) {
    return ["mask", rhs.split("")];
  } else {
    return ["mem", [Number(lhs.replace(/(mem\[)|(\])/gim, "")), Number(rhs)]];
  }
};

function part1(input: string[]) {
  const memory = new Map<number, number[]>();
  const commandStream = input.map(parseCommand);

  let currentMask = commandStream[0][1] as string[];
  commandStream.forEach((command) => {
    switch (command[0]) {
      case "mask":
        {
          currentMask = command[1];
        }
        break;
      case "mem":
        {
          const bin = command[1][1].toString(2).padStart(36, "0").split("").map(Number); //?
          const masked = currentMask.map((x, i) => {
            if (x === "X") {
              return bin[i];
            } else {
              return Number(x);
            }
          });
          memory.set(command[1][0], masked);
        }
        break;
      default:
        break;
    }
  });
  let sum = 0;
  memory.forEach((val, addr) => {
    sum += parseInt(val.map(String).join(""), 2);
  });

  return sum;
}

const dec2binArray = (n: number) => (v: number): number[] => v.toString(2).padStart(n, "0").split("").map(Number);

function part2(input: string[]) {
  const memory = new Map<string, number>();
  const commandStream = input.map(parseCommand);

  let currentMask = commandStream[0][1] as string[];
  commandStream.forEach((command) => {
    switch (command[0]) {
      case "mask":
        {
          currentMask = command[1];
        }
        break;
      case "mem":
        {
          const binaddr = dec2binArray(36)(command[1][0]);
          const floating = currentMask.map((x, i) => {
            if (x === "0") {
              return String(binaddr[i]);
            } else {
              return x;
            }
          });

          const indices = floating.map((x, i) => (x === "X" ? i : false)).filter((x) => x) as number[];
          const count = indices.length;
          // for each combination
          for (let i = 0; i < 2 ** count; i++) {
            // get binary rep
            let comb = i.toString(2).padStart(count, "0");
            let a = [...floating];
            for (let j = 0; j < indices.length; j++) {
              a[indices[j]] = comb[j];
            }
            memory.set(a.join(""), command[1][1]); //?
          }
        }
        break;
      default:
        break;
    }
  });
  let sum = 0;
  memory.forEach((val, addr) => {
    sum += val;
  });

  return sum;
}

// part1(input); //?

const part2ex = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;

// part2(input); //?
part2(part2ex.split("\n")); //?
