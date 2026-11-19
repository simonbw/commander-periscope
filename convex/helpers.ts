import { ConvexError, v } from "convex/values";
import { getTeamAndRole } from "../shared/gameUtils";
import type { Game, Role, Team } from "../shared/types";
import type { Doc } from "./_generated/dataModel";

/**
 * Players identify themselves with a client-generated id passed as an
 * argument (see docs/convex-migration-plan.md §6). This is as trustworthy as
 * the old userId cookie was — fine for a friends-and-family game.
 */
export const playerIdArg = v.string();

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
    throw new ConvexError(`Player is not the ${role} in this game`);
  }
  return position.team;
}
