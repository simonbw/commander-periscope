import { isAdjacent, locEq } from "./grid";
import type { HitResult, Location } from "./types";

export const MISS = 0 satisfies HitResult;
export const INDIRECT_HIT = 1 satisfies HitResult;
export const DIRECT_HIT = 2 satisfies HitResult;

export function getExplosionResult(
  subLocation: Location,
  explosionLocation: Location,
): HitResult {
  if (locEq(subLocation, explosionLocation)) {
    return DIRECT_HIT;
  } else if (isAdjacent(subLocation, explosionLocation)) {
    return INDIRECT_HIT;
  } else {
    return MISS;
  }
}

export function getExplosionDamage(hitResult: HitResult): number {
  switch (hitResult) {
    case DIRECT_HIT:
      return 2;
    case INDIRECT_HIT:
      return 1;
    case MISS:
      return 0;
  }
}

export function getHitDisplayName(hitResult: HitResult): string {
  switch (hitResult) {
    case DIRECT_HIT:
      return "Direct Hit";
    case INDIRECT_HIT:
      return "Indirect Hit";
    case MISS:
      return "Miss";
  }
}
