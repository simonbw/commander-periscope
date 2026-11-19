import { Forward } from "@mui/icons-material";
import {
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getLobbyCodeErrors } from "../../../shared/validation";
import styles from "../../../styles/MainMenu.module.css";

const TIMEOUT = 140;

/** Lobby codes are trimmed before use, so don't complain about whitespace. */
const getErrors = (lobbyCode: string) => getLobbyCodeErrors(lobbyCode.trim());

export interface JoinCustomGameInputProps {
  joinCustomLobby: (lobbyCode: string) => void;
}

export const JoinCustomGameInput = ({ joinCustomLobby }: JoinCustomGameInputProps) => {
  const [lobbyCode, setLobbyCode] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The blur handler checks the error after a delay, so it needs the latest value.
  const errorRef = useRef(error);
  useEffect(() => {
    errorRef.current = error;
  }, [error]);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);
  const later = (f: () => void, ms: number) => {
    timeouts.current.push(setTimeout(f, ms));
  };

  const submit = () => {
    const newError = getErrors(lobbyCode);
    if (newError) {
      setError(newError);
    } else {
      joinCustomLobby(lobbyCode);
    }
  };

  const onChange = (value: string) => {
    setLobbyCode(value);
    // keep showing the error until it goes away
    if (error && error !== getErrors(value)) {
      setError(null);
    }
  };

  const renderClosed = () => (
    <Button
      id="join-custom-game-button"
      name="Join Lobby Button"
      onClick={() => {
        setOpen(true);
        setError(null);
        later(() => inputRef.current?.focus(), TIMEOUT);
      }}
      fullWidth
      disabled={open}
    >
      Join Lobby
    </Button>
  );

  const renderOpen = () => (
    <form
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          event.preventDefault();
        }
      }}
      onBlur={() => {
        if (!lobbyCode) {
          later(() => {
            if (!errorRef.current) {
              setOpen(false);
            }
          }, 10);
        }
      }}
    >
      <FormControl fullWidth>
        <InputLabel htmlFor="custom-game-input">Lobby Code</InputLabel>
        <Input
          autoComplete="off"
          disabled={!open}
          error={Boolean(error)}
          fullWidth
          id="custom-game-input"
          name="Lobby Id Input"
          onChange={(event) => onChange(event.target.value)}
          inputRef={inputRef}
          spellCheck={false}
          value={lobbyCode}
          endAdornment={
            <InputAdornment position="end">
              <IconButton type="submit" disabled={Boolean(error) || !open} color="primary">
                <Tooltip title="Join Lobby" enterDelay={300} placement="left">
                  <Forward />
                </Tooltip>
              </IconButton>
            </InputAdornment>
          }
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </form>
  );

  return (
    <Paper className={styles.JoinCustomGameInput}>
      <Collapse in={!open} timeout={TIMEOUT}>
        {renderClosed()}
      </Collapse>
      <Collapse in={open} timeout={TIMEOUT}>
        {renderOpen()}
      </Collapse>
    </Paper>
  );
};
