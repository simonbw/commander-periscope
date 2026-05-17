import type { Team } from "./types";

export const RED = "red" satisfies Team;
export const BLUE = "blue" satisfies Team;

export const BOTH_TEAMS: Team[] = [RED, BLUE];

export function otherTeam(team: Team): Team {
  return team === RED ? BLUE : RED;
}

export function getTeamDisplayName(team: Team): string {
  return team === RED ? "Red" : "Blue";
}
