import { between, readPuzzleInput } from "../helpers";
const input = readPuzzleInput({ day: 16, seperator: "\n\n" }) as string[];

type Range = [number, number];

interface Field {
  field: string;
  ranges: Range[];
}

class Field implements Field {
  constructor({ field, ranges }: { field: string; ranges: Range[] }) {
    this.field = field;
    this.ranges = ranges;
  }
  withinEitherRange(n: number) {
    return between(n, this.ranges[0][0], this.ranges[0][1]) || between(n, this.ranges[1][0], this.ranges[1][1]);
  }
}

const parseField = (str: string) => {
  const [field, rest] = str.split(":").map((x) => x.trim());
  return new Field({
    field,
    ranges: rest.split(" or ").map((x) => x.split("-").map(Number) as Range),
  });
};

const parseCSV = (str: string) => {
  return str.split(",").map(Number);
};

const parseMine = (str: string) => {
  return parseCSV(str.split("\n")[1]);
};

const parseNearby = (str: string) => {
  return str.split("\n").slice(1).map(parseCSV);
};

const parse = (str) => {
  const [fieldstring, mine, nearby] = str;
  return {
    fields: fieldstring.split("\n").map(parseField) as Field[],
    mine: parseMine(mine),
    nearby: parseNearby(nearby),
  };
};

function part1(input: string[]) {
  const { fields, mine, nearby } = parse(input);

  nearby
    .map((tick) => tick.filter((x) => fields.filter((field) => field.withinEitherRange(x)).length == 0))
    .filter((x) => x.length > 0)
    .flat()
    .reduce((a, b) => a + b); //?
}

function part2(input: string[]) {
  const { fields, mine, nearby } = parse(input);

  const invalid = (num) => fields.filter((field) => field.withinEitherRange(num)).length == 0;

  const newTickets = nearby.filter((tick) => tick.filter(invalid).length == 0);
  newTickets.push(mine);

  const cantbes = newTickets.map((ticket) => {
    return ticket.map((num) => {
      const notwithinrange = fields.filter((field) => !field.withinEitherRange(num));
      if (notwithinrange.length > 0) {
        return notwithinrange.map((x) => x.field)[0];
      } else {
        return 0;
      }
    });
  });

  const fieldnames = [...new Set(fields.map((x) => x.field))];
  let columns = [] as any[];
  for (let i = 0; i < cantbes[0].length; i++) {
    let temp = [] as any[];
    for (let j = 0; j < cantbes.length; j++) {
      if (cantbes[j][i]) {
        temp.push(cantbes[j][i]);
      }
    }
    const set = new Set(temp);

    columns.push(fieldnames.filter((t) => !set.has(t)));
  }

  let knowns = new Map<string, number>();
  let knownindices = new Set<number>();

  const getNewKnown = (columns) => {
    return columns
      .map((col, index) => [col, index])
      .filter((zipped) => {
        if (zipped[0].length == 1) {
          if (!knowns.has(zipped[0][0])) {
            return true;
          }
        }
        return false;
      })
      .map((x) => [x[0][0], x[1]]);
  };

  const reduce = (columns) => {
    getNewKnown(columns).forEach((col) => {
      knowns.set(col[0], col[1] as number);
      knownindices.add(col[1]);
    });

    let newcolumns = [] as any;

    knowns.forEach((index, field) => {
      for (let i = 0; i < columns.length; i++) {
        if (i != index && typeof columns[i] !== "string") {
          newcolumns[i] = columns[i].filter((t) => t !== field);
        } else {
          newcolumns[index] = field;
        }
      }
    });
    return newcolumns;
  };

  for (let i = 0; i < columns.length; i++) {
    columns = reduce(columns);
  }

  columns
    .map((x, i) => [x, i])
    .filter((x) => x[0].startsWith("departure"))
    .map((x) => x[1])
    .map((i) => mine[i])
    .reduce((a, b) => a * b); //?

  //?
  // columns.map((col,index)=>{
  //   if(col.length == 1){
  //     knowns.set(col[0], index);
  //     knownfields.add(col)
  //   }
  // })
}

part2(input);
