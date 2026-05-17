// A grid is the 2d arrangement of all the tiles in a game.
// Locations are [x, y]. [0,0] is the NW corner; [1,0] is one tile East,
// [0,1] is one tile South. The grid is column-major: grid[x][y].

import { ALL_DIRECTIONS, EAST, NORTH, SOUTH, WEST } from "./direction";
import type { Direction, Grid, Location } from "./types";

export const COLUMN_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const ROW_LABELS: number[] = Array.from({ length: 15 }, (_, i) => i + 1);
export const SECTOR_LABELS: number[] = Array.from({ length: 9 }, (_, i) => i + 1);

export const WATER_TILE = 0;
export const LAND_TILE = 1;

/** Value equality for locations (plain arrays are not reference-equal). */
export function locEq(a: Location | null, b: Location | null): boolean {
  if (a == null || b == null) {
    return a === b;
  }
  return a[0] === b[0] && a[1] === b[1];
}

/** Whether `list` contains a location value-equal to `loc`. */
export function includesLocation(list: Location[], loc: Location): boolean {
  return list.some((l) => locEq(l, loc));
}

export function getLocationFromDirection(
  location: Location,
  direction: Direction,
): Location {
  const [x, y] = location;
  switch (direction) {
    case NORTH:
      return [x, y - 1];
    case EAST:
      return [x + 1, y];
    case SOUTH:
      return [x, y + 1];
    case WEST:
      return [x - 1, y];
  }
}

export function tileToSector(
  tile: Location | null,
  gridSize: Location,
): number | null {
  if (!tile || !isInGrid(tile, gridSize)) {
    return null;
  }
  const col = Math.floor(tile[0] / 5);
  const row = Math.floor(tile[1] / 5);
  return 3 * row + col;
}

/** The direction from point a to b, or null when a == b. */
export function getDirection(a: Location, b: Location): Direction | null {
  if (b[1] < a[1]) {
    return NORTH;
  } else if (b[0] > a[0]) {
    return EAST;
  } else if (b[1] > a[1]) {
    return SOUTH;
  } else if (b[0] < a[0]) {
    return WEST;
  }
  return null;
}

export function getManhattanDistance(a: Location, b: Location): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function isAdjacent(a: Location, b: Location): boolean {
  return (
    !locEq(a, b) &&
    Math.abs(a[0] - b[0]) <= 1 &&
    Math.abs(a[1] - b[1]) <= 1
  );
}

export function getAdjacent(tile: Location): Location[] {
  return ALL_DIRECTIONS.map((direction) =>
    getLocationFromDirection(tile, direction),
  );
}

export function getLocationList(grid: Grid): Location[] {
  const locations: Location[] = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      locations.push([x, y]);
    }
  }
  return locations;
}

export function getGridSize(grid?: Grid): Location {
  if (grid == null) {
    return [15, 15];
  }
  return [grid.length, grid[0].length];
}

// NOTE: this uses `<=`, matching the original (slightly permissive) bounds check.
export function isInGrid(location: Location, gridSize: Location): boolean {
  return (
    location[0] >= 0 &&
    location[1] >= 0 &&
    location[0] <= gridSize[0] &&
    location[1] <= gridSize[1]
  );
}

function tileAt(grid: Grid, [x, y]: Location): number | undefined {
  return grid[x]?.[y];
}

/** Flood-fill of water tiles reachable from `point` within `distance` steps. */
export function fillFromTile(
  grid: Grid,
  point: Location,
  distance: number,
): Location[] {
  const gridSize = getGridSize(grid);
  const result: Location[] = [];
  const visited = new Set<string>();
  const toVisit: Array<[Location, number]> = [[point, 0]];

  while (toVisit.length > 0) {
    const [p, d] = toVisit.shift()!;
    const key = `${p[0]},${p[1]}`;
    if (
      d <= distance &&
      isInGrid(p, gridSize) &&
      !visited.has(key) &&
      tileAt(grid, p) === WATER_TILE
    ) {
      visited.add(key);
      result.push(p);
      for (const adjacent of getAdjacent(p)) {
        toVisit.push([adjacent, d + 1]);
      }
    }
  }
  return result;
}
