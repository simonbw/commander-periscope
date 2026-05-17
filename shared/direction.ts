import type { Direction } from "./types";

export const NORTH = "NORTH" satisfies Direction;
export const EAST = "EAST" satisfies Direction;
export const SOUTH = "SOUTH" satisfies Direction;
export const WEST = "WEST" satisfies Direction;

export const ALL_DIRECTIONS: Direction[] = [NORTH, EAST, SOUTH, WEST];

export function getDirectionArrow(direction: Direction): string {
  switch (direction) {
    case NORTH:
      return "↑";
    case EAST:
      return "→";
    case SOUTH:
      return "↓";
    case WEST:
      return "←";
  }
}

export function directionToAngle(direction: Direction): number {
  switch (direction) {
    case NORTH:
      return 0;
    case EAST:
      return 90;
    case SOUTH:
      return 180;
    case WEST:
      return 270;
  }
}
