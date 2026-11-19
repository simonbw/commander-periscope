import { Snackbar } from "@mui/material";
import { useConvexConnectionState } from "convex/react";
import styles from "../../styles/ConnectionWarner.module.css";

export const UnconnectedConnectionWarner = ({ connected }: { connected: boolean }) => (
  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    className={styles.ConnectionWarner}
    open={!connected}
    message={<span className={styles.Message}>Uh Oh! Disconnected!</span>}
  />
);

/**
 * Warns when the Convex websocket drops. Only after the first successful
 * connection, so it doesn't flash on page load (the old TODO).
 */
const ConnectionWarner = () => {
  const { isWebSocketConnected, hasEverConnected } = useConvexConnectionState();
  return <UnconnectedConnectionWarner connected={isWebSocketConnected || !hasEverConnected} />;
};

export default ConnectionWarner;
