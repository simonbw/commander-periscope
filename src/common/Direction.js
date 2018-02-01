export const NORTH = 'NORTH';
export const EAST = 'EAST';
export const SOUTH = 'SOUTH';
export const WEST = 'WEST';
export const ALL_DIRECTIONS = [NORTH, EAST, SOUTH, WEST];

export function getDirectionArrow(direction) {
  switch (direction) {
    case NORTH:
      return '↑';
    case EAST:
      return '→';
    case SOUTH:
      return '↓';
    case WEST:
      return '←';
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}

export function directionToAngle(direction) {
  switch (direction) {
    case NORTH:
      return 0;
    case EAST:
      return 90;
    case SOUTH:
      return 180;
    case WEST:
      return 270;
    default:
      return 45;
  }
}