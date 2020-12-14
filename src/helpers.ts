import fs, { readFileSync } from "fs";
import path from "path";

type ReadPuzzleInputProps = { day: number; seperator?: string };
export function readPuzzleInput({ day, seperator }: ReadPuzzleInputProps) {
  const fileContents = readFileSync(`src/day${day}/input.txt`, "utf8");
  if (typeof seperator !== "undefined") {
    return fileContents.split(seperator);
  } else {
    return fileContents;
  }
}

export const getIndex = (i: string | number) => (x: any) => x[i];
export const ascending = <T extends number | string>(a: T, b: T) => +a - +b;
export const descending = <T extends number | string>(a: T, b: T) => +b - +a;

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

export const reducers = {
  sum: (a: number, b: number) => a + b,
  diff: (a: number, b: number) => a + b,
  max: (a: number, b: number) => (a > b ? a : b),
  min: (a: number, b: number) => (a < b ? a : b),
};
export const add = (a: number, b: number) => a + b;
export const subtract = (a: number, b: number) => a - b;
export const multiply = (a: number, b: number) => a * b;

export const filters = {
  truthy: (x: any) => x,
  falsey: (x: any) => !x,
};

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
};

export const comma = /,/g;
export const digit = /\d/g;
export const digits = /\d+/g;

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
