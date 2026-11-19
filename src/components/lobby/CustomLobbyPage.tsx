import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { BLUE, RED } from "../../../shared/team";
import type { PlayerLobbyView } from "../../../shared/transforms";
import type { Role, Team } from "../../../shared/types";
import styles from "../../../styles/CustomLobbyPage.module.css";
import { MENU_PATH } from "../../lib/routes";
import FloatingText from "../FloatingText";
import { useLobby, useLobbyAction } from "./LobbyContext";
import ReadyButton from "./ReadyButton";
import RoleSelect from "./RoleSelect";
import UsernameInput from "./UsernameInput";

export interface UnconnectedCustomLobbyPageProps {
  goToMainMenu: () => void;
  lobbyCode: string;
  selectRole: (role: Role | null, team: Team | null) => void;
  teams: PlayerLobbyView["teams"];
}

export const UnconnectedCustomLobbyPage = ({
  goToMainMenu,
  lobbyCode,
  selectRole,
  teams,
}: UnconnectedCustomLobbyPageProps) => (
  <div className={styles.CustomLobbyPage} id="custom-lobby-page">
    <FloatingText>
      <h1>
        Lobby Code: <span className={styles.LobbyId}>{lobbyCode}</span>
      </h1>
    </FloatingText>
    <UsernameInput />
    <div className={styles.RoleSelectContainer}>
      <RoleSelect players={teams[RED]} selectRole={selectRole} team={RED} />
      <RoleSelect players={teams[BLUE]} selectRole={selectRole} team={BLUE} />
    </div>
    <div className={styles.ButtonBar}>
      <Button variant="contained" onClick={goToMainMenu}>
        Main Menu
      </Button>
      <ReadyButton />
    </div>
  </div>
);

const ConnectedCustomLobbyPage = () => {
  const lobby = useLobby();
  const navigate = useNavigate();
  const selectRole = useLobbyAction(api.lobbies.selectRole);
  return (
    <UnconnectedCustomLobbyPage
      // Leaving the lobby happens when LobbyRoute unmounts.
      goToMainMenu={() => navigate(MENU_PATH)}
      lobbyCode={lobby.code}
      selectRole={(role, team) => void selectRole({ role, team })}
      teams={lobby.teams}
    />
  );
};

export default ConnectedCustomLobbyPage;
