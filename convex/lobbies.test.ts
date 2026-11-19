// @vitest-environment edge-runtime
import { ConvexError } from "convex/values";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import { fillLobby, newTest, SEATS, startGame } from "./test.setup";

async function getLobbyDoc(t: ReturnType<typeof newTest>, code: string) {
  return t.run((ctx) =>
    ctx.db
      .query("lobbies")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique(),
  );
}

describe("createLobby / getLobby", () => {
  it("returns a 5-character code and seats the creator", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, {
      playerId: "alice",
      username: "Alice",
    });
    expect(code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/);

    const doc = await getLobbyDoc(t, code);
    expect(doc).not.toBeNull();
    expect(doc!.players).toEqual(["alice"]);
    expect(doc!.usernames).toEqual({ alice: "Alice" });
    expect(doc!.gameId).toBeNull();
  });

  it("returns the per-player view by code", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, {
      playerId: "alice",
      username: "Alice",
    });
    await t.mutation(api.lobbies.joinLobby, { playerId: "bob", code, username: "Bob" });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: "red",
      role: "captain",
    });

    const aliceView = await t.query(api.lobbies.getLobby, { playerId: "alice", code });
    expect(aliceView).toMatchObject({
      code,
      gameId: null,
      teamAndRole: { team: "red", role: "captain" },
      isReady: false,
      username: "Alice",
    });
    expect(aliceView!.teams.red.captain).toEqual({
      isUser: true,
      isAvailable: false,
      isReady: false,
      username: "Alice",
    });
    expect(aliceView!.teams.blue.captain.isAvailable).toBe(true);

    const bobView = await t.query(api.lobbies.getLobby, { playerId: "bob", code });
    expect(bobView!.teamAndRole).toBeUndefined();
    expect(bobView!.username).toBe("Bob");
    expect(bobView!.teams.red.captain.isUser).toBe(false);
    expect(bobView!.teams.red.captain.username).toBe("Alice");
  });

  it("returns null for an unknown code", async () => {
    const t = newTest();
    expect(await t.query(api.lobbies.getLobby, { playerId: "alice", code: "ZZZZZ" })).toBeNull();
  });
});

describe("joinLobby", () => {
  it("adds the player once, even when joining twice", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    await t.mutation(api.lobbies.joinLobby, { playerId: "bob", code });
    await t.mutation(api.lobbies.joinLobby, { playerId: "bob", code, username: "Bob" });
    const doc = await getLobbyDoc(t, code);
    expect(doc!.players).toEqual(["alice", "bob"]);
    expect(doc!.usernames).toEqual({ bob: "Bob" });
  });

  it("throws a ConvexError for an unknown code", async () => {
    const t = newTest();
    await expect(
      t.mutation(api.lobbies.joinLobby, { playerId: "bob", code: "ZZZZZ" }),
    ).rejects.toBeInstanceOf(ConvexError);
  });
});

describe("setLobbyUsername", () => {
  it("sets the username", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    await t.mutation(api.lobbies.setLobbyUsername, {
      playerId: "alice",
      code,
      username: "Captain Alice",
    });
    const view = await t.query(api.lobbies.getLobby, { playerId: "alice", code });
    expect(view!.username).toBe("Captain Alice");
  });

  it("rejects overly long usernames with a ConvexError", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    await expect(
      t.mutation(api.lobbies.setLobbyUsername, {
        playerId: "alice",
        code,
        username: "x".repeat(101),
      }),
    ).rejects.toBeInstanceOf(ConvexError);
  });
});

describe("selectRole", () => {
  it("seats the player, and switching roles frees the old slot", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: "red",
      role: "captain",
    });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: "blue",
      role: "engineer",
    });
    const doc = await getLobbyDoc(t, code);
    expect(doc!.teams.red.captain).toBeNull();
    expect(doc!.teams.blue.engineer).toBe("alice");
  });

  it("throws a ConvexError when the role is taken by someone else", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    await t.mutation(api.lobbies.joinLobby, { playerId: "bob", code });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: "red",
      role: "captain",
    });
    const attempt = t.mutation(api.lobbies.selectRole, {
      playerId: "bob",
      code,
      team: "red",
      role: "captain",
    });
    await expect(attempt).rejects.toBeInstanceOf(ConvexError);
    await expect(attempt).rejects.toThrow(/already taken/);

    // The failed mutation must not have changed anything.
    const doc = await getLobbyDoc(t, code);
    expect(doc!.teams.red.captain).toBe("alice");
  });

  it("deselecting (null team/role) clears the slot and readiness", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: "red",
      role: "captain",
    });
    await t.mutation(api.lobbies.readyUp, { playerId: "alice", code });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: null,
      role: null,
    });
    const doc = await getLobbyDoc(t, code);
    expect(doc!.teams.red.captain).toBeNull();
    expect(doc!.readied).toEqual([]);
  });
});

