import type { Role } from "./types";

export const CAPTAIN = "captain" satisfies Role;
export const FIRST_MATE = "first_mate" satisfies Role;
export const RADIO_OPERATOR = "radio_operator" satisfies Role;
export const ENGINEER = "engineer" satisfies Role;

export const ALL_ROLES: Role[] = [CAPTAIN, FIRST_MATE, RADIO_OPERATOR, ENGINEER];

export function getRoleDisplayName(role: Role): string {
  switch (role) {
    case CAPTAIN:
      return "Captain";
    case FIRST_MATE:
      return "First Mate";
    case RADIO_OPERATOR:
      return "Radio Operator";
    case ENGINEER:
      return "Engineer";
  }
}
