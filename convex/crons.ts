import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

// In-memory state used to vanish on restart; persisted state does not, so
// abandoned lobbies/games are swept here. See docs/convex-migration-plan.md §5.5.
const STALE_MS = 6 * 60 * 60 * 1000; // 6 hours

export const cleanupStale = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - STALE_MS;

    const staleLobbies = await ctx.db
      .query("lobbies")
      .filter((q) => q.lt(q.field("created"), cutoff))
      .collect();
    for (const lobby of staleLobbies) {
      await ctx.db.delete(lobby._id);
    }

    const staleGames = await ctx.db
      .query("games")
      .filter((q) => q.lt(q.field("created"), cutoff))
      .collect();
    for (const game of staleGames) {
      await ctx.db.delete(game._id);
    }
  },
});

const crons = cronJobs();
crons.interval(
  "clean up stale lobbies and games",
  { hours: 1 },
  internal.crons.cleanupStale,
  {},
);
export default crons;
