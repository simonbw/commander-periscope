/**
 * Where per-player data (player id, username) lives. In dev this is
 * sessionStorage, so every tab is a separate player and a whole 8-player game
 * can be played in one browser. In production it's localStorage, so a player
 * keeps their identity across tabs and reloads.
 */
export function playerStorage(): Storage {
  return import.meta.env.DEV ? sessionStorage : localStorage;
}
