import { useMutation, useQuery } from "convex/react";
import type { FunctionArgs, FunctionReference } from "convex/server";
import { createContext, type ReactNode, useCallback, useContext } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { PlayerGameView } from "../../../shared/transforms";
import { getPlayerId } from "../../lib/playerId";
import { useReportError } from "../ErrorReporter";
import LoadingPage from "../LoadingPage";
import MessagePage from "../MessagePage";

interface GameContextValue {
  gameId: Id<"games">;
  game: PlayerGameView;
}

const GameContext = createContext<GameContextValue | null>(null);

/**
 * Subscribes to the player's view of a game and provides it to everything
 * below. Replaces the old GAME_UPDATED socket handler + statty state: Convex
 * re-runs the query and re-renders on every change to the game.
 */
export function GameProvider({ gameId, children }: { gameId: Id<"games">; children: ReactNode }) {
  const result = useQuery(api.games.getGame, { gameId, playerId: getPlayerId() });
  if (result === undefined) {
    return <LoadingPage />;
  }
  if (result === null) {
    return <MessagePage title="Game not found" />;
  }
  if (result.notInGame) {
    return <MessagePage title="Game in progress" body="This lobby's game has already started without you." />;
  }
  return <GameContext.Provider value={{ gameId, game: result.view }}>{children}</GameContext.Provider>;
}

function useGameContext(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) {
    throw new Error("useGame must be used inside a <GameProvider>");
  }
  return value;
}

/** The current player's (role-filtered) view of the game. */
export function useGame(): PlayerGameView {
  return useGameContext().game;
}

type GameMutation = FunctionReference<"mutation", "public", { gameId: Id<"games">; playerId: string }>;
export type GameActionArgs<M extends GameMutation> = Omit<FunctionArgs<M>, "gameId" | "playerId">;

/**
 * A game mutation with `gameId` and `playerId` filled in. Failures are shown
 * to the player; the returned promise resolves to whether it succeeded, and
 * only once the resulting game update has reached `useGame()`.
 *
 *     const fireTorpedo = useGameAction(api.games.fireTorpedo);
 *     await fireTorpedo({ target: [3, 4] });
 */
export function useGameAction<M extends GameMutation>(
  mutation: M,
): (args: GameActionArgs<M>) => Promise<boolean> {
  // Cast: TS can't resolve OptionalRestArgs for a generic M.
  const mutate = useMutation(mutation) as unknown as (args: FunctionArgs<M>) => Promise<unknown>;
  const { gameId } = useGameContext();
  const reportError = useReportError();
  return useCallback(
    async (args) => {
      try {
        await mutate({ ...args, gameId, playerId: getPlayerId() } as FunctionArgs<M>);
        return true;
      } catch (error) {
        reportError(error);
        return false;
      }
    },
    [mutate, gameId, reportError],
  );
}
