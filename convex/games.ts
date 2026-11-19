import { ConvexError, v } from "convex/values";
import { SURFACE_DURATION } from "../shared/constants";
import * as logic from "../shared/gameLogic";
import { CAPTAIN, ENGINEER, FIRST_MATE } from "../shared/role";
import { getTeamAndRole } from "../shared/gameUtils";
import { transformGameForPlayer } from "../shared/transforms";
import type { Game, Location } from "../shared/types";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  type MutationCtx,
  query,
  type QueryCtx,
} from "./_generated/server";
import { asGame, playerIdArg, requireTeam } from "./helpers";

const directionArg = v.union(
  v.literal("NORTH"),
  v.literal("EAST"),
  v.literal("SOUTH"),
  v.literal("WEST"),
);
const systemNameArg = v.union(
  v.literal("mine"),
  v.literal("torpedo"),
  v.literal("drone"),
  v.literal("sonar"),
  v.literal("silent"),
);
const teamArg = v.union(v.literal("red"), v.literal("blue"));
const locationArg = v.array(v.number());

async function loadGame(
  ctx: QueryCtx | MutationCtx,
  gameId: Id<"games">,
): Promise<Game> {
  const doc = await ctx.db.get(gameId);
  if (!doc) {
    throw new ConvexError("Game not found");
  }
  return asGame(doc);
}

// --- Query -----------------------------------------------------------------

/**
 * The caller's role-specific view of a game. Reactive: every mutation that
 * patches the game doc re-runs this for every subscribed player, each getting
 * their own filtered view (transformGameForPlayer hides opponent secrets).
 */
export const getGame = query({
  args: { playerId: playerIdArg, gameId: v.id("games") },
  handler: async (ctx, { playerId, gameId }) => {
    const doc = await ctx.db.get(gameId);
    if (!doc) {
      return null;
    }
    const game = asGame(doc);
    if (!getTeamAndRole(game.teams, playerId)) {
      // Not seated in this game, e.g. someone who opened the lobby link after
      // the game started.
      return { notInGame: true as const };
    }
    return { notInGame: false as const, view: transformGameForPlayer(game, playerId) };
  },
});

// --- Captain ---------------------------------------------------------------

export const setStartLocation = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), location: locationArg },
  handler: async (ctx, { playerId, gameId, location }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(
      gameId,
      logic.setStartLocation(game, team, location as Location),
    );
  },
});

export const headInDirection = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), direction: directionArg },
  handler: async (ctx, { playerId, gameId, direction }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(gameId, logic.headInDirection(game, team, direction));
  },
});

export const fireTorpedo = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), target: locationArg },
  handler: async (ctx, { playerId, gameId, target }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(gameId, logic.fireTorpedo(game, team, target as Location));
  },
});

export const dropMine = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), location: locationArg },
  handler: async (ctx, { playerId, gameId, location }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(gameId, logic.dropMine(game, team, location as Location));
  },
});

export const detonateMine = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), location: locationArg },
  handler: async (ctx, { playerId, gameId, location }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(
      gameId,
      logic.detonateMine(game, team, location as Location),
    );
  },
});

export const useSonar = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games") },
  handler: async (ctx, { playerId, gameId }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(gameId, logic.useSonar(game, team));
  },
});

export const useDrone = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), sector: v.number() },
  handler: async (ctx, { playerId, gameId, sector }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(gameId, logic.useDrone(game, team, sector));
  },
});

export const goSilent = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), destination: locationArg },
  handler: async (ctx, { playerId, gameId, destination }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(
      gameId,
      logic.goSilent(game, team, destination as Location),
    );
  },
});

/**
 * Begin surfacing, and schedule the surface to end after SURFACE_DURATION.
 * The scheduled job is durable — it survives backend restarts, unlike the
 * old in-process setTimeout.
 */
export const surface = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games") },
  handler: async (ctx, { playerId, gameId }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, CAPTAIN);
    await ctx.db.patch(gameId, logic.surfaceStart(game, team));
    await ctx.scheduler.runAfter(SURFACE_DURATION, internal.games.endSurface, {
      gameId,
      team,
    });
  },
});

export const endSurface = internalMutation({
  args: { gameId: v.id("games"), team: teamArg },
  handler: async (ctx, { gameId, team }) => {
    const doc = await ctx.db.get(gameId);
    if (!doc) {
      return;
    }
    await ctx.db.patch(gameId, logic.surfaceEnd(asGame(doc), team));
  },
});

// --- First Mate ------------------------------------------------------------

export const chargeSystem = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), systemName: v.optional(systemNameArg) },
  handler: async (ctx, { playerId, gameId, systemName }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, FIRST_MATE);
    await ctx.db.patch(gameId, logic.chargeSystem(game, team, systemName));
  },
});

// --- Engineer --------------------------------------------------------------

export const trackBreakdown = mutation({
  args: { playerId: playerIdArg, gameId: v.id("games"), breakdownIndex: v.number() },
  handler: async (ctx, { playerId, gameId, breakdownIndex }) => {
    const game = await loadGame(ctx, gameId);
    const team = requireTeam(game, playerId, ENGINEER);
    await ctx.db.patch(gameId, logic.trackBreakdown(game, team, breakdownIndex));
  },
});
