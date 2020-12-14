// https://github.com/mattvperry/aoc2020
import fs from "fs";
import path from "path";

export type Day = `day${number}`;

export type FromEntries<T> = T extends [PropertyKey, infer V]
  ? { [X in T[0]]?: V }
  : never;
export type Entries<T> = T extends { [K in keyof T]: infer V }
  ? [keyof T, V]
  : never;

export async function* streamInputBy(
  filepath: string,
  seperator: string | RegExp
): AsyncIterableIterator<string> {
  let current = "";
  for await (const x of fs.createReadStream(filepath)) {
    current = current + x;
    if (!current.match(seperator)) {
      continue;
    }

    const lines = current.split(seperator);
    const [before, after] = splitAt(lines, lines.length - 1);
    yield* before.map((l) => l.trim());
    [current] = after;
  }

  yield current.trim();
}

export const streamInputLinesAsync = <T extends Day>(
  day: T
): AsyncIterableIterator<string> => streamInputBy(`src/${day}/input.txt`, "\n");

export const arrayFromAsyncGenerator = <T>(
  gen: AsyncIterableIterator<T>
): Promise<T[]> =>
  reduceAsync(gen, [] as T[], async (acc, curr) => [...acc, curr]);

export function* zipper<T>(data: Iterable<T>): IterableIterator<[T[], T, T[]]> {
  let init: T[] = [];
  let [head, ...tail] = data;
  while (tail.length >= 0) {
    yield [init, head, tail];
    if (tail.length === 0) {
      break;
    }

    init = [...init, head];
    [head, ...tail] = tail;
  }
}

export function* map<T, U>(data: Iterable<T>, fn: (curr: T) => U): Iterable<U> {
  for (const x of data) {
    yield fn(x);
  }
}

export async function* mapAsync<T, U>(
  data: AsyncIterable<T>,
  fn: (curr: T) => Promise<U>
): AsyncIterableIterator<U> {
  for await (const x of data) {
    yield await fn(x);
  }
}

export const reduce = <T, U>(
  data: Iterable<T>,
  seed: U,
  fn: (acc: U, curr: T) => U
): U => {
  let acc = seed;
  for (const x of data) {
    acc = fn(acc, x);
  }

  return acc;
};

export const reduceAsync = async <T, U>(
  data: AsyncIterable<T>,
  seed: U,
  fn: (acc: U, curr: T) => Promise<U>
): Promise<U> => {
  let acc = seed;
  for await (const x of data) {
    acc = await fn(acc, x);
  }

  return acc;
};

export const readInputLines = <T extends Day>(day: T) =>
  arrayFromAsyncGenerator(streamInputLinesAsync(day));

export const charFrequency = (input: string): { [k: string]: number } => {
  return input.split("").reduce((acc, curr) => {
    acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
    return acc;
  }, {} as ReturnType<typeof charFrequency>);
};

export const memoize = <P extends any[], R, K extends P[number]>(
  fn: (...args: P) => R,
  key: (...args: P) => K
): ((...args: P) => R) => {
  const memo = {} as Record<K, R>;
  return (...args: P) => {
    const k = key(...args);
    if (isDefined(memo[k])) {
      return memo[k];
    }

    memo[k] = fn(...args);
    return memo[k];
  };
};

export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set<T>(array));
};

export const splitArr = <T>(array: T[], on: T): [T[], T[]] => {
  return splitAt(array, array.indexOf(on) - 1);
};

type Sliceable = {
  slice: (start?: number, end?: number) => any;
  length: number;
};
export const splitAt = <T extends Sliceable>(
  xs: T,
  i: number
): [ReturnType<T["slice"]>, ReturnType<T["slice"]>] => [
  xs.slice(0, i),
  xs.slice(i, xs.length),
];

export const isDefined = <T>(x: T | undefined): x is T => x !== undefined;

export const countBy = <T>(data: Iterable<T>, fn: (x: T) => boolean): number =>
  reduce(data, 0, (acc, curr) => acc + (fn(curr) ? 1 : 0));

export const fromEntries = <T extends [PropertyKey, any]>(
  entries: Iterable<T>
): FromEntries<T> => Object.fromEntries(entries) as FromEntries<T>;

export const mod = (n: number, m: number): number => ((n % m) + m) % m;
