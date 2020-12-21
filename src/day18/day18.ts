import * as helpers from "../helpers";

// enum Operator {
//   Add = "+",
//   Sub = "-",
//   Mul = "*",
//   Div = "/",
// };

// interface PrecedenceTable {
//   [operator: Operator]: Operator
// }

function orderOfOperations(char: string, problem: number) {
  if (problem == 1) {
    return orderOfOperations1(char);
  } else {
    return orderOfOperations2(char);
  }
}

function orderOfOperations1(char: string) {
  if (char.match(/[*/+-]/g)) {
    return 1;
  }
  return 0;
}

function orderOfOperations2(char: string) {
  if (char.match(/[*/]/g)) {
    return 1;
  } else if (char.match(/[+-]/g)) {
    return 2;
  }
  return 0;
}

function convertToPostFixNotation(str: string, problem: number) {
  const chars = str.split("").filter((x) => x.trim().length > 0);
  debugger;
  const stack = ["#"] as string[];
  let postfix = "";
  let progress = "";
  for (let i = 0; i < chars.length; i++) {
    const character = chars[i];
    progress += character;
    if (character.match(/\d+/g)) {
      // if the character is a digit, we should add it to the postfix string
      postfix += character;
    } else if (character === "(") {
      // the open paren means we should add it to the stack
      stack.push("(");
    } else if (character == ")") {
      // the close paren means we should capture the text until the  closest '('
      while (stack[stack.length - 1] != "#" && stack[stack.length - 1] != "(") {
        //store and pop until ( has found
        postfix += stack[stack.length - 1];
        stack.pop();
        debugger;
      }
      //remove the '(' from stack
      stack.pop();
    } else {
      if (orderOfOperations(character, problem) > orderOfOperations(stack[stack.length - 1], problem)) {
        stack.push(character); //push if orderOfOperationsence is high
      } else {
        while (
          stack[stack.length - 1] != "#" &&
          orderOfOperations(character, problem) <= orderOfOperations(stack[stack.length - 1], problem)
        ) {
          postfix += stack[stack.length - 1]; //store and pop until higher orderOfOperationsence is found
          stack.pop();
          debugger;
        }
        stack.push(character);
      }
    }
    debugger;
  }
  while (stack.length > 0 && stack[stack.length - 1] != "#") {
    postfix += stack[stack.length - 1];
    debugger;
    stack.pop();
    debugger;
  }

  return postfix;
}

const BinaryOperators = {
  "+": helpers.add,
  "*": helpers.multiply,
  "-": helpers.subtract,
  "/": helpers.divide,
};

function parseProblem(str: string, prob: number) {
  const postfix = convertToPostFixNotation(str, prob);
  const stack = [];
  postfix.split("").forEach((item) => {
    if (item.match(/\d/g)) {
      stack.push(Number(item));
    } else if (BinaryOperators.hasOwnProperty(item)) {
      const rhs = stack.pop();
      const lhs = stack.pop();
      stack.push(BinaryOperators[item](lhs, rhs));
    }
  });

  return stack[0];
}

function part1(input: string) {
  const problems = input.split("\n");
  return problems.map((x) => parseProblem(x, 1)).reduce(helpers.add);
}

function part2(input: string) {
  const problems = input.split("\n");
  return problems.map((x) => parseProblem(x, 2)).reduce(helpers.add);
}

const input = helpers.readPuzzleInput({ day: 18 }) as string;

console.log(part1(input));
console.log(part2(input));

// parseProblem("5 + (8 * 3 + 9 + 3 * 4 * 3)");
// parseProblem("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))");
// parseProblem("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2");
