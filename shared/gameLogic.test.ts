// Ported from test/server/data/GamesTest.js. The Games.* resource methods are
// now pure functions, so game state is threaded through explicitly instead of
// being mutated behind an async DAO.

import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { EAST, NORTH, SOUTH, WEST } from "./direction";
import { GameStateError } from "./errors";
import { createGame } from "./gameFactory";
import {
  chargeSystem,
  detonateMine,
  dropMine,
  fireTorpedo,
  goSilent,
  headInDirection,
  setStartLocation,
  surfaceEnd,
  surfaceStart,
  trackBreakdown,
  useDrone,
  useSonar,
} from "./gameLogic";
import { ENDED_PHASE, MAIN_PHASE, PICK_PHASE } from "./gamePhase";
import { LAND_TILE } from "./grid";
import { createEmptyGrid } from "./grids";
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from "./system";
import { BLUE, RED } from "./team";
import { mockLobby } from "./testMocks";
import type { Direction, Game, Location, SystemName, Team } from "./types";

function clearBreakdowns(game: Game, team: Team): Game {
  return produce(game, (d) => {
    d.teamState[team].breakdowns = [];
  });
}

function createStartedGame(
  redStart: Location = [1, 1],
  blueStart: Location = [1, 1],
): Game {
  const lobby = mockLobby();
  let game = createGame({
    players: lobby.players,
    usernames: lobby.usernames,
    teams: lobby.teams,
    grid: createEmptyGrid(),
  });
  game = setStartLocation(game, RED, redStart);
  game = setStartLocation(game, BLUE, blueStart);
  return game;
}

function trackAnyBreakdown(game: Game, team: Team, direction: Direction): Game {
  const index = game.subsystems.findIndex(
    (s) =>
      s.direction === direction &&
      !game.teamState[team].breakdowns.includes(s.id),
  );
  return trackBreakdown(game, team, index);
}

function doMove(
  game: Game,
  team: Team,
  direction: Direction = SOUTH,
  system: SystemName = TORPEDO,
  shouldClearBreakdowns = false,
): Game {
  game = headInDirection(game, team, direction);
  game = chargeSystem(game, team, system);
  game = trackAnyBreakdown(game, team, direction);
  if (shouldClearBreakdowns) {
    game = clearBreakdowns(game, team);
  }
  return game;
}

