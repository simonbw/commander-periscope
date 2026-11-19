import { useConvex, useQuery } from "convex/react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useReportError } from "../components/ErrorReporter";
import DebugPane from "../components/DebugPane";
import { GameProvider, useGame } from "../components/game/GameContext";
import GamePage from "../components/game/GamePage";
import LoadingPage from "../components/LoadingPage";
import { LobbyProvider } from "../components/lobby/LobbyContext";
import CustomLobbyPage from "../components/lobby/CustomLobbyPage";
import MessagePage from "../components/MessagePage";
import { getPlayerId } from "../lib/playerId";
import { normalizeLobbyCode } from "../lib/routes";
import { getSavedUsername } from "../lib/username";

/**
 * `/lobby/:code`. Joins the lobby on arrival, leaves it on the way out
 * (unmount or tab close — see docs/convex-migration-plan.md §7.4), and shows
 * the lobby or, once it has started, the game.
 */
export default function LobbyRoute() {
  const code = normalizeLobbyCode(useParams().code ?? "");
  const convex = useConvex();
  const reportError = useReportError();
  const lobby = useQuery(api.lobbies.getLobby, { code, playerId: getPlayerId() });
  const exists = lobby != null;

  useEffect(() => {
    if (!exists) {
      return;
    }
    const playerId = getPlayerId();
    convex
      .mutation(api.lobbies.joinLobby, { code, playerId, username: getSavedUsername() })
      .catch(reportError);

    // Best effort: a missed leave is cleaned up by the GC cron.
    const leave = () => void convex.mutation(api.lobbies.leaveLobby, { code, playerId }).catch(() => {});
    window.addEventListener("pagehide", leave);
    return () => {
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, [convex, code, exists, reportError]);

  if (lobby === undefined) {
    return <LoadingPage />;
  }
  if (lobby === null) {
    return <MessagePage title="Lobby not found" body={`There's no lobby with the code ${code}.`} />;
  }
  return (
    <LobbyProvider lobby={lobby}>
      {lobby.gameId ? (
        <GameProvider gameId={lobby.gameId as Id<"games">}>
          {import.meta.env.DEV && <GameDebugPane />}
          <GamePage />
        </GameProvider>
      ) : (
        <>
          {import.meta.env.DEV && <DebugPane data={{ lobby }} />}
          <CustomLobbyPage />
        </>
      )}
    </LobbyProvider>
  );
}

/** Dev-only state inspector (replaces the old statty DebugPane). */
function GameDebugPane() {
  return <DebugPane data={{ game: useGame() }} />;
}
