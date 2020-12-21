import { readPuzzleInput } from "../helpers";

// read the input file

/*

In this game, the players take turns saying numbers. They begin by taking turns reading from a list of starting numbers (your puzzle input). Then, each turn consists of considering the most recently spoken number:

If that was the first time the number has been spoken, the current player says 0.
Otherwise, the number had been spoken before; the current player announces how many turns apart the number is from when it was previously spoken.
So, after the starting numbers, each turn results in that player speaking aloud either 0 (if the last number is new) or an age (if the last number is a repeat).

For example, suppose the starting numbers are 0,3,6:

Turn 1: The 1st number spoken is a starting number, 0.
Turn 2: The 2nd number spoken is a starting number, 3.
Turn 3: The 3rd number spoken is a starting number, 6.
Turn 4: Now, consider the last number spoken, 6. Since that was the first time the number had been spoken, the 4th number spoken is 0.
Turn 5: Next, again consider the last number spoken, 0. Since it had been spoken before, the next number to speak is the difference between the turn number when it was last spoken (the previous turn, 4) and the turn number of the time it was most recently spoken before then (turn 1). Thus, the 5th number spoken is 4 - 1, 3.
Turn 6: The last number spoken, 3 had also been spoken before, most recently on turns 5 and 2. So, the 6th number spoken is 5 - 2, 3.
Turn 7: Since 3 was just spoken twice in a row, and the last two turns are 1 turn apart, the 7th number spoken is 1.
Turn 8: Since 1 is new, the 8th number spoken is 0.
Turn 9: 0 was last spoken on turns 8 and 4, so the 9th number spoken is the difference between them, 4.
Turn 10: 4 is new, so the 10th number spoken is 0.


Their question for you is: what will be the 2020th number spoken? In the example above, the 2020th number spoken will be 436.


Given the starting numbers 1,3,2, the 2020th number spoken is 1.
Given the starting numbers 2,1,3, the 2020th number spoken is 10.
Given the starting numbers 1,2,3, the 2020th number spoken is 27.
Given the starting numbers 2,3,1, the 2020th number spoken is 78.
Given the starting numbers 3,2,1, the 2020th number spoken is 438.
Given the starting numbers 3,1,2, the 2020th number spoken is 1836.

*/

// keep track of the numbers spoken

// if number not been spoken, 0
// if has been spoken, difference between turn # last spoken and turn # time most recently spoken before then (turn 1)

function part1(input: number[], n = 2020) {
  function getDistanceBetween(num: number) {
    let firstinstance: number;
    for (let i = input.length - 1; i >= 0; i--) {
      input[i];
      if (input[i] == num) {
        if (!firstinstance) {
          firstinstance = i;
        } else {
          return firstinstance - i;
        }
      }
    }
    return false;
  }
  for (let i = input.length; i < n; i++) {
    let distance = getDistanceBetween(input[i - 1]);
    if (distance) {
      input.push(distance);
    } else {
      input.push(0);
    }
  }
  // return ;
  return input[input.length - 1];
}

type Index = number;

type Record = {
  last: Index;
  lastlast: Index | undefined;
};

function part2(input: number[], n = 2020) {
  const history = new Map<number, [number, number | undefined]>();
  let turnNumber = 0;
  let previousNumber: number;
  input.forEach((num, i) => {
    history.set(num, [i, undefined]);
    previousNumber = num;
    turnNumber = i;
  });

  function updateHistory(num: number, index: number) {
    const item = history.get(num);
    if (item) {
      item.unshift(index);
      item.pop();
    } else {
      history.set(num, [index, undefined]);
    }
  }

  let currentNumber: number;
  while (turnNumber < n - 1) {
    const record = history.get(previousNumber);
    if (typeof record[1] === "undefined") {
      currentNumber = 0;
      updateHistory(currentNumber, turnNumber + 1);
    } else {
      currentNumber = record[0] - record[1];
      updateHistory(currentNumber, turnNumber + 1);
    }
    input.push(currentNumber);
    turnNumber++;
    previousNumber = currentNumber;
  }
  return currentNumber;
}

const p1 = part1([1, 12, 0, 20, 8, 16], 2020);
// const p2 = part2([1, 12, 0, 20, 8, 16], 2020);
const p2 = part2([1, 12, 0, 20, 8, 16], 30000000);

console.log(p1);
console.log(p2);
