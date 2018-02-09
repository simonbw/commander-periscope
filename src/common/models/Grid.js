// A grid is the 2d arrangement of all the tiles in a game.
// Grid locations are Immutable.List of length 2 in the form [x, y]
// [0, 0] is the top left, or NorthWest corner of the map
// [1, 0] is one tile East of [0, 0], while [0, 1] is one tile South of [0, 0].

import Immutable from 'immutable/dist/immutable';
import { EAST, NORTH, SOUTH, WEST } from './Direction';

export const COLUMN_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ROW_LABELS = Immutable.Range(1, 16).toArray();
export const SECTOR_LABELS = Immutable.Range(1, 10).toArray();

export const WATER_TILE = 0;
export const LAND_TILE = 1;

export function getLocationFromDirection(location, direction) {
  const [x, y] = location.toArray();
  switch (direction) {
    case NORTH:
      return Immutable.List([x, y - 1]);
    case EAST:
      return Immutable.List([x + 1, y]);
    case SOUTH:
      return Immutable.List([x, y + 1]);
    case WEST:
      return Immutable.List([x - 1, y]);
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}

export function tileToSector(tile, gridSize) {
  if (!tile || !isInGrid(tile, gridSize)) {
    return null;
  }
  const col = Math.floor(tile.get(0) / 5); // TODO: Don't hardcode
  const row = Math.floor(tile.get(1) / 5); // TODO: Don't hardcode
  return 3 * row + col;
}

// Returns the direction from point a to b
export function getDirection(a, b) {
  if (b.get(1) < a.get(1)) {
    return NORTH;
  } else if (b.get(0) > a.get(0)) {
    return EAST;
  } else if (b.get(1) > a.get(1)) {
    return SOUTH;
  } else if (b.get(0) < a.get(0)) {
    return WEST;
  }
  // a == b
  return null;
}

// Return manhattan distance between two points
export function getManhattanDistance(a, b) {
  return Math.abs(a.get(0) - b.get(0)) + Math.abs(a.get(1) - b.get(1));
}

export function isAdjacent(a, b) {
  return !a.equals(b)
    && (Math.abs(a.get(0) - b.get(0)) <= 1)
    && (Math.abs(a.get(1) - b.get(1)) <= 1)
}

export function getLocationList(grid) {
  return grid.flatMap((column, x) => column.map((tile, y) => Immutable.List([x, y])))
}

export function getGridSize(grid = null) {
  if (grid == null) {
    return Immutable.List([15, 15]); // TODO: We shouldn't be using this anywhere
  }
  return Immutable.List([grid.size, grid.get(0).size]);
}

export const isInGrid = (location, gridSize) => (
  location.get(0) >= 0
  && location.get(1) >= 0
  && location.get(0) <= gridSize.get(0)
  && location.get(1) <= gridSize.get(1)
);