describe("gameLogic", () => {
  it("createGame", () => {
    const lobby = mockLobby();
    const game = createGame({
      players: lobby.players,
      usernames: lobby.usernames,
      teams: lobby.teams,
    });
    expect(game.grid).toBeDefined();
    expect(game.subsystems).toHaveLength(24);
    for (const team of [RED, BLUE] as Team[]) {
      const ts = game.teamState[team];
      expect(ts.subLocation).toBeNull();
      expect(ts.subPath).toEqual([]);
      expect(ts.breakdowns).toEqual([]);
      expect(ts.hitPoints).toBe(4);
    }
  });

  describe("Captain", () => {
    it("setStartLocation", () => {
      let game = createStartedGameUnstarted();
      game = setStartLocation(game, RED, [1, 2]);
      expect(game.phase).toBe(PICK_PHASE);
      game = setStartLocation(game, BLUE, [2, 3]);
      expect(game.phase).toBe(MAIN_PHASE);
      expect(game.teamState.red.subLocation).toEqual([1, 2]);
      expect(game.teamState.blue.subLocation).toEqual([2, 3]);
    });

    it("headInDirection", () => {
      let game = createStartedGame([1, 1], [3, 2]);
      game = headInDirection(game, RED, SOUTH);
      game = headInDirection(game, BLUE, EAST);
      expect(game.teamState.red.subLocation).toEqual([1, 2]);
      expect(game.teamState.blue.subLocation).toEqual([4, 2]);
      // Cannot move again before the engineer and first mate have gone.
      expect(() => headInDirection(game, RED, NORTH)).toThrow(GameStateError);
    });

    it("surface", () => {
      let game = createStartedGame();
      game = headInDirection(game, RED, SOUTH);
      game = surfaceStart(game, RED);
      expect(game.teamState.red.surfaced).toBe(true);
      game = surfaceEnd(game, RED);
      expect(game.teamState.red.surfaced).toBe(false);
      expect(game.teamState.red.subPath).toEqual([]);
    });

    it("fireTorpedo", () => {
      let game = createStartedGame([1, 1], [1, 6]);
      expect(() => fireTorpedo(game, RED, [1, 1])).toThrow(GameStateError);

      game = doMove(game, RED, SOUTH, TORPEDO);
      game = doMove(game, RED, SOUTH, TORPEDO);
      game = doMove(game, RED, SOUTH, TORPEDO);
      game = clearBreakdowns(game, RED);

      // Out of range.
      expect(() => fireTorpedo(game, RED, [10, 10])).toThrow(GameStateError);

      game = fireTorpedo(game, RED, [1, 6]);
      expect(game.teamState.red.systems.torpedo.charge).toBe(0);
    });

    it("dropMine", () => {
      let game = createStartedGame([1, 1], [1, 6]);
      expect(() => dropMine(game, RED, [1, 1])).toThrow(GameStateError);

      game = doMove(game, RED, SOUTH, MINE);
      game = doMove(game, RED, SOUTH, MINE);
      game = doMove(game, RED, SOUTH, MINE);
      game = clearBreakdowns(game, RED); // now at [1, 4]

      expect(() => dropMine(game, RED, [1, 6])).toThrow(GameStateError); // not adjacent
      expect(() => dropMine(game, RED, [1, 4])).toThrow(GameStateError); // on self
      expect(() => dropMine(game, RED, [1, 3])).toThrow(GameStateError); // on path

      game = dropMine(game, RED, [2, 5]);
      expect(game.teamState.red.systems.mine.charge).toBe(0);
    });

    it("useSonar", () => {
      let game = createStartedGame([1, 1], [1, 6]);
      expect(() => useSonar(game, RED)).toThrow(GameStateError);

      game = doMove(game, RED, SOUTH, SONAR);
      game = doMove(game, RED, SOUTH, SONAR);
      game = doMove(game, RED, SOUTH, SONAR);
      game = clearBreakdowns(game, RED);

      game = useSonar(game, RED);
      expect(game.teamState.red.systems.sonar.charge).toBe(0);
    });

    it("useDrone", () => {
      let game = createStartedGame([1, 1], [1, 6]);
      expect(() => useDrone(game, RED, 1)).toThrow(GameStateError);

      game = doMove(game, RED, SOUTH, DRONE);
      game = doMove(game, RED, SOUTH, DRONE);
      game = doMove(game, RED, SOUTH, DRONE);
      game = doMove(game, RED, SOUTH, DRONE);
      game = clearBreakdowns(game, RED);

      expect(() => useDrone(game, RED, 9)).toThrow(GameStateError);
      expect(() => useDrone(game, RED, -1)).toThrow(GameStateError);

      game = useDrone(game, RED, 5);
      expect(game.teamState.red.systems.drone.charge).toBe(0);
    });

    it("goSilent", () => {
      let game = createStartedGame([1, 1], [1, 6]);
      game = produce(game, (d) => {
        d.grid[3][7] = LAND_TILE;
      });
      expect(() => goSilent(game, RED, [3, 1])).toThrow(GameStateError);

      for (let i = 0; i < 6; i++) {
        game = doMove(game, RED, SOUTH, SILENT);
        if (i === 2) game = clearBreakdowns(game, RED);
      }
      game = doMove(game, RED, EAST, SILENT);
      game = clearBreakdowns(game, RED);
      expect(game.teamState.red.subLocation).toEqual([2, 7]);

      expect(() => goSilent(game, RED, [3, 8])).toThrow(GameStateError); // not straight
      expect(() => goSilent(game, RED, [2, 11])).toThrow(GameStateError); // too far
      expect(() => goSilent(game, RED, [4, 7])).toThrow(GameStateError); // through land
      expect(() => goSilent(game, RED, [1, 7])).toThrow(GameStateError); // through path

      game = goSilent(game, RED, [2, 10]);
      expect(game.teamState.red.systems.silent.charge).toBe(0);
      expect(game.teamState.red.subLocation).toEqual([2, 10]);
    });

    it("detonateMine", () => {
      let game = createStartedGame([1, 1], [1, 6]);
      game = doMove(game, RED, SOUTH, MINE);
      game = doMove(game, RED, SOUTH, MINE);
      game = doMove(game, RED, SOUTH, MINE);
      game = clearBreakdowns(game, RED);
      game = dropMine(game, RED, [2, 5]);

      expect(() => detonateMine(game, RED, [10, 10])).toThrow(GameStateError);
      game = detonateMine(game, RED, [2, 5]);
      expect(() => detonateMine(game, RED, [2, 5])).toThrow(GameStateError);
    });
  });

  describe("First Mate", () => {
    it("chargeSystem", () => {
      let game = createStartedGameUnstarted();
      expect(() => chargeSystem(game, RED, TORPEDO)).toThrow(GameStateError);

      game = setStartLocation(game, RED, [1, 1]);
      game = setStartLocation(game, BLUE, [1, 1]);
      expect(() => chargeSystem(game, RED, TORPEDO)).toThrow(GameStateError);

      game = doMove(game, RED, SOUTH, TORPEDO);
      expect(game.teamState.red.systems.torpedo.charge).toBe(1);

      game = doMove(game, RED, SOUTH, TORPEDO);
      expect(game.teamState.red.systems.torpedo.charge).toBe(2);

      game = doMove(game, RED, SOUTH, TORPEDO);
      expect(game.teamState.red.systems.torpedo.charge).toBe(3);

      // Charging past the max is ignored.
      game = doMove(game, RED, SOUTH, TORPEDO);
      expect(game.teamState.red.systems.torpedo.charge).toBe(3);
    });
  });

  describe("Engineer", () => {
    it("trackBreakdown", () => {
      let game = createStartedGame();
      expect(() => trackBreakdown(game, RED, 0)).toThrow(GameStateError);

      game = headInDirection(game, RED, SOUTH);
      game = chargeSystem(game, RED, TORPEDO);

      // Must track a breakdown matching the direction moved.
      expect(() => trackAnyBreakdown(game, RED, NORTH)).toThrow(GameStateError);

      const firstBreakdownGame = trackAnyBreakdown(game, RED, SOUTH);
      const firstBreakdown = firstBreakdownGame.teamState.red.breakdowns[0];

      let next = headInDirection(firstBreakdownGame, RED, SOUTH);
      next = chargeSystem(next, RED, TORPEDO);
      expect(() => trackBreakdown(next, RED, firstBreakdown)).toThrow(
        GameStateError,
      );
    });
  });

  it("damage ends the game", () => {
    let game = createStartedGame([1, 1], [5, 5]);

    game = doMove(game, RED, SOUTH, TORPEDO, true);
    game = doMove(game, BLUE, NORTH, MINE, true);
    game = doMove(game, RED, SOUTH, TORPEDO, true);
    game = doMove(game, BLUE, NORTH, MINE, true);
    game = doMove(game, RED, EAST, TORPEDO, true);
    game = doMove(game, BLUE, WEST, MINE, true);

    game = dropMine(game, BLUE, [3, 3]);
    game = detonateMine(game, BLUE, [3, 3]);
    expect(game.teamState.red.hitPoints).toBe(3);
    expect(game.teamState.blue.hitPoints).toBe(3);

    game = fireTorpedo(game, RED, [3, 3]);
    expect(game.teamState.red.hitPoints).toBe(2);
    expect(game.teamState.blue.hitPoints).toBe(2);

    game = doMove(game, RED, NORTH, TORPEDO, true);
    game = doMove(game, RED, EAST, TORPEDO, true);
    game = doMove(game, RED, SOUTH, TORPEDO, true);

    game = fireTorpedo(game, RED, [3, 3]);
    expect(game.teamState.red.hitPoints).toBe(0);
    expect(game.teamState.blue.hitPoints).toBe(1);
    expect(game.phase).toBe(ENDED_PHASE);
    expect(game.winner).toBe(BLUE);

    expect(() => headInDirection(game, RED, SOUTH)).toThrow(GameStateError);
  });
});

// A game created from a lobby but with no start locations set yet.
function createStartedGameUnstarted(): Game {
  const lobby = mockLobby();
  return createGame({
    players: lobby.players,
    usernames: lobby.usernames,
    teams: lobby.teams,
    grid: createEmptyGrid(),
  });
}
