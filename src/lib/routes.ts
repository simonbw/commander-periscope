/** Page URLs. Must stay compatible with the SPA rewrite in vercel.json. */
export const MENU_PATH = "/";
export const LOBBY_PATH = "/lobby/:code";

export function lobbyPath(code: string): string {
  return `/lobby/${encodeURIComponent(code)}`;
}

/** Lobby codes are case-insensitive for typing; stored uppercase. */
export function normalizeLobbyCode(code: string): string {
  return code.trim().toUpperCase();
}
