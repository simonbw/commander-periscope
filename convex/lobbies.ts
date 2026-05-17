import { v } from "convex/values";
import { createGame, createLobby as makeLobby } from "../shared/gameFactory";
import {
  addPlayer,
  isLobbyEmpty,
  ready,
  removePlayer,
  selectRole as selectRoleLogic,
  setUsername,
  shouldStartGame,
  unready,
} from "../shared/lobbyLogic";
import { transformLobbyForPlayer } from "../shared/transforms";
import type { Lobby } from "../shared/types";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, type MutationCtx, query, type QueryCtx } from "./_generated/server";
import { requirePlayer } from "./helpers";

const teamArg = v.union(v.literal("red"), v.literal("blue"));
const roleArg = v.union(
  v.literal("captain"),
  v.literal("first_mate"),
  v.literal("radio_operator"),
  v.literal("engineer"),
);

// Unambiguous code alphabet: no 0/O, 1/I/L.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;

function randomCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

async function generateUniqueCode(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    const existing = await ctx.db
      .query("lobbies")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    if (!existing) {
      return code;
    }
  }
  throw new Error("Could not generate a unique lobby code");
}

/** A Convex lobby document carries `_id`/`_creationTime`; this is a safe view. */
function asLobby(doc: Doc<"lobbies">): Lobby {
  return doc as unknown as Lobby;
}

async function loadLobbyByCode(
  ctx: QueryCtx | MutationCtx,
  code: string,
): Promise<Doc<"lobbies">> {
  const lobby = await ctx.db
    .query("lobbies")
    .withIndex("by_code", (q) => q.eq("code", code))
    .unique();
  if (!lobby) {
    throw new Error("Lobby not found");
  }
  return lobby;
}

/**
 * Persist a mutated lobby. If the lobby is now full and ready, create the
 * game and link it — this replaces the old startGameIfShould side effect.
 */
async function saveLobby(
  ctx: MutationCtx,
  lobbyId: Id<"lobbies">,
  lobby: Lobby,
): Promise<void> {
  let gameId = lobby.gameId as Id<"games"> | null;
  if (!gameId && shouldStartGame(lobby)) {
    gameId = await ctx.db.insert(
      "games",
      createGame({
        players: lobby.players,
        usernames: lobby.usernames,
        teams: lobby.teams,
      }),
    );
  }
  await ctx.db.patch(lobbyId, {
    code: lobby.code,
    created: lobby.created,
    players: lobby.players,
    usernames: lobby.usernames,
    readied: lobby.readied,
    teams: lobby.teams,
    gameId,
  });
}

// --- Query -----------------------------------------------------------------

export const getLobby = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const playerId = await requirePlayer(ctx);
    const doc = await ctx.db
      .query("lobbies")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    if (!doc) {
      return null;
    }
    return transformLobbyForPlayer(asLobby(doc), playerId);
  },
});

// --- Mutations -------------------------------------------------------------

/** Create a fresh lobby, seat the creator, and return the shareable code. */
export const createLobby = mutation({
  args: { username: v.optional(v.string()) },
  handler: async (ctx, { username }): Promise<string> => {
    const playerId = await requirePlayer(ctx);
    const code = await generateUniqueCode(ctx);
    const lobby = addPlayer(makeLobby(code), playerId, username);
    await ctx.db.insert("lobbies", lobby);
    return code;
  },
});

export const joinLobby = mutation({
  args: { code: v.string(), username: v.optional(v.string()) },
  handler: async (ctx, { code, username }) => {
    const playerId = await requirePlayer(ctx);
    const doc = await loadLobbyByCode(ctx, code);
    await saveLobby(ctx, doc._id, addPlayer(asLobby(doc), playerId, username));
  },
});

/**
 * Explicit leave (a "Leave" button / beforeunload handler). Lobbies left
 * abandoned without this are swept by the GC cron — see convex/crons.ts.
 */
export const leaveLobby = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const playerId = await requirePlayer(ctx);
    const doc = await loadLobbyByCode(ctx, code);
    const next = removePlayer(asLobby(doc), playerId);
    if (isLobbyEmpty(next)) {
      await ctx.db.delete(doc._id);
    } else {
      await saveLobby(ctx, doc._id, next);
    }
  },
});

export const setLobbyUsername = mutation({
  args: { code: v.string(), username: v.string() },
  handler: async (ctx, { code, username }) => {
    const playerId = await requirePlayer(ctx);
    const doc = await loadLobbyByCode(ctx, code);
    await saveLobby(ctx, doc._id, setUsername(asLobby(doc), playerId, username));
  },
});

export const selectRole = mutation({
  args: {
    code: v.string(),
    team: v.union(teamArg, v.null()),
    role: v.union(roleArg, v.null()),
  },
  handler: async (ctx, { code, team, role }) => {
    const playerId = await requirePlayer(ctx);
    const doc = await loadLobbyByCode(ctx, code);
    await saveLobby(
      ctx,
      doc._id,
      selectRoleLogic(asLobby(doc), playerId, team, role),
    );
  },
});

export const readyUp = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const playerId = await requirePlayer(ctx);
    const doc = await loadLobbyByCode(ctx, code);
    await saveLobby(ctx, doc._id, ready(asLobby(doc), playerId));
  },
});

export const unreadyUp = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const playerId = await requirePlayer(ctx);
    const doc = await loadLobbyByCode(ctx, code);
    await saveLobby(ctx, doc._id, unready(asLobby(doc), playerId));
  },
});
