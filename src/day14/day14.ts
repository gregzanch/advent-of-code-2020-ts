import { sum } from "ramda";
import { readPuzzleInput } from "../helpers";

// read the input file
const input = readPuzzleInput({ day: 14, seperator: "\n" }) as string[];

// declare
type Command = "mask" | "mem";

type BinaryBit = "0" | "1";
type FloatingBit = "X";
type MaskBit = BinaryBit | FloatingBit;

type MaskedBinaryRep = Array<MaskBit>;
type BinaryRep = Array<BinaryBit>;

type SetMaskInstruction = {
  cmd: "mask";
  value: MaskedBinaryRep;
  original: string;
};

type WriteMemoryInstruction = {
  cmd: "mem";
  address: number;
  value: number;
  original: string;
};

type Instruction = SetMaskInstruction | WriteMemoryInstruction;

const convertNumberToBinaryRep = (bitLength: number) => {
  return (value: number): BinaryRep => {
    return value.toString(2).padStart(bitLength, "0").split("") as BinaryRep;
  };
};

const convertBinaryRepToNumber = (binaryRep: BinaryRep) => {
  return parseInt(binaryRep.join(""), 2);
};

const sumMap = <T>(map: Map<T, number>) => {
  let sum = 0;
  map.forEach((val) => {
    sum += val;
  });
  return sum;
};

const parseInstruction = (str: string): Instruction => {
  const [lhs, rhs] = str.split(" = ");
  if (lhs.startsWith("mask")) {
    return {
      cmd: "mask",
      value: rhs.split(""),
      original: str,
    } as SetMaskInstruction;
  } else {
    return {
      cmd: "mem",
      address: Number(lhs.replace(/(mem\[)|(\])/gim, "")),
      value: Number(rhs),
      original: str,
    } as WriteMemoryInstruction;
  }
};

type MaskRuleset<T extends MaskBit | BinaryBit> = {
  [bit in MaskBit]: (targetBit: BinaryBit) => T;
};

const composeMaskFromRuleset = <T extends MaskBit | BinaryBit>(ruleset: MaskRuleset<T>) => {
  return (mask: MaskedBinaryRep) => {
    return (target: BinaryRep) => {
      return mask.map((maskBit: MaskBit, index: number) => {
        return ruleset[maskBit](target[index]);
      });
    };
  };
};

function part1(input: string[]) {
  const memory = new Map<number, number>();
  const commandStream = input.map(parseInstruction);
  const composeMask = composeMaskFromRuleset({
    0: (targetBit) => "0",
    1: (targetBit) => "1",
    X: (targetBit) => targetBit,
  });
  let currentMask: MaskedBinaryRep = (commandStream[0] as SetMaskInstruction).value;
  let applyMask = composeMask(currentMask);

  commandStream.forEach((command) => {
    switch (command.cmd) {
      case "mask":
        currentMask = command.value;
        applyMask = composeMask(currentMask);
        break;
      case "mem":
        const { address, value } = command;
        const valueAsBinaryRep = convertNumberToBinaryRep(36)(value);
        const maskedValue = applyMask(valueAsBinaryRep);
        const maskedValueAsNumber = convertBinaryRepToNumber(maskedValue);
        memory.set(address, maskedValueAsNumber);
        break;
      default:
        break;
    }
  });

  return sumMap(memory);
}

function* iterateOverString(binaryRep: BinaryRep) {
  for (let i = 0; i < binaryRep.length; i++) {
    yield binaryRep[i] as BinaryBit;
  }
  return binaryRep[0] as BinaryBit;
}

function part2(input: string[]) {
  const memory = new Map<string, number>();
  const memory2 = new Map<number, number>();
  const commandStream = input.map(parseInstruction);
  const composeMask = composeMaskFromRuleset({
    0: (targetBit) => targetBit,
    1: (targetBit) => "1",
    X: (targetBit) => "X",
  });

  const setFloatingBits = (maskedAddress: MaskedBinaryRep) => (combination: BinaryRep): BinaryRep => {
    const combinationBitIterator = iterateOverString(combination);
    const binary: BinaryRep = [];
    for (let i = 0; i < maskedAddress.length; i++) {
      if (maskedAddress[i] === "X") {
        binary.push(combinationBitIterator.next().value);
      } else if (maskedAddress[i] === "1") {
        binary.push("1");
      } else {
        binary.push("0");
      }
    }
    return binary;
  };

  const getFloatingBitCount = (binaryAddress: MaskedBinaryRep) => {
    return binaryAddress.filter((x) => x === "X").length;
  };

  let currentMask: MaskedBinaryRep;
  let applyMask: (target: BinaryRep) => MaskBit[];

  commandStream.forEach((command) => {
    switch (command.cmd) {
      case "mask":
        currentMask = command.value;
        applyMask = composeMask(currentMask);
        break;
      case "mem":
        const { address, value } = command;
        const originalBinaryAddress = convertNumberToBinaryRep(36)(address);
        const maskedAddress = applyMask(originalBinaryAddress);
        const count = getFloatingBitCount(maskedAddress);
        const getNewBinaryAddress = setFloatingBits(maskedAddress);

        for (let i = 0; i < 2 ** count; i++) {
          const brep = convertNumberToBinaryRep(count)(i);
          const newBinaryAddress = getNewBinaryAddress(brep);
          memory.set(newBinaryAddress.join(""), value);
          memory2.set(convertBinaryRepToNumber(newBinaryAddress), value);
        }
        break;
      default:
        break;
    }
  });

  return sumMap(memory);
}

console.log(part2(input));
