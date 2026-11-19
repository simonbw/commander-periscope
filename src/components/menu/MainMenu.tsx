import { Comment } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import styles from "../../../styles/MainMenu.module.css";
import { getPlayerId } from "../../lib/playerId";
import { lobbyPath, normalizeLobbyCode } from "../../lib/routes";
import { getSavedUsername } from "../../lib/username";
import { useReportError } from "../ErrorReporter";
import FloatingText from "../FloatingText";
import GithubIcon from "../icons/GithubIcon";
import HowToPlay from "./HowToPlay";
import { JoinCustomGameInput } from "./JoinCustomGameInput";

export interface UnconnectedMainMenuProps {
  createCustomLobby: () => void;
  joinCustomLobby: (lobbyCode: string) => void;
  /** True while a lobby is being created. */
  creatingLobby?: boolean;
}

export const UnconnectedMainMenu = ({
  createCustomLobby,
  joinCustomLobby,
  creatingLobby = false,
}: UnconnectedMainMenuProps) => (
  <div className={styles.MainMenu}>
    <FloatingText>
      <h1>Commander Periscope</h1>
    </FloatingText>

    <Button
      disabled={creatingLobby}
      fullWidth
      id="create-custom-game-button"
      name="Create Lobby Button"
      onClick={createCustomLobby}
      variant="contained"
    >
      Create Lobby
    </Button>

    <JoinCustomGameInput joinCustomLobby={joinCustomLobby} />

    <HowToPlay />

    {/* `name` isn't in React's <a> typings (deprecated HTML) but the old markup set it. */}
    <FloatingText className={styles.Footer}>
      <Tooltip title="Leave Feedback">
        <a {...{ name: "Feedback Link" }} href="https://goo.gl/forms/WfwLe3GRFqXG8NUo1">
          <Comment />
        </a>
      </Tooltip>{" "}
      <Tooltip title="Github">
        <a {...{ name: "Github Link" }} href="https://github.com/simonbw/commander-periscope">
          <GithubIcon />
        </a>
      </Tooltip>
    </FloatingText>
  </div>
);

const ConnectedMainMenu = () => {
  const navigate = useNavigate();
  const reportError = useReportError();
  const createLobby = useMutation(api.lobbies.createLobby);
  const [creatingLobby, setCreatingLobby] = useState(false);

  return (
    <UnconnectedMainMenu
      creatingLobby={creatingLobby}
      createCustomLobby={async () => {
        setCreatingLobby(true);
        try {
          const code = await createLobby({ playerId: getPlayerId(), username: getSavedUsername() });
          navigate(lobbyPath(code));
        } catch (error) {
          reportError(error);
          setCreatingLobby(false);
        }
      }}
      joinCustomLobby={(lobbyCode) => navigate(lobbyPath(normalizeLobbyCode(lobbyCode)))}
    />
  );
};

export default ConnectedMainMenu;
