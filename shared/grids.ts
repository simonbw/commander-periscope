import { LAND_TILE, WATER_TILE } from "./grid";
import type { Grid, Location } from "./types";

/** A 15x15 grid of all water. grid[x][y]. */
export function createEmptyGrid(): Grid {
  return Array.from({ length: 15 }, () => Array<number>(15).fill(WATER_TILE));
}

function withLand(land: Location[]): Grid {
  const grid = createEmptyGrid();
  for (const [x, y] of land) {
    grid[x][y] = LAND_TILE;
  }
  return grid;
}

export function createAlphaGrid(): Grid {
  return withLand([
    [2, 1], [2, 2],
    [6, 1], [8, 2], [8, 3],
    [12, 1], [12, 2], [13, 1],
    [1, 5], [1, 6], [3, 5], [3, 6], [3, 7],
    [6, 6], [6, 7], [7, 8], [8, 6],
    [11, 8], [12, 8], [13, 8],
    [0, 12], [2, 11], [2, 13], [3, 10], [3, 14],
    [6, 13], [7, 11], [8, 13],
    [11, 11], [12, 12], [13, 13],
  ]);
}

export function createBravoGrid(): Grid {
  return withLand([
    [2, 1], [2, 2],
    [8, 2], [8, 3],
    [12, 1], [13, 1],
    [3, 7], [3, 8],
    [11, 8], [11, 9],
    [2, 11], [3, 10],
    [7, 11], [8, 13],
    [11, 11],
  ]);
}

export function createCharlieGrid(): Grid {
  return withLand([
    [5, 2], [5, 3],
    [11, 4], [12, 3],
    [3, 7],
    [7, 9], [8, 7], [8, 8], [8, 9],
    [3, 12], [4, 13],
  ]);
}

export const ALL_GRIDS = [createAlphaGrid, createBravoGrid, createCharlieGrid];
