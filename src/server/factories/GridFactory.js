import Immutable from 'immutable/dist/immutable';
import { LAND_TILE, WATER_TILE } from '../../common/Grid';

export function createEmptyGrid() {
  return Immutable.Repeat(Immutable.Repeat(WATER_TILE, 15).toList(), 15).toList();
}

export function createAlphaGrid() {
  return createEmptyGrid()
    .setIn([2, 1], LAND_TILE) // sector 1
    .setIn([2, 2], LAND_TILE)
    .setIn([6, 1], LAND_TILE) // sector 2
    .setIn([8, 2], LAND_TILE)
    .setIn([8, 3], LAND_TILE)
    .setIn([12, 1], LAND_TILE) // sector 3
    .setIn([12, 2], LAND_TILE)
    .setIn([13, 1], LAND_TILE)
    .setIn([1, 5], LAND_TILE) // sector 4
    .setIn([1, 6], LAND_TILE)
    .setIn([3, 5], LAND_TILE)
    .setIn([3, 6], LAND_TILE)
    .setIn([3, 7], LAND_TILE)
    .setIn([6, 6], LAND_TILE) // sector 5
    .setIn([6, 7], LAND_TILE)
    .setIn([7, 8], LAND_TILE)
    .setIn([8, 6], LAND_TILE)
    .setIn([11, 8], LAND_TILE) // sector 6
    .setIn([12, 8], LAND_TILE)
    .setIn([13, 8], LAND_TILE)
    .setIn([0, 12], LAND_TILE) // sector 7
    .setIn([2, 11], LAND_TILE)
    .setIn([2, 13], LAND_TILE)
    .setIn([3, 10], LAND_TILE)
    .setIn([3, 14], LAND_TILE)
    .setIn([6, 13], LAND_TILE) // sector 8
    .setIn([7, 11], LAND_TILE)
    .setIn([8, 13], LAND_TILE)
    .setIn([11, 11], LAND_TILE) // sector 9
    .setIn([12, 12], LAND_TILE)
    .setIn([13, 13], LAND_TILE)
}

export function createBravoGrid() {
  return createEmptyGrid()
    .setIn([2, 1], LAND_TILE) // sector 1
    .setIn([2, 2], LAND_TILE)
    .setIn([8, 2], LAND_TILE) // sector 2
    .setIn([8, 3], LAND_TILE)
    .setIn([12, 1], LAND_TILE) // sector 3
    .setIn([13, 1], LAND_TILE)
    .setIn([3, 7], LAND_TILE) // sector 4
    .setIn([3, 8], LAND_TILE)
    .setIn([11, 8], LAND_TILE) // sector 6
    .setIn([11, 9], LAND_TILE)
    .setIn([2, 11], LAND_TILE) // sector 7
    .setIn([3, 10], LAND_TILE)
    .setIn([7, 11], LAND_TILE) // sector 8
    .setIn([8, 13], LAND_TILE)
    .setIn([11, 11], LAND_TILE) // sector 9
}

export function createCharlieGrid() {
  return createEmptyGrid()
    .setIn([5, 2], LAND_TILE)// sector 2
    .setIn([5, 3], LAND_TILE)
    .setIn([11, 4], LAND_TILE)// sector 3
    .setIn([12, 3], LAND_TILE)
    .setIn([3, 7], LAND_TILE) // sector 4
    .setIn([7, 9], LAND_TILE) // sector 5
    .setIn([8, 7], LAND_TILE)
    .setIn([8, 8], LAND_TILE)
    .setIn([8, 9], LAND_TILE)
    .setIn([3, 12], LAND_TILE) // sector 7
    .setIn([4, 13], LAND_TILE)
}