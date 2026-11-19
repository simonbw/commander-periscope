import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import styles from "../../../../styles/CaptainPage.module.css";
import { getMineOptions, getMoveOptions, getSilentOptions, getTorpedoOptions } from "../../../../shared/gameUtils";
import type { Direction, GamePhase, Grid, Location, SystemName } from "../../../../shared/types";
import LoadingPage from "../../LoadingPage";
import { useGame, useGameAction } from "../GameContext";
import CaptainGridContainer from "./CaptainGridContainer";
import DetonateMineMode from "./DetonateMineMode";
import DroneMode from "./DroneMode";
import DropMineMode from "./DropMineMode";
import Messages from "./Messages";
import ModeWrapper, {
  DETONATE_MINE_MODE,
  DRONE_MODE,
  DROP_MINE_MODE,
  type Mode,
  MOVE_MODE,
  PICK_START_LOCATION_MODE,
  SILENT_MODE,
  TORPEDO_MODE,
} from "./ModeWrapper";
import MoveMode from "./MoveMode";
import SilentMode from "./SilentMode";
import StartLocationMode from "./StartLocationMode";
import SystemsPanel from "./SystemsPanel";
import TorpedoMode from "./TorpedoMode";

/**
 * A captain action. While the returned promise is pending, the grid ignores
 * further clicks; it should settle once the resulting game update has arrived.
 */
type Action<A> = (arg: A) => Promise<unknown> | void;

export interface CaptainContainerProps {
  detonateMine: Action<Location>;
  dropMine: Action<Location>;
  fireTorpedo: Action<Location>;
  gamePhase: GamePhase;
  goSilent: Action<Location>;
  grid: Grid;
  headInDirection: Action<Direction>;
  mines: Location[];
  setStartLocation: Action<Location>;
  subLocation?: Location | null;
  subPath: Location[];
  surface: () => Promise<unknown> | void;
  systems: Record<SystemName, boolean>;
  useDrone: Action<number>;
  useSonar: () => Promise<unknown> | void;
  waitingForEngineer: boolean;
  waitingForFirstMate: boolean;
}

export function UnconnectedCaptainContainer(props: CaptainContainerProps) {
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  // Wraps an action so that we wait for its response before accepting more input.
  const waitFor =
    <A,>(action: Action<A>) =>
    (arg: A) => {
      setWaitingForResponse(true);
      void Promise.resolve(action(arg))
        .catch(() => undefined)
        .finally(() => setWaitingForResponse(false));
    };

  const renderMode = (mode: Mode) => {
    const { mines, subLocation, grid, subPath: path } = props;
    switch (mode) {
      case DETONATE_MINE_MODE:
        return (
          <DetonateMineMode
            mines={mines}
            detonateMine={waitFor(props.detonateMine)}
            waitingForResponse={waitingForResponse}
          />
        );
      case DRONE_MODE:
        return <DroneMode useDrone={waitFor(props.useDrone)} waitingForResponse={waitingForResponse} />;
      case PICK_START_LOCATION_MODE:
        return (
          <StartLocationMode
            grid={grid}
            setStartLocation={waitFor(props.setStartLocation)}
            waitingForResponse={waitingForResponse}
          />
        );
    }
    // The remaining modes all act relative to the submarine.
    if (!subLocation) {
      return null;
    }
    switch (mode) {
      case DROP_MINE_MODE:
        return (
          <DropMineMode
            mineOptions={getMineOptions(subLocation, grid, path, mines)}
            dropMine={waitFor(props.dropMine)}
            waitingForResponse={waitingForResponse}
          />
        );
      case MOVE_MODE:
        return (
          <MoveMode
            moveOptions={getMoveOptions(subLocation, grid, path, mines)}
            headInDirection={waitFor(props.headInDirection)}
            subLocation={subLocation}
            waitingForPlayers={props.waitingForFirstMate || props.waitingForEngineer}
            waitingForResponse={waitingForResponse}
          />
        );
      case TORPEDO_MODE:
        return (
          <TorpedoMode
            torpedoOptions={getTorpedoOptions(subLocation, grid)}
            fireTorpedo={waitFor(props.fireTorpedo)}
            waitingForResponse={waitingForResponse}
          />
        );
      case SILENT_MODE:
        return (
          <SilentMode
            goSilent={waitFor(props.goSilent)}
            moveOptions={getSilentOptions(subLocation, grid, path, mines)}
            subLocation={subLocation}
            waitingForResponse={waitingForResponse}
          />
        );
    }
  };

  return (
    <ModeWrapper gamePhase={props.gamePhase} systemStatuses={props.systems} hasMines={props.mines.length > 0}>
      {({ mode, setMode }) => (
        <div id="captain-page" className={styles.CaptainPage}>
          <div className={styles.GridBox}>
            <CaptainGridContainer
              grid={props.grid}
              mines={props.mines}
              mode={mode}
              path={props.subPath}
              subLocation={props.subLocation}
            >
              {renderMode(mode)}
            </CaptainGridContainer>
          </div>

          <div className={styles.RightPane}>
            <Messages
              mode={mode}
              waitingForEngineer={props.waitingForEngineer}
              waitingForFirstMate={props.waitingForFirstMate}
            />

            <SystemsPanel
              mines={props.mines}
              mode={mode}
              setMode={setMode}
              surface={() => void props.surface()}
              systems={props.systems}
              useSonar={() => void props.useSonar()}
            />
          </div>
        </div>
      )}
    </ModeWrapper>
  );
}

const ConnectedCaptainContainer = () => {
  const game = useGame();
  const detonateMine = useGameAction(api.games.detonateMine);
  const dropMine = useGameAction(api.games.dropMine);
  const fireTorpedo = useGameAction(api.games.fireTorpedo);
  const goSilent = useGameAction(api.games.goSilent);
  const headInDirection = useGameAction(api.games.headInDirection);
  const setStartLocation = useGameAction(api.games.setStartLocation);
  const surface = useGameAction(api.games.surface);
  const useDrone = useGameAction(api.games.useDrone);
  const useSonar = useGameAction(api.games.useSonar);

  // The captain's view always carries these; guard for the type checker.
  if (!game.grid || !game.subPath || !game.mineLocations || !game.systemStatuses || !game.turnInfo) {
    return <LoadingPage />;
  }

  return (
    <UnconnectedCaptainContainer
      detonateMine={(location) => detonateMine({ location })}
      dropMine={(location) => dropMine({ location })}
      fireTorpedo={(target) => fireTorpedo({ target })}
      gamePhase={game.phase}
      goSilent={(destination) => goSilent({ destination })}
      grid={game.grid}
      headInDirection={(direction) => headInDirection({ direction })}
      mines={game.mineLocations}
      setStartLocation={(location) => setStartLocation({ location })}
      subLocation={game.subLocation}
      subPath={game.subPath}
      surface={() => surface({})}
      systems={game.systemStatuses}
      useDrone={(sector) => useDrone({ sector })}
      useSonar={() => useSonar({})}
      waitingForEngineer={game.turnInfo.waitingForEngineer}
      waitingForFirstMate={game.turnInfo.waitingForFirstMate}
    />
  );
};

export default ConnectedCaptainContainer;