describe("readyUp / unreadyUp", () => {
  it("readies and unreadies a seated player", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: "blue",
      role: "radio_operator",
    });
    await t.mutation(api.lobbies.readyUp, { playerId: "alice", code });
    let view = await t.query(api.lobbies.getLobby, { playerId: "alice", code });
    expect(view!.isReady).toBe(true);
    expect(view!.teams.blue.radio_operator.isReady).toBe(true);

    await t.mutation(api.lobbies.unreadyUp, { playerId: "alice", code });
    view = await t.query(api.lobbies.getLobby, { playerId: "alice", code });
    expect(view!.isReady).toBe(false);
    expect(view!.teams.blue.radio_operator.isReady).toBe(false);
  });

  it("throws a ConvexError when readying without a role", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, { playerId: "alice" });
    const attempt = t.mutation(api.lobbies.readyUp, { playerId: "alice", code });
    await expect(attempt).rejects.toBeInstanceOf(ConvexError);
    await expect(attempt).rejects.toThrow(/without a role/);
  });
});

describe("leaveLobby", () => {
  it("removes the player and their seat but keeps the lobby", async () => {
    const t = newTest();
    const code = await t.mutation(api.lobbies.createLobby, {
      playerId: "alice",
      username: "Alice",
    });
    await t.mutation(api.lobbies.selectRole, {
      playerId: "alice",
      code,
      team: "red",
      role: "captain",
    });
    await t.mutation(api.lobbies.readyUp, { playerId: "alice", code });
    await t.mutation(api.lobbies.leaveLobby, { playerId: "alice", code });

    const doc = await getLobbyDoc(t, code);
    expect(doc).not.toBeNull();
    expect(doc!.players).toEqual([]);
    expect(doc!.readied).toEqual([]);
    expect(doc!.usernames).toEqual({});
    expect(doc!.teams.red.captain).toBeNull();

    // Rejoining (e.g. after a page refresh) still works.
    await t.mutation(api.lobbies.joinLobby, { playerId: "alice", code });
    expect((await getLobbyDoc(t, code))!.players).toEqual(["alice"]);
  });

  it("is a no-op for an unknown code", async () => {
    const t = newTest();
    await expect(
      t.mutation(api.lobbies.leaveLobby, { playerId: "alice", code: "ZZZZZ" }),
    ).resolves.toBeNull();
  });
});

describe("game start", () => {
  it("does not start a game until every seat is filled and readied", async () => {
    const t = newTest();
    const code = await fillLobby(t);
    for (const s of SEATS.slice(0, 7)) {
      await t.mutation(api.lobbies.readyUp, { playerId: s.playerId, code });
    }
    expect((await getLobbyDoc(t, code))!.gameId).toBeNull();
    expect(await t.run((ctx) => ctx.db.query("games").collect())).toHaveLength(0);
  });

  it("creates a game and links it when all 8 players are ready", async () => {
    const t = newTest();
    const { code, gameId } = await startGame(t);

    const lobby = await getLobbyDoc(t, code);
    expect(lobby!.gameId).toBe(gameId);

    const game = await t.run((ctx) => ctx.db.get(gameId));
    expect(game).not.toBeNull();
    expect(game!.phase).toBe(1); // PICK_PHASE
    expect([...game!.players].sort()).toEqual(SEATS.map((s) => s.playerId).sort());
    for (const s of SEATS) {
      expect(game!.teams[s.team][s.role]).toBe(s.playerId);
      expect(game!.usernames[s.playerId]).toBe(s.playerId);
    }

    // Every player's lobby view points at the game.
    for (const s of SEATS) {
      const view = await t.query(api.lobbies.getLobby, { playerId: s.playerId, code });
      expect(view!.gameId).toBe(gameId);
    }
  });

  it("does not create a second game on further lobby changes", async () => {
    const t = newTest();
    const { code, gameId } = await startGame(t);
    await t.mutation(api.lobbies.unreadyUp, { playerId: SEATS[0].playerId, code });
    await t.mutation(api.lobbies.readyUp, { playerId: SEATS[0].playerId, code });
    expect((await getLobbyDoc(t, code))!.gameId).toBe(gameId);
    expect(await t.run((ctx) => ctx.db.query("games").collect())).toHaveLength(1);
  });
});
