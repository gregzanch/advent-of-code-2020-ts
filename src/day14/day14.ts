import { comma, readPuzzleInput } from "../helpers";

const input = readPuzzleInput({ day: 14, seperator: "\n" }) as string[];

type Command = "mask" | "mem";

type Instruction<T extends Command> =
  | {
      cmd: "mask";
      value: string[];
      original: string;
    }
  | {
      cmd: "mem";
      value: [number, number];
      original: string;
    };

const parseInstruction = (str: string): Instruction<Command> => {
  const [lhs, rhs] = str.split(" = ");
  if (lhs.startsWith("mask")) {
    return {
      cmd: "mask",
      value: rhs.split(""),
      original: str,
    };
  } else {
    return {
      cmd: "mem",
      value: [Number(lhs.replace(/(mem\[)|(\])/gim, "")), Number(rhs)],
      original: str,
    };
  }
};

function part1(input: string[]) {
  const memory = new Map<number, number[]>();
  const commandStream = input.map(parseInstruction);

  let currentMask = commandStream[0].value as string[];

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

function* iterateOverString(str: string) {
  for (let i = 0; i < str.length; i++) {
    yield str[i] as string;
  }
  return str;
}

function part2(input: string[]) {
  const memory = new Map<string[], number>();
  const memoryDecimal = new Map<number, number>();
  const memoryString = new Map<string, number>();
  const commandStream = input.map(parseInstruction);

  const maskAddress = (originalBinaryAddress: string[] | number[]) => (bit: string, index: number) => {
    // If the bitmask bit is 0, the corresponding memory address bit is unchanged.
    if (bit === "0") {
      return String(originalBinaryAddress[index]);
    }
    // If the bitmask bit is 1, the corresponding memory address bit is overwritten with 1.
    if (bit === "1") {
      return "1";
    }
    // If the bitmask bit is X, the corresponding memory address bit is floating
    if (bit === "X") {
      return "X";
    }
    return;
  };

  const setFloatingBits = (maskedAddress: string[]) => (combination: string) => {
    const combinationBitIterator = iterateOverString(combination);
    return maskedAddress.map((bit) => {
      if (bit === "X") {
        const { value, done } = combinationBitIterator.next();
        if (!done) {
          return value;
        }
      }
      return bit;
    });
  };

  const getFloatingBitCount = (binaryAddress: string[]) => {
    return binaryAddress.filter((x) => x === "X").length;
  };

  const sumMap = <T>(map: Map<T, number>) => {
    let sum = 0;
    map.forEach((val) => {
      sum += val;
    });
    return sum;
  };

  let currentMask = commandStream[0].value as string[];
  commandStream.forEach((command) => {
    console.log(command.original);
    switch (command.cmd) {
      case "mask":
        {
          currentMask = command.value;
        }
        break;
      case "mem":
        {
          const orginalAddress = command.value[0];
          const originalBinaryAddress = dec2binArray(36)(orginalAddress);
          const maskedAddress = currentMask.map(maskAddress(originalBinaryAddress));
          const count = getFloatingBitCount(maskedAddress);
          const getNewBinaryAddress = setFloatingBits(maskedAddress);
          // for each combination of floating bits
          for (let i = 0; i < 2 ** count; i++) {
            // get binary rep
            let comb = i.toString(2).padStart(count, "0");
            const newBinaryAddress = getNewBinaryAddress(comb);

            memory.set(newBinaryAddress, command.value[1]);
            memoryString.set(newBinaryAddress.join(""), command.value[1]);
            memoryDecimal.set(parseInt(newBinaryAddress.join(""), 2), command.value[1]);
          }
        }
        break;
      default:
        break;
    }
  });
  const sums = [];

  return {
    memory: sumMap(memory),
    memoryDecimal: sumMap(memoryDecimal),
    memoryString: sumMap(memoryString),
  };
}

// part1(input); //?

const part2ex = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;

console.log(part2(input)); //?
// part2(part2ex.split("\n")); //?
