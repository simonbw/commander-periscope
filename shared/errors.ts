import { ConvexError } from "convex/values";

// Both error types extend ConvexError so their messages reach the client.
// Convex redacts plain `Error` messages in production; ConvexError data is
// always delivered. Read it client-side via `error.data`.

/**
 * Thrown when an action is attempted that the current game state does not
 * allow (firing an uncharged system, moving onto land, etc.).
 */
export class GameStateError extends ConvexError<string> {
  constructor(message: string) {
    super(message);
    this.name = "GameStateError";
  }
}

/** Thrown when user-supplied input is malformed (e.g. an invalid lobby code). */
export class ValidationError extends ConvexError<string> {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
