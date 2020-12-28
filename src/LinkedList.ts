import { parse } from "path";
import { mod } from "./helpers";

export type TypedArray =
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array;

export interface LinkedListNode<T> {
  value: T;
  prev?: LinkedListNode<T>;
  next?: LinkedListNode<T>;
}

export function createLinkedListNode<T>(
  value: T,
  prev?: LinkedListNode<T>,
  next?: LinkedListNode<T>
): LinkedListNode<T> {
  return {
    value,
    prev: prev || null,
    next: next || null,
  };
}

export function createLinkedListNodeArray<T>(array: T[]): LinkedListNode<T>[] {
  return array
    .map((value) => createLinkedListNode(value))
    .map((node, index, arr) => {
      node.next = arr[mod(index + 1, arr.length)];
      node.prev = arr[mod(index - 1, arr.length)];
      return node;
    });
}

export type LinkedListRange = {
  /**
   * the lower selection bound (quantity of nodes before the cursor)
   */
  0: number;

  /**
   * the upper selection bound (quantity of nodes after the cursor)
   */
  1: number;
};

/**
 * @class LinkedListSelection
 * @description `LinkedListSelection` respresents a portion of a `LinkedList` that has a `start` and `end` node
 * as well as methods for moving the location of the selection
 */
export class LinkedListSelection<T> {
  /**
   * the selection cursor
   */
  public cursor: LinkedListNode<T>;

  public range: LinkedListRange;

  constructor(cursor: LinkedListNode<T>, range?: LinkedListRange) {
    this.cursor = cursor;
    this.range = range;
  }

  public static fromSelection<T>(selection: LinkedListSelection<T>) {
    const newSelection = new LinkedListSelection(selection.cursor, selection.range);
    return newSelection;
  }

  /**
   *
   * @param selection the linked list selection
   * @param target
   */
  public paste(
    // selection: LinkedListSelection<T>,
    target: LinkedListNode<T>,
    position: LinkedListNodePosition = LinkedListNodePosition.AFTER
  ) {
    const _target = {
      start: position === LinkedListNodePosition.BEFORE ? target.prev : target,
      end: position === LinkedListNodePosition.AFTER ? target.next : target,
    };

    const hole = {
      start: this.start.prev,
      end: this.end.next,
    };

    this.start.prev = _target.start;
    this.end.next = _target.end;

    hole.start && (hole.start.next = hole.end);
    hole.end && (hole.end.prev = hole.start);

    _target.start && (_target.start.next = this.start);
    _target.end && (_target.end.prev = this.end);
  }

  toString() {}

  get start() {
    return [...LinkedList.getPrevNodes(this.cursor, this.range[0])].slice(-1)[0];
  }

  get end() {
    return [...LinkedList.getNextNodes(this.cursor, this.range[1])].slice(-1)[0];
  }
}

export enum LinkedListNodePosition {
  BEFORE,
  AFTER,
}

export class LinkedList<T> extends Map<T, LinkedListNode<T>> {
  constructor() {
    super();
  }

  cut(cursor: T | LinkedListNode<T>, selectionRange: LinkedListRange = [0, 0]): LinkedListSelection<T> {
    if (this.has(cursor as T)) return new LinkedListSelection(this.get(cursor as T), selectionRange);
    else return new LinkedListSelection(cursor as LinkedListNode<T>, selectionRange);
  }

  copy(cursor: T, selectionRange: LinkedListRange = [0, 0]): LinkedListSelection<T> {
    const start = [...LinkedList.getPrevNodes(this.get(cursor), selectionRange[0])]
      .slice(1)
      .reverse()
      .map((x) => x.value);
    const end = [...LinkedList.getNextNodes(this.get(cursor), selectionRange[1])].map((x) => x.value);
    return LinkedList.fromArray([...start, ...end]).cut(cursor, selectionRange);
  }

  public static *getNextNodes<T>(node: LinkedListNode<T>, n?: number) {
    let current = node;
    yield node;
    let i = 0;
    while (current.next) {
      if (!current.next || (typeof n !== "undefined" && i == n)) {
        return current;
      } else {
        i++;
        yield (current = current.next);
      }
    }
    return current;
  }

  public static *getPrevNodes<T>(node: LinkedListNode<T>, n?: number) {
    let current = node;
    yield node;
    let i = 0;
    while (current.next) {
      if (!current.next || (typeof n !== "undefined" && i == n)) {
        return current;
      } else {
        i++;
        yield (current = current.next);
      }
    }
    return current;
  }

  get first() {
    return this.nodes[0];
  }

  get nodes() {
    return [...this.values()];
  }

  get asArray() {
    return [...this.values()].map((x) => x.value);
  }

  public static createLinkedListNode<T>(
    value: T,
    prev?: LinkedListNode<T>,
    next?: LinkedListNode<T>
  ): LinkedListNode<T> {
    return {
      value,
      prev: prev || null,
      next: next || null,
    };
  }
  public static fromArray<T>(array: T[], opts?: { closed: boolean }) {
    opts = { closed: false, ...opts };
    const list = new LinkedList<T>();
    for (let i = 0; i < array.length; i++) {
      list.set(array[i], LinkedList.createLinkedListNode(array[i]));
      if (i > 0) {
        list.get(array[i]).prev = list.get(array[i - 1]);
        list.get(array[i - 1]).next = list.get(array[i]);
      }
    }
    if (opts.closed) {
      list.get(array[0]).prev = list.get(array[array.length - 1]);
      list.get(array[array.length - 1]).next = list.get(array[0]);
    }
    return list;
  }
  public static fromTypedArray<T extends TypedArray>(array: T, opts?: { closed: boolean }) {
    opts = { closed: false, ...opts };
    const list = new LinkedList<number>();
    for (let i = 0; i < array.length; i++) {
      list.set(array[i], LinkedList.createLinkedListNode(array[i]));
      if (i > 0) {
        list.get(array[i]).prev = list.get(array[i - 1]);
        list.get(array[i - 1]).next = list.get(array[i]);
      }
    }
    if (opts.closed) {
      list.get(array[0]).prev = list.get(array[array.length - 1]);
      list.get(array[array.length - 1]).next = list.get(array[0]);
    }
    return list;
  }
  toString(joiner = ",", opts?: { max: number }) {
    const { max } = { max: 1000, ...opts };
    const arr = [...LinkedList.getNextNodes(this.first, max)].map((x) => x.value);
    return arr.join(joiner);
  }
}

function num(v: number) {
  return new Object(v);
}

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(num); //?

const list = LinkedList.fromArray(arr);

list.toString(" "); //?

list.copy(arr[1]).paste(list.get(arr[5]));

list.toString(" "); //?

list.cut(list.get(arr[1])).paste(list.get(arr[5]));

list.toString(" "); //?
