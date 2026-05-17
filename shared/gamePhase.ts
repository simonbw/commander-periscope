import type { GamePhase } from "./types";

export const LOADING_PHASE = 0 satisfies GamePhase;
export const PICK_PHASE = 1 satisfies GamePhase;
export const MAIN_PHASE = 2 satisfies GamePhase;
export const ENDED_PHASE = 3 satisfies GamePhase;

export const ALL_PHASES: GamePhase[] = [
  LOADING_PHASE,
  PICK_PHASE,
  MAIN_PHASE,
  ENDED_PHASE,
];
