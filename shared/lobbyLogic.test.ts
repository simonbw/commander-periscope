import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { ready, selectRole, shouldStartGame, unready } from "./lobbyLogic";
import { CAPTAIN } from "./role";
import { RED } from "./team";
import { mockLobby } from "./testMocks";

describe("lobbyLogic", () => {
  it("shouldStartGame", () => {
    const unreadyLobby = mockLobby();
    expect(shouldStartGame(unreadyLobby)).toBe(false);

    const readyLobby = produce(unreadyLobby, (d) => {
      d.readied = [...d.players];
    });
    expect(shouldStartGame(readyLobby)).toBe(true);
  });

  it("selectRole seats and frees players", () => {
    let lobby = mockLobby();
    lobby = produce(lobby, (d) => {
      d.teams = {
        red: { captain: null, first_mate: null, radio_operator: null, engineer: null },
        blue: { captain: null, first_mate: null, radio_operator: null, engineer: null },
      };
    });

    lobby = selectRole(lobby, "p1", RED, CAPTAIN);
    expect(lobby.teams.red.captain).toBe("p1");

    // Another player cannot take an occupied slot.
    expect(() => selectRole(lobby, "p2", RED, CAPTAIN)).toThrow();

    // Deselecting frees the slot.
    lobby = selectRole(lobby, "p1", null, null);
    expect(lobby.teams.red.captain).toBe(null);
  });

  it("ready requires a role", () => {
    const lobby = mockLobby(); // rosters are filled in mockLobby
    expect(() => ready(lobby, "p1")).not.toThrow();
    expect(ready(lobby, "p1").readied).toContain("p1");
    expect(unready(ready(lobby, "p1"), "p1").readied).not.toContain("p1");
    expect(() => ready(lobby, "not-a-player")).toThrow();
  });
});
