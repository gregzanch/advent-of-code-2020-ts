const nearley = require("nearley");
const grammar = require("./grammar.js");
const fs = require("fs");
let messages = fs.readFileSync("./src/day19/input.txt", "utf8").split("\n\n")[1].split("\n");
messages.length; //?

function parserMatches(message) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    parser.feed(message);
    return parser.finish().length > 0; //?
  } catch (err) {
    return false;
  }
  return true;
}

const filtered = messages.filter((x) => {
  if (parserMatches(x)) {
    return true;
  } else {
    return false;
  }
});

filtered.length; //?
