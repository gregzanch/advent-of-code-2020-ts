//@ts-nocheck
import { Dir, fstat } from "fs";
import { type } from "os";
import * as r from "ramda";
import { readPuzzleInput, reducers } from "../helpers";
import fs from "fs";
const { map, split, splitAt, pipe, compose, juxt } = r;
const input = readPuzzleInput({
  day: 12,
  seperator: "\n",
}) as string[];
// const input = `
// F10
// N3
// F7
// R90
// F11
// `
//   .trim()
//   .split("\n");

const { sin, cos, PI: pi, sign, sqrt, atan, round } = Math;

/* 


Action N means to move north by the given value.
Action S means to move south by the given value.
Action E means to move east by the given value.
Action W means to move west by the given value.
Action L means to turn left the given number of degrees.
Action R means to turn right the given number of degrees.
Action F means to move forward by the given value in the direction the ship is currently facing.

*/

const vec2 = (x: number, y: number) => ({ x, y });
const magnitude = (x: number, y: number) => sqrt(x ** 2 + y ** 2);

enum Turn {
  L = "L",
  R = "R",
}

enum Move {
  F = "F",
}

type Direction = "E" | "N" | "W" | "S";

const instructions = input.map((x) => {
  const instr = x[0] as Direction | "F" | "L" | "R";
  const amount = Number(x.slice(1));
  return {
    instr,
    amount,
  };
});

class Entity {
  constructor(x: number, y: number, a: number, name: string = "") {
    this.name = name;
    this.startx = x;
    this.starty = y;
    this.starta = a;

    this.x = x;
    this.y = y;
    this.a = a;

    this.angleMap = ["E", "N", "W", "S"] as Direction[];
  }
  print() {
    console.log(`${this.name} is at ${this.format()}`);
  }
  format() {
    return `${this.x},${this.y}`;
  }
  rotate(turn: Turn, angle: number) {
    if (turn === Turn.L) {
      this.a += angle;
      this.a = this.a % 360;
    } else {
      this.a -= angle;
      this.a = this.a % 360;
    }
  }

  rotateAbout(x: number, y: number, turn: Turn, angle: number) {
    const l = vec2(this.x - x, this.y - y);
    if (angle == 180) {
      this.x += -2 * l.x;
      this.y += -2 * l.y;
      return;
    }
    const ai = turn === Turn.R ? -angle : angle;
    // const ai = angle;

    const al = (atan(l.y / l.x) * 180) / pi;
    const da = al + sign(l.x) * ai;
    const m = magnitude(l.x, l.y);
    const darad = (da * pi) / 180;

    const t = vec2(m * cos(darad), m * sin(darad));
    this.x = round(t.x + x);
    this.y = round(t.y + y);
  }

  translate(x: number, y: number) {
    this.x += x;
    this.y += y;
    return vec2(this.x, this.y);
  }

  move(dir: Direction, amount: number) {
    switch (dir) {
      case "N":
        {
          this.y += amount;
        }
        break;
      case "E":
        {
          this.x += amount;
        }
        break;
      case "S":
        {
          this.y -= amount;
        }
        break;
      case "W":
        {
          this.x -= amount;
        }
        break;
      default:
        break;
    }
  }

  moveRelative(_dir: Direction, amount: number) {
    let a = this.a + ["N", "W", "S", "E"].indexOf(_dir) * 90;
    let index = Math.round((a % 360) / 90);
    if (index < 0) {
      index = this.angleMap.length + index;
    }
    const dir = this.angleMap[index];
    switch (dir) {
      case "N":
        {
          this.y += amount;
        }
        break;
      case "E":
        {
          this.x += amount;
        }
        break;
      case "S":
        {
          this.y -= amount;
        }
        break;
      case "W":
        {
          this.x -= amount;
        }
        break;
      default:
        break;
    }
  }

  forward(amount: number) {
    let index = Math.round((this.a % 360) / 90);
    if (index < 0) {
      index = this.angleMap.length + index;
    }
    const dir = this.angleMap[index];

    switch (dir) {
      case "N":
        {
          this.y += amount;
        }
        break;
      case "E":
        {
          this.x += amount;
        }
        break;
      case "S":
        {
          this.y -= amount;
        }
        break;
      case "W":
        {
          this.x -= amount;
        }
        break;
      default:
        break;
    }
  }
  get position() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

function part1() {
  const s = new Entity(0, 0, 0);

  instructions.forEach((instr) => {
    switch (instr.instr) {
      case "N":
      case "E":
      case "S":
      case "W":
        {
          s.move(instr.instr, instr.amount);
        }
        break;
      case "L":
      case "R":
        {
          s.rotate(instr.instr, instr.amount);
        }
        break;
      case "F": {
        s.forward(instr.amount);
      }
      default:
        break;
    }
  });

  return Math.abs(s.position.x) + Math.abs(s.position.y);
}

function part2(m) {
  const s = new Entity(0, 0, 0, "ship");
  const w = new Entity(10, 1, 0, "wpnt");
  let k = 0;
  function print() {
    console.log(`step ${k}:`);
    s.print();
    w.print();
  }

  //   print();

  function step() {
    const instr = instructions[k];
    switch (instr.instr) {
      case "N":
      case "E":
      case "S":
      case "W":
        {
          w.move(instr.instr, instr.amount);
        }
        break;
      case "L":
      case "R":
        {
          //   s.rotate(instr.instr, instr.amount);
          //   w.rotate(instr.instr, instr.amount);
          w.rotateAbout(s.x, s.y, instr.instr, instr.amount);
        }
        break;
      case "F": {
        for (let j = 0; j < instr.amount; j++) {
          const dir = vec2(w.x - s.x, w.y - s.y);
          w.translate(dir.x, dir.y);
          s.translate(dir.x, dir.y);
        }
      }
      default:
        break;
    }
    k += 1;
    // print();
  }
  const log = instructions.map((x) => {
    step();
    return `${x.instr}${x.amount} ${s.format()} ${w.format()}`;
  });

  fs.writeFileSync("res/12/output", log.join("\n"), "utf8");

  //   step();

  return Math.abs(s.position.x) + Math.abs(s.position.y); //?
}

part2();
