import { api } from "../../../../convex/_generated/api";
import styles from "../../../../styles/EngineerPage.module.css";
import { ALL_DIRECTIONS } from "../../../../shared/direction";
import type { Direction, Subsystem } from "../../../../shared/types";
import { useGame, useGameAction } from "../GameContext";
import DirectionPane from "./DirectionPane";

interface EngineerPageProps {
  breakdowns: number[];
  directionMoved: Direction | null;
  readyToTrack: boolean;
  subsystems: Subsystem[];
  trackBreakdown: (breakdownIndex: number) => void;
}

export const UnconnectedEngineerPage = ({
  subsystems,
  breakdowns,
  directionMoved,
  trackBreakdown,
  readyToTrack,
}: EngineerPageProps) => (
  <div id="engineer-page" className={styles.EngineerPage}>
    <div className={styles.DirectionPanels}>
      {ALL_DIRECTIONS.map((direction) => (
        <DirectionPane
          active={readyToTrack && direction === directionMoved}
          breakdowns={breakdowns}
          direction={direction}
          key={direction}
          subsystems={subsystems.filter((s) => s.direction === direction)}
          trackBreakdown={trackBreakdown}
        />
      ))}
    </div>
  </div>
);

const ConnectedEngineerPage = () => {
  const game = useGame();
  const trackBreakdown = useGameAction(api.games.trackBreakdown);
  return (
    <UnconnectedEngineerPage
      trackBreakdown={(breakdownIndex) => void trackBreakdown({ breakdownIndex })}
      breakdowns={game.breakdowns ?? []}
      directionMoved={game.lastDirectionMoved ?? null}
      readyToTrack={game.waitingForEngineer ?? false}
      subsystems={game.subsystems ?? []}
    />
  );
};

export default ConnectedEngineerPage;
