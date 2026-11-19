import { Button } from "@mui/material";
import { api } from "../../../convex/_generated/api";
import { useLobby, useLobbyAction } from "./LobbyContext";

export interface UnconnectedReadyButtonProps {
  canReady: boolean;
  isReady: boolean;
  ready: () => void;
  unready: () => void;
}

export const UnconnectedReadyButton = ({ canReady, isReady, ready, unready }: UnconnectedReadyButtonProps) => (
  <Button
    variant="contained"
    onClick={isReady ? unready : ready}
    id="ready-button"
    color={isReady ? "secondary" : "primary"}
    disabled={!canReady}
  >
    {isReady ? "Unready" : "Ready"}
  </Button>
);

const ConnectedReadyButton = () => {
  const lobby = useLobby();
  const readyUp = useLobbyAction(api.lobbies.readyUp);
  const unreadyUp = useLobbyAction(api.lobbies.unreadyUp);
  return (
    <UnconnectedReadyButton
      canReady={Boolean(lobby.teamAndRole)}
      isReady={lobby.isReady}
      ready={() => void readyUp({})}
      unready={() => void unreadyUp({})}
    />
  );
};

export default ConnectedReadyButton;
