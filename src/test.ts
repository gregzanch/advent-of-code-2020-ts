import { assert } from "console";

export function test(fn: Function, ...args: any[]) {
  assert(fn(args), fn.toString());
}
