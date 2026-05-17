import { produce } from "immer";
import { describe, expect, it } from "vitest";
import {
  canUseSystem,
  checkEngineOverload,
  fixCircuits,
  getTeamAndRole,
} from "./gameUtils";
import { CAPTAIN, ENGINEER } from "./role";
import { createStandardSubsystems } from "./subsystems";
import { COMMS, DRONE, MINE, TORPEDO } from "./system";
import { BLUE, RED } from "./team";
import { mockGame } from "./testMocks";

describe("gameUtils", () => {
  it("getTeamAndRole", () => {
    const game = mockGame();
    expect(getTeamAndRole(game.teams, "p1")).toEqual({ team: RED, role: CAPTAIN });
    expect(getTeamAndRole(game.teams, "p8")).toEqual({ team: BLUE, role: ENGINEER });
    expect(getTeamAndRole(game.teams, "waldo")).toBeUndefined();
    expect(getTeamAndRole(undefined, "waldo")).toBeUndefined();
    expect(getTeamAndRole(game.teams, undefined)).toBeUndefined();
  });

  it("canUseSystem", () => {
    const base = mockGame();
    const commsIndex = base.subsystems.findIndex((s) => s.systemType === COMMS);
    const game = produce(base, (d) => {
      d.teamState.red.systems.torpedo.charge =
        d.teamState.red.systems.torpedo.maxCharge;
      d.teamState.red.systems.drone.charge =
        d.teamState.red.systems.drone.maxCharge;
      d.teamState.red.breakdowns.push(commsIndex);
    });

    // Uncharged
    expect(canUseSystem(game, RED, MINE)).toBe(false);
    // Charged but broken (drone is a COMMS system)
    expect(canUseSystem(game, RED, DRONE)).toBe(false);
    // Charged and not broken
    expect(canUseSystem(game, RED, TORPEDO)).toBe(true);
  });

  it("fixCircuits", () => {
    const subsystems = createStandardSubsystems();
    const allBroken = subsystems.map((_, i) => i);
    const fixed = fixCircuits(subsystems, allBroken);

    for (let i = 0; i < subsystems.length; i++) {
      if (subsystems[i].circuit != null) {
        expect(fixed.includes(i), `circuit subsystem ${i} should be fixed`).toBe(
          false,
        );
      } else {
        expect(
          fixed.includes(i),
          `non-circuit subsystem ${i} should stay broken`,
        ).toBe(true);
      }
    }
  });

  it("checkEngineOverload", () => {
    const subsystems = createStandardSubsystems();
    expect(checkEngineOverload(subsystems, [])).toBe(false);
    const allBroken = subsystems.map((_, i) => i);
    expect(checkEngineOverload(subsystems, allBroken)).toBe(true);
  });
});
