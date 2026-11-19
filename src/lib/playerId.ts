import { playerStorage } from "./storage";

const KEY = "playerId";

function randomId(): string {
  // crypto.randomUUID only exists in secure contexts; phones testing against a
  // LAN dev server (http://192.168…) aren't one, but getRandomValues works.
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * This browser's player id, generated once and remembered. Passed as the
 * `playerId` argument to every Convex function (see
 * docs/convex-migration-plan.md §6). Replaces the old `userId` cookie.
 */
export function getPlayerId(): string {
  const storage = playerStorage();
  let id = storage.getItem(KEY);
  if (!id) {
    id = randomId();
    storage.setItem(KEY, id);
  }
  return id;
}
