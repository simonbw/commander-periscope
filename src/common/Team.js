export const RED = 'red';
export const BLUE = 'blue';

export const BOTH_TEAMS = [RED, BLUE];

export function otherTeam(team) {
  switch (team) {
    case RED:
      return BLUE;
    case BLUE:
      return RED;
  }
  throw Error(`invalid team: ${team}`);
}

export function getDisplayName(team) {
  switch (team) {
    case RED:
      return 'Red Team';
    case BLUE:
      return 'Blue Team';
  }
}