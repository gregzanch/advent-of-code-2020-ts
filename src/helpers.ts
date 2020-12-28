import fs, { readFileSync } from "fs";
import path from "path";

export function readInputs<T extends ReadInputProps>(
  props: T
): T extends { seperator: string }
  ? {
      input: string[];
      example: string[];
    }
  : {
      input: string;
      example: string;
    };

export function readInputs({ day, seperator }) {
  return {
    input: readPuzzleInput({ day, seperator }),
    example: readExampleInput({ day, seperator }),
  };
}

type ReadInputProps = { day: number; seperator?: string };
export function readPuzzleInput({ day, seperator }: ReadInputProps) {
  const fileContents = readFileSync(`src/day${day}/input.txt`, "utf8");
  if (typeof seperator !== "undefined") {
    return fileContents.split(seperator);
  } else {
    return fileContents;
  }
}

export function readExampleInput({ day, seperator }: ReadInputProps) {
  const fileContents = readFileSync(`src/day${day}/example.txt`, "utf8");
  if (typeof seperator !== "undefined") {
    return fileContents.split(seperator);
  } else {
    return fileContents;
  }
}

export function intersection<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  // intersect can be simulated via
  return new Set([...set1].filter((x) => set2.has(x)));
}

export function difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  // difference can be simulated via
  return new Set([...set1].filter((x) => !set2.has(x)));
}

export function union<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  // union can be simulated via
  return new Set([...set1, ...set2]);
}

export const getIndex = (i: string | number) => (x: any) => x[i];
export const ascending = <T extends number | string>(a: T, b: T) => (a < b ? -1 : +1);
export const descending = <T extends number | string>(a: T, b: T) => (a < b ? +1 : -1);
export const via = (i: string | number) => (fn: Function) => (...args: any[][]) => fn(...args.map(getIndex(i)));
export const applyAt = (i: number) => (fn: Function) => <T>(x: T[]) => fn(x[i]);
export const match = (expr: string | RegExp) => (str: string) => str.match(expr);

export const swap = (a: number, b: number) => <T>(arr: T[]) => [
  ...arr.slice(0, a),
  arr[b],
  ...arr.slice(a + 1, b),
  arr[a],
  ...arr.slice(b + 1),
];

export const add = (a: number, b: number) => a + b;
export const subtract = (a: number, b: number) => a - b;
export const multiply = (a: number, b: number) => a * b;
export const divide = (a: number, b: number) => a / b;
export const max = (a: number, b: number) => (a > b ? a : b);
export const min = (a: number, b: number) => (a < b ? a : b);

export const truthy = (x: any) => !!x;
export const falsey = (x: any) => !x;

export const maps = {
  length: (x: any[]) => x.length,
  split: (x: string) => x.split(""),
  splitBy: (expr: string | RegExp) => (x: string) => x.split(expr),
  join: (x: any[]) => x.join(""),
  joinWith: (str: string) => (x: string[] | number[]) => x.join(str),
};

export const toIndexed = <T>(x: T, i: number, a: T[]): [number, T] => [i, x];

export const regularExpressions = {
  hexColor: /\#[a-z0-9]{6}/gim,
  comma: /,/g,
  digit: /\d/g,
  digits: /\d+/g,
};

export function splitEvery(arr: Array<any>, n: number) {
  return arr.reduce(
    (a, b) => {
      if (a[a.length - 1].length < n) {
        a[a.length - 1].push(b);
      } else {
        a.push([b]);
      }
      return a;
    },
    [[]]
  );
}

export const multiMap = (fn) => (a, b) => a.map((x, i) => fn(x, b[i]));

export const addArray = multiMap(add);
export const subtractArray = multiMap(subtract);
export const multiplyArray = multiMap(multiply);

export const toNumbers = <T extends string | number | boolean>(x: T[]) => x.map(Number);
export const between = (v: number, a: number, b: number) => v >= a && v <= b;
export const unique = (arr: Iterable<any>) => Array.from(new Set(arr));
export const diff = (A: any[], B: any[]) => {
  return [A, B].map((x, i, a) => x.filter((y) => !a[(i + 1) % 2].includes(y)));
};

export const clamp = (a: number, b: number) => (v: number): number => {
  return v < a ? a : v > b ? b : v;
};

