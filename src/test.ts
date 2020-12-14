export {};

function* iterateOverString(str: string) {
  for (let i = 0; i < str.length; i++) {
    yield str[i] as string;
  }
  return str;
}

const iter = iterateOverString("abcdefg"); //?

iter.next(); //?
iter.next(); //?
iter.next(); //?
iter.next(); //?
iter.next(); //?
iter.next(); //?
iter.next(); //?
iter.next(); //?
