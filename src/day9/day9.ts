//@ts-nocheck
import { readPuzzleInput, reducers } from "../helpers";

const input = readPuzzleInput({
  day: 9,
  seperator: "\n",
}) as string[];

const numbers = input.map(Number); //?

function isSum(index: number) {
  let found = false;
  for (let i = index - 26; i < index; i++) {
    for (let j = i; j < index; j++) {
      let x = numbers[i];
      let y = numbers[j];
      if (i != j) {
        if (numbers[index] == x + y) {
          found = true;
        }
      }
    }
  }

  return found;
}

let answerIndex;
let answer;

for (let i = 26; i < numbers.length; i++) {
  if (!isSum(i)) {
    answerIndex = i;
    answer = numbers[i];
    break;
  }
}

let range: [number, number] = [0, 1];
for (let i = 0; i < answerIndex; i++) {
  let runningTotal = numbers[i];
  let j = i + 1;
  while (runningTotal < answer) {
    runningTotal += numbers[j];
    if (runningTotal == answer) {
      range = [i, j]; //?
      answer; //?
      sumUsingIndices(numbers, i, j); //?
      break;
    }
    j++;
  }
  if (runningTotal == answer) {
    break;
  }
}

range; //?

function sumUsingIndices(array, startIndex, stopIndex) {
  let sum = 0;
  for (let i = startIndex; i <= stopIndex; i++) {
    sum += array[i];
  }
  return sum;
}

function sliceUsingIndices<T = any>(array: T[], startIndex: number, endIndex: number) {
  let arr = [] as T[];
  for (let i = startIndex; i <= endIndex; i++) {
    arr.push(array[i]);
  }
  return arr;
}

const max = sliceUsingIndices(numbers, ...range).reduce(reducers.max); //?
const min = sliceUsingIndices(numbers, ...range).reduce(reducers.min); //?

console.log("min", min);
console.log("max", max);

console.log(min + max);
