import { describe, expect, it } from "vitest";
import { EAST, NORTH, SOUTH, WEST } from "./direction";
import {
  getDirection,
  getLocationFromDirection,
  getLocationList,
  getManhattanDistance,
  isAdjacent,
} from "./grid";
import { createEmptyGrid } from "./grids";

describe("grid", () => {
  it("getLocationFromDirection", () => {
    expect(getLocationFromDirection([5, 5], NORTH)).toEqual([5, 4]);
    expect(getLocationFromDirection([5, 5], SOUTH)).toEqual([5, 6]);
    expect(getLocationFromDirection([5, 5], EAST)).toEqual([6, 5]);
    expect(getLocationFromDirection([5, 5], WEST)).toEqual([4, 5]);
  });

  it("getDirection", () => {
    expect(getDirection([5, 5], [9, 5])).toBe(EAST);
    expect(getDirection([5, 5], [5, 6])).toBe(SOUTH);
    expect(getDirection([5, 5], [5, 1])).toBe(NORTH);
    expect(getDirection([5, 5], [2, 5])).toBe(WEST);
    expect(getDirection([5, 5], [5, 5])).toBe(null);
  });

  it("getManhattanDistance", () => {
    expect(getManhattanDistance([5, 5], [5, 5])).toBe(0);
    expect(getManhattanDistance([1, 1], [3, 1])).toBe(2);
    expect(getManhattanDistance([1, 1], [1, 3])).toBe(2);
    expect(getManhattanDistance([1, 1], [3, 3])).toBe(4);
  });

  it("isAdjacent", () => {
    expect(isAdjacent([1, 1], [3, 3])).toBe(false);
    expect(isAdjacent([1, 1], [1, 3])).toBe(false);
    expect(isAdjacent([1, 1], [3, 1])).toBe(false);
    expect(isAdjacent([1, 1], [1, 1])).toBe(false);

    expect(isAdjacent([1, 1], [1, 2])).toBe(true);
    expect(isAdjacent([1, 1], [2, 1])).toBe(true);
    expect(isAdjacent([1, 1], [2, 2])).toBe(true);
  });

  it("getLocationList", () => {
    expect(getLocationList(createEmptyGrid())).toHaveLength(15 * 15);
  });
});
