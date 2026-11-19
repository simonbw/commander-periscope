import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// --- Reusable validators ---------------------------------------------------

const team = v.union(v.literal("red"), v.literal("blue"));
const direction = v.union(
  v.literal("NORTH"),
  v.literal("EAST"),
  v.literal("SOUTH"),
  v.literal("WEST"),
);
const systemType = v.union(
  v.literal("weapons"),
  v.literal("comms"),
  v.literal("special"),
  v.literal("nuclear"),
);
const hitResult = v.union(v.literal(0), v.literal(1), v.literal(2));

/** A [x, y] grid coordinate. */
const location = v.array(v.number());

const teamRoster = v.object({
  captain: v.union(v.string(), v.null()),
  first_mate: v.union(v.string(), v.null()),
  radio_operator: v.union(v.string(), v.null()),
  engineer: v.union(v.string(), v.null()),
});

const subsystem = v.object({
  id: v.number(),
  systemType,
  direction,
  circuit: v.union(v.number(), v.null()),
});

const systemCharge = v.object({ charge: v.number(), maxCharge: v.number() });

const systems = v.object({
  mine: systemCharge,
  torpedo: systemCharge,
  drone: systemCharge,
  sonar: systemCharge,
  silent: systemCharge,
});

const teamState = v.object({
  turnInfo: v.object({
    usedSystem: v.boolean(),
    turnNumber: v.number(),
    waitingForEngineer: v.boolean(),
    waitingForFirstMate: v.boolean(),
  }),
  breakdowns: v.array(v.number()),
  hitPoints: v.number(),
  mineLocations: v.array(location),
  subLocation: v.union(location, v.null()),
  subPath: v.array(location),
  surfaced: v.boolean(),
  systems,
});

const sonarResult = v.object({
  row: v.optional(v.number()),
  column: v.optional(v.number()),
  sector: v.optional(v.number()),
});

const notification = v.union(
  v.object({ id: v.number(), team, kind: v.literal("MOVE"), direction }),
  v.object({
    id: v.number(),
    team,
    kind: v.literal("TORPEDO"),
    location,
    hitResult,
  }),
  v.object({
    id: v.number(),
    team,
    kind: v.literal("DROP_MINE"),
    location: v.optional(location),
  }),
  v.object({
    id: v.number(),
    team,
    kind: v.literal("DETONATE_MINE"),
    location,
    hitResult,
  }),
  v.object({ id: v.number(), team, kind: v.literal("SONAR"), sonarResult }),
  v.object({
    id: v.number(),
    team,
    kind: v.literal("DRONE"),
    sector: v.number(),
    droneResult: v.boolean(),
  }),
  v.object({
    id: v.number(),
    team,
    kind: v.literal("SILENT"),
    location: v.optional(location),
  }),
  v.object({ id: v.number(), team, kind: v.literal("SURFACE"), sector: v.number() }),
);

// --- Schema ----------------------------------------------------------------

export default defineSchema({
  lobbies: defineTable({
    code: v.string(),
    created: v.number(),
    players: v.array(v.string()),
    usernames: v.record(v.string(), v.string()),
    readied: v.array(v.string()),
    teams: v.object({ red: teamRoster, blue: teamRoster }),
    gameId: v.union(v.id("games"), v.null()),
  }).index("by_code", ["code"]),

  games: defineTable({
    created: v.number(),
    phase: v.number(),
    grid: v.array(v.array(v.number())),
    subsystems: v.array(subsystem),
    players: v.array(v.string()),
    usernames: v.record(v.string(), v.string()),
    teams: v.object({ red: teamRoster, blue: teamRoster }),
    notifications: v.array(notification),
    winner: v.union(team, v.null()),
    teamState: v.object({ red: teamState, blue: teamState }),
  }),
});
