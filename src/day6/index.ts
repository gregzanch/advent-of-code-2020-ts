import * as R from "ramda";
import { arrayFromAsyncGenerator, streamInputBy } from "../util";
function getCount(group: string) {
  return Array.from(new Set(group.split("").filter((x) => x.match(/[a-z]/gim))))
    .length; //?
}

function getCount2(group: string) {
  const pers = group.split("\n").filter((x) => x);
  const count = pers.length; //?
  const answers = Array.from(
    new Set(group.split("").filter((x) => x.match(/[a-z]/gim)))
  ); //?

  const allsaidyes = answers.filter(
    (letter) => group.split("").filter((x) => x === letter).length == count
  ); //?

  return allsaidyes.length;
}

(async () => {
  arrayFromAsyncGenerator(streamInputBy(""));
  const groups = await input.split("\n\n");

  groups.map(getCount).reduce((a, b) => a + b); //?
  groups.map(getCount2).reduce((a, b) => a + b); //?
})();
