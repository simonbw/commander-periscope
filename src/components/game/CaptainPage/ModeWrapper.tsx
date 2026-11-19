import { type ReactNode, useState } from "react";
import { PICK_PHASE } from "../../../../shared/gamePhase";
import { DRONE, MINE, SILENT, TORPEDO } from "../../../../shared/system";
import type { GamePhase, SystemName } from "../../../../shared/types";

// Modes
export const DRONE_MODE = "DRONE_MODE";
export const DROP_MINE_MODE = "DROP_MINE_MODE";
export const DETONATE_MINE_MODE = "DETONATE_MINE_MODE";
export const MOVE_MODE = "MOVE_MODE";
export const PICK_START_LOCATION_MODE = "PICK_START_LOCATION_MODE";
export const SILENT_MODE = "SILENT_MODE";
export const TORPEDO_MODE = "TORPEDO_MODE";

export type Mode =
  | typeof DRONE_MODE
  | typeof DROP_MINE_MODE
  | typeof DETONATE_MINE_MODE
  | typeof MOVE_MODE
  | typeof PICK_START_LOCATION_MODE
  | typeof SILENT_MODE
  | typeof TORPEDO_MODE;

function getRequiredSystem(mode: Mode): SystemName | null {
  switch (mode) {
    case DRONE_MODE:
      return DRONE;
    case DROP_MINE_MODE:
      return MINE;
    case SILENT_MODE:
      return SILENT;
    case TORPEDO_MODE:
      return TORPEDO;
    default:
      return null;
  }
}

interface ModeWrapperProps {
  children: (props: { mode: Mode; setMode: (mode: Mode) => void }) => ReactNode;
  gamePhase: GamePhase;
  hasMines: boolean;
  systemStatuses: Record<SystemName, boolean>;
}

// Keeps track of what mode the component is in
const ModeWrapper = ({ children, gamePhase, hasMines, systemStatuses }: ModeWrapperProps) => {
  const [targetMode, setTargetMode] = useState<Mode>(MOVE_MODE);

  // Fall back to moving when the current mode's system becomes unavailable
  // (e.g. it was just used) or there are no mines left to detonate.
  const requiredSystem = getRequiredSystem(targetMode);
  const unavailable =
    (requiredSystem != null && !systemStatuses[requiredSystem]) ||
    (targetMode === DETONATE_MINE_MODE && !hasMines);
  if (unavailable) {
    // Adjusting state during render (instead of componentWillReceiveProps).
    setTargetMode(MOVE_MODE);
  }

  const mode = gamePhase === PICK_PHASE ? PICK_START_LOCATION_MODE : unavailable ? MOVE_MODE : targetMode;
  return children({ mode, setMode: setTargetMode });
};

export default ModeWrapper;
