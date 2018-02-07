// Explosion Results
import { isAdjacent } from './Grid';

export const DIRECT_HIT = 2;
export const INDIRECT_HIT = 1;
export const MISS = 0;

export function getExplosionResult(subLocation, explosionLocation) {
  if (subLocation.equals(explosionLocation)) {
    return DIRECT_HIT
  } else if (isAdjacent(subLocation, explosionLocation)) {
    return INDIRECT_HIT;
  } else {
    return MISS;
  }
}

export function getExplosionDamage(hitResult) {
  switch (hitResult) {
    case DIRECT_HIT:
      return 2;
    case INDIRECT_HIT:
      return 1;
    case MISS:
      return 0;
  }
}

export function getHitDisplayName(hitResult) {
  switch (hitResult) {
    case DIRECT_HIT:
      return 'Direct Hit';
    case INDIRECT_HIT:
      return 'Indirect Hit';
    case MISS:
      return 'Miss';
    default:
      throw new Error(`Invalid hitResult: ${hitResult}`);
  }
}