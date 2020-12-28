import {
  splitEvery,
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
  readPuzzleInput,
} from "../helpers";

function parse(input: string) {
  const [card, door] = input.split("\n").map(Number);
  return {
    card,
    door,
  };
}

/*

The handshake used by the card and the door involves an operation that transforms a subject number. 
To transform a subject number, start with the value 1. 
Then, a number of times called the loop size, perform the following steps:

Set the value to itself multiplied by the subject number.
Set the value to the remainder after dividing the value by 20201227.
The card always uses a specific, secret loop size when it transforms a subject number. The door always uses a different, secret loop size.

The cryptographic handshake works like this:

The card transforms the subject number of 7 according to the card's secret loop size. The result is called the card's public key.
The door transforms the subject number of 7 according to the door's secret loop size. The result is called the door's public key.
Thie card and door use the wireless RFID signal to transmit the two public keys (your puzzle input) to the other devce. 
Now, the card has the door's public key, and the door has the card's public key. 

Because you can eavesdrop on the signal, you have both public keys, but neither device's loop size.

The card transforms the subject number of the door's public key according to the card's loop size. 
The result is the encryption key.

The door transforms the subject number of the card's public key according to the door's loop size. 
The result is the same encryption key as the card calculated.

If you can use the two public keys to determine each device's loop size, 
you will have enough information to calculate the secret encryption key that the card and door use to communicate; 
this would let you send the unlock command directly to the door!

*/

function t(subject: number, key: number) {
  let x = 1;
  let loopSize = 0;
  while (x != key && loopSize < 1e8) {
    x = (x * subject) % 20201227; //?
    loopSize++;
  }

  return loopSize;
}

function reverseTransform(key: number, loopSize: number) {
  let subject = key;
  for (let i = 0; i < loopSize; i++) {
    subject = key; //?
  }
}

function part1(input: string) {
  const { card: c, door: d } = parse(input); //?

  // let x = 14897079;
  // t(c, x) == t(7, d); //?
  // t(d, x) == t(7, c); //?

  let dl = t(7, d);
  let cl = t(7, c);

  let y = 1;
  for (let i = 0; i < dl; i++) {
    y = (y * c) % 20201227;
  }

  let z = 1;
  for (let i = 0; i < cl; i++) {
    z = (z * d) % 20201227;
  }

  if (y == z) {
    return z;
  }
}
function part2(input: string) {
  parse(input);
}

const { input, example } = readInputs({ day: 25 });

// console.log(part1(example));
console.log(part1(input));
