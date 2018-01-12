// A grid is the 2d arrangement of all the tiles in a game.
// Grid locations are Immutable.List of length 2 in the form [x, y]
// [0, 0] is the top left, or NorthWest corner of the map
// [1, 0] is one tile East of [0, 0], while [0, 1] is one tile South of [0, 0].

import Immutable from 'immutable';
import { EAST, NORTH, SOUTH, WEST } from './Direction';

export const WATER_TILE = 0;
export const LAND_TILE = 1;

export function getNewLocation(location, direction) {
  const [x, y] = location.toArray();
  switch (direction) {
    case NORTH:
      return Immutable.List([x, y - 1]);
    case SOUTH:
      return Immutable.List([x, y + 1]);
    case EAST:
      return Immutable.List([x + 1, y]);
    case WEST:
      return Immutable.List([x - 1, y]);
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}

// Return manhattan distance between two points
export function getManhattanDistance(a, b) {
  return Math.abs(a.get(0) - b.get(0)) + Math.abs(a.get(1) - b.get(1));
}

export function isAdjacent(a, b) {
  return !a.equals(b) && (Math.abs(a.get(0) - b.get(0)) <= 1) && (Math.abs(a.get(0) - b.get(0)) <= 1)
}
