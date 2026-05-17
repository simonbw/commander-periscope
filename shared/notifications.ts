import type {
  Direction,
  HitResult,
  Location,
  NewNotification,
  Notification,
  SonarResult,
  Team,
} from "./types";

// Factory helpers build a notification without an `id`; the id is assigned
// when the notification is appended to a game (see appendNotification).

export function createMoveNotification(
  team: Team,
  direction: Direction,
): NewNotification {
  return { kind: "MOVE", team, direction };
}

export function createTorpedoNotification(
  team: Team,
  location: Location,
  hitResult: HitResult,
): NewNotification {
  return { kind: "TORPEDO", team, location, hitResult };
}

export function createDropMineNotification(
  team: Team,
  location: Location,
): NewNotification {
  return { kind: "DROP_MINE", team, location };
}

export function createDetonateMineNotification(
  team: Team,
  location: Location,
  hitResult: HitResult,
): NewNotification {
  return { kind: "DETONATE_MINE", team, location, hitResult };
}

export function createSonarNotification(
  team: Team,
  sonarResult: SonarResult,
): NewNotification {
  return { kind: "SONAR", team, sonarResult };
}

export function createDroneNotification(
  team: Team,
  sector: number,
  droneResult: boolean,
): NewNotification {
  return { kind: "DRONE", team, sector, droneResult };
}

export function createSilentNotification(
  team: Team,
  location: Location,
): NewNotification {
  return { kind: "SILENT", team, location };
}

export function createSurfaceNotification(
  team: Team,
  sector: number,
): NewNotification {
  return { kind: "SURFACE", team, sector };
}

/** Append a notification to a list, assigning it the next sequential id. */
export function appendNotification(
  notifications: Notification[],
  notification: NewNotification,
): void {
  notifications.push({ ...notification, id: notifications.length } as Notification);
}
