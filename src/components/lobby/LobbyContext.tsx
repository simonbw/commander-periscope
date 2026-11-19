import { useMutation } from "convex/react";
import type { FunctionArgs, FunctionReference } from "convex/server";
import { createContext, type ReactNode, useCallback, useContext } from "react";
import type { PlayerLobbyView } from "../../../shared/transforms";
import { getPlayerId } from "../../lib/playerId";
import { useReportError } from "../ErrorReporter";

const LobbyContext = createContext<PlayerLobbyView | null>(null);

/** Provides an already-loaded lobby view (see routes/LobbyRoute.tsx). */
export function LobbyProvider({ lobby, children }: { lobby: PlayerLobbyView; children: ReactNode }) {
  return <LobbyContext.Provider value={lobby}>{children}</LobbyContext.Provider>;
}

/** The current player's view of the lobby they're in. */
export function useLobby(): PlayerLobbyView {
  const value = useContext(LobbyContext);
  if (!value) {
    throw new Error("useLobby must be used inside a <LobbyProvider>");
  }
  return value;
}

type LobbyMutation = FunctionReference<"mutation", "public", { code: string; playerId: string }>;
export type LobbyActionArgs<M extends LobbyMutation> = Omit<FunctionArgs<M>, "code" | "playerId">;

/** A lobby mutation with `code` and `playerId` filled in; errors are shown. */
export function useLobbyAction<M extends LobbyMutation>(
  mutation: M,
): (args: LobbyActionArgs<M>) => Promise<boolean> {
  // Cast: TS can't resolve OptionalRestArgs for a generic M.
  const mutate = useMutation(mutation) as unknown as (args: FunctionArgs<M>) => Promise<unknown>;
  const { code } = useLobby();
  const reportError = useReportError();
  return useCallback(
    async (args) => {
      try {
        await mutate({ ...args, code, playerId: getPlayerId() } as FunctionArgs<M>);
        return true;
      } catch (error) {
        reportError(error);
        return false;
      }
    },
    [mutate, code, reportError],
  );
}
