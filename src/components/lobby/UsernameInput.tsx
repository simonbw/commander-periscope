import { Paper, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import styles from "../../../styles/CustomLobbyPage.module.css";
import { getSavedUsername, saveUsername } from "../../lib/username";
import { useLobby, useLobbyAction } from "./LobbyContext";

const DEBOUNCE_MS = 200;

export interface UnconnectedUsernameInputProps {
  /** The initial value. */
  savedUsername?: string;
  setUsername: (username: string) => void;
}

export const UnconnectedUsernameInput = ({ savedUsername, setUsername }: UnconnectedUsernameInputProps) => {
  const [value, setValue] = useState(savedUsername ?? "");
  return (
    <Paper className={styles.UsernamePaper}>
      <TextField
        fullWidth
        label="Your Name"
        onChange={(event) => {
          setValue(event.target.value);
          setUsername(event.target.value);
        }}
        placeholder="Anonymous"
        value={value}
        variant="standard"
      />
    </Paper>
  );
};

const ConnectedUsernameInput = () => {
  const lobby = useLobby();
  const setLobbyUsername = useLobbyAction(api.lobbies.setLobbyUsername);

  // Remember locally right away, tell the server once typing pauses.
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <UnconnectedUsernameInput
      savedUsername={lobby.username ?? getSavedUsername()}
      setUsername={(username) => {
        saveUsername(username);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => void setLobbyUsername({ username }), DEBOUNCE_MS);
      }}
    />
  );
};

export default ConnectedUsernameInput;
