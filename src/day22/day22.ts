import { readInputs, add, ascending, difference, intersection, union, addArray, derivative } from "../helpers";

type PlayerDecks = {
  p1: number[];
  p2: number[];
};

function parse(str: string) {
  const [p1, p2] = str.split("\n\n").map((x) => x.slice(1));
  return {
    p1: p1.split("\n").slice(1).map(Number),
    p2: p2.split("\n").slice(1).map(Number),
  } as PlayerDecks;
}

function part1(input: string) {
  const { p1, p2 } = parse(input); //?
  console.log(p1); //?
  console.log(p2); //?
  function gameStep(i: number) {
    console.log("Round " + i);
    console.log(`Player 1's deck: ${p1.toString()}`);
    console.log(`Player 2's deck: ${p2.toString()}`);

    let p1card = p1.shift();
    let p2card = p2.shift();
    console.log(`Player 1 plays: ${p1card}`);
    console.log(`Player 2 plays: ${p2card}`);
    if (p1card > p2card) {
      p1.push(p1card);
      p1.push(p2card);
      console.log(`Player 1 wins the round!`);
    } else {
      p2.push(p2card);
      p2.push(p1card);
      console.log(`Player 2 wins the round!`);
    }
    console.log("\n");
  }
  let i = 1;
  while (p1.length && p2.length) {
    gameStep(i++);
  }

  let winner = p1.length == 0 ? p2 : p1;

  return winner
    .reverse()
    .map((x, index) => x * (index + 1))
    .reduce((a, b) => a + b);
}

class Game {
  p1: number[];
  p2: number[];
  i: number;
  num: number;
  history: Set<string>;
  indent: string;
  constructor(p1: number[], p2: number[], num: number) {
    this.p1 = [...p1];
    this.p2 = [...p2];
    this.i = 0;
    this.num = num;
    this.history = new Set();
    this.indent = Array(this.num).fill(" ").join(" ");
  }
  hashHands() {
    return "p1" + this.p1.toString() + "p2" + this.p2.toString();
  }
  handsAlreadyPlayed() {
    if (this.history.has(this.hashHands())) {
      return true;
    } else {
      this.history.add(this.hashHands());
      return false;
    }
  }
  getWinner() {
    let winner = this.step();
    while (winner == 0) {
      winner = this.step();
    }
    return winner;
    // let winner = p1.length == 0 ? p2 : p1;
  }
  step() {
    // console.log("\n");
    // console.log(`${this.indent}Game ${this.num} | Round ${this.i++}`);
    // console.log(`${this.indent}Player 1's deck: ${this.p1.toString()}`);
    // console.log(`${this.indent}Player 2's deck: ${this.p2.toString()}`);
    if (this.handsAlreadyPlayed()) {
      return 1;
    } else {
      let p1card = this.p1.shift();
      let p2card = this.p2.shift();
      // If players have as many cards in deck as value of card
      if (this.p1.length >= p1card && this.p2.length >= p2card) {
        // the winner of the round is determined by playing a new game of Recursive Combat (see below).
        const subGame = new Game(this.p1.slice(0, p1card), this.p2.slice(0, p2card), this.num + 1);
        const winner = subGame.getWinner();
        if (winner == 1) {
          this.p1.push(p1card);
          this.p1.push(p2card);
          // console.log(`${this.indent}Player 1 wins the round!`);
        } else {
          this.p2.push(p2card);
          this.p2.push(p1card);
          // console.log(`${this.indent}Player 2 wins the round!`);
        }
      } else {
        if (p1card > p2card) {
          this.p1.push(p1card);
          this.p1.push(p2card);
          // console.log(`${this.indent}Player 1 wins the round!`);
        } else {
          this.p2.push(p2card);
          this.p2.push(p1card);
          // console.log(`${this.indent}Player 2 wins the round!`);
        }
      }
      if (this.p1.length == 0) {
        return 2;
      } else if (this.p2.length == 0) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}

function part2(input: string) {
  const { p1, p2 } = parse(input);

  const game = new Game(p1, p2, 1);
  const winner = game.getWinner() == 1 ? game.p1 : game.p2;
  return winner
    .reverse()
    .map((x, index) => x * (index + 1))
    .reduce((a, b) => a + b);
}

const { input, example } = readInputs({ day: 22 });
console.log(part1(example));
console.log(part2(example));

console.log(part1(input));
console.log(part2(input));