/**
 * modulus operation. wraps a number like so:
 * ```text
 *   /  /  /
 *  /  /  /
 * /  /  /
 * ```
 *
 * @param n dividend
 * @param m divisor
 */
export const mod = (n: number, m: number) => {
  return n < 0 ? m - (Math.abs(n) % m) : n % m;
};

/**
 * reflected modulus operation. instead of wrapping it reflects like so:
 * ```text
 *   /\    /\
 *  /  \  /  \
 * /    \/    \
 * ```
 *
 * @param n dividend
 * @param m divisor
 */
export const rmod = (n: number, m: number) => {
  return m - 2 * Math.abs(mod(0.5 * n, m) - 1);
};

export const int = Math.trunc;

export const isInteger = Number.isInteger;

//@ts-ignore
export const at = (obj: any, path: string) => {
  let keys = path.split(".");
  if (keys.length > 1) {
    return at(obj[keys[0]], keys.slice(1).join("."));
  }
  return obj[keys[0]];
};

export function derivative(arr: number[]) {
  const temp = [] as number[];
  for (let i = 1; i < arr.length; i++) {
    temp.push(arr[i] - arr[i - 1]);
  }
  return temp;
}

export const countIf = (condition: { (x: any): boolean; (arg0: any): any }) => (arr: string | any[]) => {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (condition(arr[i])) {
      count += 1;
    }
  }
  return count;
};

export const makeObject = (fields: [string, any][]) => fields.reduce((a, b) => Object.assign(a, { [b[0]]: b[1] }), {});

export interface GraphNode<T> {
  value: T;
  children: Set<GraphNode<T>>;
  parents: Set<GraphNode<T>>;
}

export class GraphNode<T> implements GraphNode<T> {
  constructor(value: T) {
    this.value = value;
    this.children = new Set<GraphNode<T>>();
    this.parents = new Set<GraphNode<T>>();
  }
  addChild(child: T | GraphNode<T>): Set<GraphNode<T>> {
    if (child instanceof GraphNode) {
      if (!this.children.has(child)) {
        this.children.add(child);
        child.parents.add(this);
      }
    } else {
      const childNode = new GraphNode<T>(child);
      if (!this.children.has(childNode)) {
        this.children.add(childNode);
        childNode.parents.add(this);
      }
    }
    return this.children;
  }
}

export interface Range {
  [0]: number;
  [1]: number;
}

export class Range implements Range {
  constructor(min: number, max: number) {
    this[0] = Math.min(min, max);
    this[1] = Math.max(min, max);
  }
  get min() {
    return this[0];
  }
  set min(m: number) {
    if (m > this[1]) {
      console.warn(`new value (${m}) for min (${this[0]}) is greater than max ${this[1]}, switching automatically`);
      this[0] = this[1];
      this[1] = m;
    } else {
      this[0] = m;
    }
  }

  get max() {
    return this[1];
  }
  set max(m: number) {
    if (m < this[0]) {
      console.warn(`new value (${m}) for max (${this[1]}) is less than min ${this[0]}, switching automatically`);
      this[1] = this[0];
      this[0] = m;
    } else {
      this[1] = m;
    }
  }

  get delta() {
    return this[1] - this[0];
  }

  contains(val: number) {
    return val > this.min && val < this.max;
  }
}

export class ClosedRange extends Range {
  contains(val: number) {
    return val >= this.min && val <= this.max;
  }
}

interface ReversedArray<T> {
  [index: number]: T;
}

export function* getAdjacentIterator(n: number, range: [number, number]) {
  const m = range[1] - range[0] + 1;
  for (let i = 0; i < m ** n; i++) {
    yield i
      .toString(m)
      .padStart(n, "0")
      .split("")
      .map((x) => Number(x) + range[0]);
  }
  return;
}

function* fibonacci() {
  let current = 0;
  let next = 1;
  while (true) {
    let reset = yield current;
    [current, next] = [next, next + current];
    if (reset) {
      current = 0;
      next = 1;
    }
  }
}

const isObject = (x) => typeof x === "object";
const nonNull = (x) => x != null;
const isNonNullObject = (x) => isObject(x) && nonNull(x);
export function deepEqual(x: any, y: any) {
  if (Object.is(x, y) || x === y) return true;
  else if (isNonNullObject(x) && isNonNullObject(y)) {
    if (Object.keys(x).length != Object.keys(y).length) return false;
    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
}
