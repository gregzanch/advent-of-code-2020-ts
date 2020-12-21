import * as helpers from "../helpers";

type MatchExpr = "a" | "b";

type RuleRef = {
  id: number;
  refs: Rule[][];
  numbers: number[][];
};

type RuleMatcher = {
  id: number;
  matcher: MatchExpr;
};

type Rule = RuleRef | RuleMatcher;

type ParseResult = {
  rules: Rule[];
  messages: string[];
};

function parse(str: string): ParseResult {
  const [rules, messages] = str.split("\n\n");

  const parsedRules = rules.split("\n").map((x) => {
    const splits = x.split(/[:|]+/g);
    const [id, ...rest] = splits.map((x) => x.trim());
    if (rest[0] === '"a"' || rest[0] === '"b"') {
      if (rest[0]) {
        const trimmed = rest[0].replace(/["]+/g, "");
        if (trimmed === "a" || trimmed === "b") {
          return {
            id: Number(id),
            matcher: trimmed,
          } as Rule;
        }
      }
    } else {
      const numbers = rest.map((y) => y.split(" ").map(Number));
      return {
        id: Number(id),
        refs: [] as Rule[][],
        numbers,
      } as Rule;
    }
  });

  const parsedMessages = messages.split("\n");
  return {
    rules: parsedRules,
    messages: parsedMessages,
  };
}

function part1(input: string) {
  const data = parse(input);
  const map = new Map<number, Rule>();
  for (const rule of data.rules) {
    map.set(rule.id, rule);
  }
  for (const [id, rule] of map) {
    if (rule["numbers"]) {
      (rule as RuleRef).numbers.forEach((numberset) => {
        let refs = [] as Rule[];
        numberset.forEach((n) => {
          refs.push(map.get(n));
        });
        (rule as RuleRef).refs.push(refs);
      });
    }
  }

  function matches(rule: Rule, str: string) {
    if (rule["refs"]) {
      let _matches = false;
      const refs = (rule as RuleRef).refs;
      for (let i = 0; i < refs.length; i++) {
        _matches =
          _matches ||
          refs[i]
            .map((r, k) => {
              return matches(r, str.slice(k));
            })
            .reduce((a, b) => a && b, true);
      }
      return _matches;
    } else {
      console.log("matcher", rule, str[0]);
      return str[0] === (rule as RuleMatcher).matcher;
    }
  }

  function build() {
    map.get(0);
  }

  matches(map.get(0), "ababbb"); //?
}

const example = `
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

part1(example);
