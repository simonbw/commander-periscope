import { getAuthUserId } from "@convex-dev/auth/server";
import { getTeamAndRole } from "../shared/gameUtils";
import type { Game, Role, Team } from "../shared/types";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

/** The authenticated player's id, or throws if the request is unauthenticated. */
export async function requirePlayer(ctx: QueryCtx | MutationCtx): Promise<string> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

/**
 * A Convex game document carries `_id`/`_creationTime`; the shared game logic
 * works on the plain Game shape. The fields line up, so this is a safe view.
 */
export function asGame(doc: Doc<"games">): Game {
  return doc as unknown as Game;
}

/** Assert the player holds `role`, returning the team they play for. */
export function requireTeam(
  game: Game,
  playerId: string,
  role: Role,
): Team {
  const position = getTeamAndRole(game.teams, playerId);
  if (!position || position.role !== role) {
    throw new Error(`Player is not the ${role} in this game`);
  }
  return position.team;
}
