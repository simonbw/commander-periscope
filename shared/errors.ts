/**
 * Thrown when an action is attempted that the current game state does not
 * allow (firing an uncharged system, moving onto land, etc.). Carries a 400
 * status so the Convex layer can surface it as a client error.
 */
export class GameStateError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "GameStateError";
  }
}

/** Thrown when user-supplied input is malformed (e.g. an invalid lobby code). */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
