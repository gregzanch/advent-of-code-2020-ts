//@ts-ignore
import {
  readPuzzleInput,
  at,
  between,
  diff,
  filters,
  makeObject,
  maps,
  reducers,
  regularExpressions,
  unique,
  GraphNode,
} from "../helpers";
const input = readPuzzleInput({
  day: 8,
  seperator: "\n",
}) as string[];

type Op = "acc" | "jmp" | "nop";

interface Instruction {
  visits: number;
  checkedChange: boolean;
  id: number;
  op: Op;
  val: number;
}

type Program = {
  [key: string]: Instruction;
};

type Opposite = {
  ["jmp"]: "nop";
  ["nop"]: "jmp";
};

const opposite: Opposite = {
  ["jmp"]: "nop",
  ["nop"]: "jmp",
};

const program = input.map((x, index) => {
  return {
    visits: 0,
    checkedChange: false,
    id: index,
    op: x.slice(0, 3),
    val: Number(x.split(" ").slice(-1)[0]),
  } as Instruction;
});
//   .reduce((a, b) => Object.assign(a, { [nanoid()]: b }), {}) as Program;

let history = [] as Instruction[];
let reg = 0;
let i = 0;

function reset() {
  program.forEach((x, i, a) => {
    a[i].visits = 0;
  });
  reg = 0;
  i = 0;
  history = [] as Instruction[];
}

const isgood = () => {
  if (i == program.length) {
    console.log(i);
    console.log(`answer should be ${reg}`);
    return false;
  }
  return program[i].visits == 0;
};

function success() {
  console.log(reg);
}

function run() {
  reset();
  while (isgood()) {
    if (i == program.length) {
      return {
        success: true,
        reg: reg,
      };
    }
    switch (program[i].op) {
      case "acc":
        {
          reg += program[i].val;
          program[i].visits++;
          history.push(program[i]);
          i++;
        }
        break;
      case "jmp":
        {
          const val = program[i].val;
          program[i].visits++;
          history.push(program[i]);
          i += val;
        }
        break;
      case "nop":
        {
          program[i].visits++;
          history.push(program[i]);
          i++;
        }
        break;
      default:
        i++; //?
        break;
    }
  }
  history.pop();
  return {
    success: false,
    reg: reg,
  };
}

let ans = run();
let changedId = -1;
while (!ans.success) {
  if (changedId > 0) {
    //@ts-ignore
    program[changedId].op = opposite[program[changedId].op];
  }
  while (
    history.length &&
    (history[history.length - 1].op === "acc" ||
      history[history.length - 1].checkedChange)
  ) {
    history.pop();
  }
  if (history.length) {
    changedId = history[history.length - 1].id; //?
    if (program[changedId].op === "jmp" || program[changedId].op === "nop") {
      //@ts-ignore
      program[changedId].op = opposite[program[changedId].op];
      program[changedId].checkedChange = true;

      console.log(program[changedId]);
    }
    ans = run();
  } else {
    break;
  }
}

console.log(ans); //?
