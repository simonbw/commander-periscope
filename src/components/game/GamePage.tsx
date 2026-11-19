import { Fragment } from "react";
import { useNavigate } from "react-router";
import { ENDED_PHASE, LOADING_PHASE } from "../../../shared/gamePhase";
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from "../../../shared/role";
import type { GamePhase, Role, Team } from "../../../shared/types";
import { MENU_PATH } from "../../lib/routes";
import LoadingPage from "../LoadingPage";
import CaptainPage from "./CaptainPage";
import DamageFlash from "./DamageFlash";
import EngineerPage from "./EngineerPage";
import FirstMatePage from "./FirstMatePage";
import GameOverPage from "./GameOverPage";
import { useGame } from "./GameContext";
import RadioOperatorPage from "./RadioOperatorPage";
import SurfacedPage from "./SurfacedPage";

interface GamePageProps {
  gamePhase: GamePhase;
  goToMainMenu: () => void;
  role?: Role;
  surfaced: boolean;
  team?: Team;
  winner?: Team | null;
}

export const UnconnectedGamePage = ({ team, role, gamePhase, winner, surfaced, goToMainMenu }: GamePageProps) => {
  if (gamePhase === LOADING_PHASE) {
    return <LoadingPage />;
  } else if (gamePhase === ENDED_PHASE) {
    return <GameOverPage isWinner={team === winner} goToMainMenu={goToMainMenu} />;
  }

  if (surfaced) {
    return <SurfacedPage />;
  }

  return (
    <Fragment>
      <DamageFlash />
      {getRolePage(role)}
    </Fragment>
  );
};

const getRolePage = (role: Role | undefined) => {
  switch (role) {
    case CAPTAIN:
      return <CaptainPage />;
    case ENGINEER:
      return <EngineerPage />;
    case FIRST_MATE:
      return <FirstMatePage />;
    case RADIO_OPERATOR:
      return <RadioOperatorPage />;
    default:
      return (
        <div id="unknown-role-page">
          <span>Unknown role: "{role}"</span>
        </div>
      );
  }
};

const ConnectedGamePage = () => {
  const game = useGame();
  const navigate = useNavigate();
  return (
    <UnconnectedGamePage
      gamePhase={game.phase}
      // Leaving the lobby happens automatically when the lobby route unmounts.
      goToMainMenu={() => void navigate(MENU_PATH)}
      role={game.role}
      surfaced={game.surfaced}
      team={game.team}
      winner={game.winner}
    />
  );
};

export default ConnectedGamePage;
