import { playerStorage } from "./storage";

const KEY = "username";

export function getSavedUsername(): string | undefined {
  return playerStorage().getItem(KEY) || undefined;
}

export function saveUsername(username: string): void {
  playerStorage().setItem(KEY, username);
}
