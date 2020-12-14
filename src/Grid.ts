import { assert } from "console";
import { clamp, mod, rmod } from "./helpers";
import { test } from "./test";

export class Grid<T extends string | number> {
  data: T[][];
  boundaryCondition: Grid.BoundaryCondition;
  constructor(data: T[][], boundaryCondition = Grid.BoundaryConditions.none) {
    this.data = data;
    this.boundaryCondition = boundaryCondition;
  }
  get shape(): [number, number] {
    return [this.data.length, this.data[0].length];
  }
  get upperBounds(): [number, number] {
    return [this.data.length - 1, this.data[0].length - 1];
  }
  getXY(x: number, y: number) {
    return this.get(y, x);
  }
  get(i: number, j: number) {
    switch (this.boundaryCondition) {
      case "clamp": {
        const ci = clamp(0, this.upperBounds[0])(i);
        const cj = clamp(0, this.upperBounds[1])(j);
        return this.data[ci][cj];
      }
      case "wrap": {
        const ci = mod(i, this.shape[0]);
        const cj = mod(j, this.shape[1]);
        return this.data[ci][cj];
      }
      case "reflect": {
        const ci = rmod(i, this.upperBounds[0]);
        const cj = rmod(j, this.upperBounds[1]);
        return this.data[ci][cj];
      }

      case "none":
      default:
        return this.data[i][j];
    }
  }
}

export namespace Grid {
  export enum BoundaryConditions {
    wrap = "wrap",
    clamp = "clamp",
    none = "none",
    reflect = "reflect",
  }
  export type BoundaryCondition = keyof typeof Grid.BoundaryConditions | Grid.BoundaryConditions;
}

export function GridTest() {
  (() => {
    const grid = new Grid([
      ["0,0", "0,1", "0,2"],
      ["1,0", "1,1", "1,2"],
      ["2,0", "2,1", "2,2"],
    ]);

    grid.boundaryCondition = "none";
    test(() => grid.get(0, 0) === "0,0");
    test(() => grid.get(1, 2) === "1,2");
    test(() => grid.getXY(0, 0) === "0,0");
    test(() => grid.getXY(1, 2) === "2,1");

    grid.boundaryCondition = "clamp";
    test(() => grid.get(-10, -10) === "0,0");
    test(() => grid.get(10, 10) === "2,2");
    test(() => grid.getXY(-10, -10) === "0,0");
    test(() => grid.getXY(10, 10) === "2,2");

    grid.boundaryCondition = "wrap";
    test(() => grid.get(3, 3) === "0,0");
    test(() => grid.get(1, 1) === grid.get(4, 4));
    test(() => grid.getXY(5, 7) === "1,2");
    test(() => grid.getXY(-1, -1) === grid.getXY(2, 2));

    grid.boundaryCondition = "reflect";
    test(() => grid.get(3, 3) === "1,1");
    test(() => grid.get(-4, -4) === "0,0");
    test(() => grid.getXY(4, 7) === "1,0");
    test(() => grid.getXY(-5, -7) === "1,1");
  })();

  (() => {
    const grid = new Grid([[".", "•", "°", "˚"]]);

    grid.boundaryCondition = "wrap";

    let acc = "";
    for (let i = 0; i < 20; i++) {
      acc += grid.getXY(i, 0);
    }
    acc; //?

    grid.boundaryCondition = "reflect";

    let accs = "";
    for (let i = 0; i < 20; i++) {
      accs += grid.getXY(i, 0);
    }
    accs; //?
  })();
}

GridTest();
