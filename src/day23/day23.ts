import chalk from "chalk";
import { appendFileSync, writeFileSync } from "fs";
import { LinkedList, LinkedListNode, LinkedListNodePosition, LinkedListSelection } from "../LinkedList";
import {
  readInputs,
  add,
  ascending,
  difference,
  intersection,
  union,
  addArray,
  derivative,
  min,
  max,
  mod,
} from "../helpers";

type Cup = number;

function cycleLeft<T>(arr: Array<T>, n) {
  for (let i = 0; i < n; i++) {
    arr.push(arr.shift());
  }
  return arr;
}

class Game {
  cups: number[];
  current: number;
  pickup: [number, number, number];
  destination: number;
  min: number;
  max: number;
  constructor(cups: number[]) {
    this.cups = cups;
    this.min = this.cups.reduce(min);
    this.max = this.cups.reduce(max);
    console.log(this.min, this.max); //?
    this.current = this.cups[0];
  }
  get currentIndex() {
    return this.cups.indexOf(this.current);
  }
  get destinationIndex() {
    return this.cups.indexOf(this.destination);
  }
  pickUpCups() {
    cycleLeft(this.cups, this.currentIndex);
    this.pickup = this.cups.slice(this.currentIndex + 1, this.currentIndex + 4) as [number, number, number];
    this.cups.splice(this.currentIndex + 1, 3);
  }
  inPickUp(n: number) {
    return this.pickup.indexOf(n) != -1;
  }
  pickDestination() {
    let dest = this.current - 1;
    if (dest < this.min) {
      dest = this.max;
    }
    while (this.inPickUp(dest)) {
      dest -= 1;
      if (dest < this.min) {
        dest = this.max;
      }
    }
    this.destination = dest;
  }
  place() {
    this.cups = [
      ...this.cups.slice(0, this.destinationIndex + 1),
      ...this.pickup,
      ...this.cups.slice(this.destinationIndex + 1),
    ];
  }
  remove() {
    this.cups.splice(this.currentIndex + 1, 3);
  }
  move() {
    const lastIndex = this.currentIndex;
    // console.log(
    //   "cups: ",
    //   this.cups.map((x) => (x == this.current ? chalk.hex("#ffffff")(x) : chalk.hex("#d89958")(x))).join(" ")
    // );
    this.pickUpCups();
    // console.log("pick: ", ...this.pickup);
    this.pickDestination();
    // console.log("dest: ", this.destination);
    this.place();
    // this.remove();
    // this.print();
    this.current = this.cups[(this.currentIndex + 1) % this.cups.length];
    // cycleLeft(this.cups, this.currentIndex - lastIndex - 1);
  }
  getOutput() {
    const oneIndex = this.cups.indexOf(1);
    cycleLeft(this.cups, oneIndex);
    const output = this.cups.slice(1).join("");
    return output;
  }
  print() {
    console.log(
      "cups: ",
      this.cups.map((x) => (x == this.current ? chalk.hex("#ffffff")(x) : chalk.hex("#d89958")(x))).join(" ")
    );
  }
}

function parse(str: string) {
  //
  return new Game(str.split("").map(Number));
}

function part1(input: string) {
  const game = parse(input); //?

  for (let i = 0; i < 100; i++) {
    game.move();
    game.print();
  }
  console.log(game.getOutput());
}

function part2(input: string) {
  const init = input.split("").map(Number);
  const arr = new Uint32Array(1e6);
  let minimum = init.reduce(min);

  for (let i = 0; i < 1e6; i++) {
    arr[i] = i < init.length ? init[i] : i + 1;
  }

  let maximum = 1e6;

  const list = LinkedList.fromTypedArray(arr, { closed: true });
  // const list = LinkedList.fromArray(init, { closed: true });

  const iter = 1e7;

  let current = list.get(arr[0]);
  let pickup: number[];
  let destination: LinkedListNode<number>;

  const printList = () => {
    console.log(list.toString(" ", { max: init.length - 1 }));
  };
  const getPickup = (print = false) => {
    pickup = [...LinkedList.getNextNodes(current.next, 2)].map((x) => x.value);
    print && console.log(pickup);
    return pickup;
  };

  const getVal = (print = false) => {
    let val = current.value - 1;
    val < minimum && (val = maximum);
    while (pickup.includes(val)) {
      val = val - 1;
      val < minimum && (val = maximum);
    }
    print && console.log(val);
    return val;
  };

  function step() {
    // printList();
    pickup = getPickup();
    destination = list.get(getVal());
    list.cut(current.next, [0, 2]).paste(destination, LinkedListNodePosition.AFTER);
    current = current.next;
  }

  for (let i = 0; i < iter; i++) {
    step();
  }

  // let str = list.toString("", { max: 2 * init.length });
  // let index = str.indexOf("1") + 1;
  // str.slice(index, index + init.length - 1); //?

  const vals = [list.get(1).next.value, list.get(1).next.next.value];
  return vals[0] * vals[1];
}

const { input, example } = readInputs({ day: 23 });
// part1(example);
console.log(part2(input));
// part2(input);
// console.log(part2(example));

// part1(input);
// console.log(part2(input));
