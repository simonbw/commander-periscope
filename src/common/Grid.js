import { EAST, NORTH, SOUTH, WEST } from './Direction';
import { createList } from './util/ImmutableUtil';

export const WATER_TILE = 0;
export const LAND_TILE = 1;

export const ALL_TILES = [WATER_TILE, LAND_TILE];

export const TILE_NAMES = {
  [WATER_TILE]: 'water'
};

export function createGrid() {
  // TODO: real map creation
  return createList(15, createList(15, WATER_TILE));
}

export const getNewLocation = (location, direction) => {
  // TODO: Finish this
  switch (direction) {
    case NORTH:
      return location;
    case SOUTH:
      return location;
    case EAST:
      return location;
    case WEST:
      return location;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
};
