import styles from "../../../../styles/RadioOperatorPage.module.css";
import type { Grid, Notification, Team } from "../../../../shared/types";
import GridBackground from "../../grid/GridBackground";
import GridContainer from "../../grid/GridContainer";
import GridLabels from "../../grid/GridLabels";
import GridSectors from "../../grid/GridSectors";
import GridTiles from "../../grid/GridTiles";
import { useGame } from "../GameContext";
import NotificationList from "./NotificationList";

interface RadioOperatorPageProps {
  grid: Grid;
  notifications: Notification[];
  team: Team;
}

export const UnconnectedRadioOperatorPage = ({ grid, notifications, team }: RadioOperatorPageProps) => (
  <div id="radio-operator-page" className={styles.RadioOperatorPage}>
    <div className={styles.GridBox}>
      <GridContainer>
        <GridBackground height={15} width={15} /> {/* TODO: Don't hard code*/}
        <GridSectors />
        <GridTiles grid={grid} />
        <GridLabels height={15} width={15} />
      </GridContainer>
    </div>
    <NotificationList notifications={notifications} team={team} />
  </div>
);

const ConnectedRadioOperatorPage = () => {
  const game = useGame();
  return (
    <UnconnectedRadioOperatorPage grid={game.grid ?? []} notifications={game.notifications ?? []} team={game.team} />
  );
};

export default ConnectedRadioOperatorPage;
