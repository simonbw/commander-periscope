import { ValidationError } from "./errors";

const LOBBY_CHAR_MATCHER = /[A-Za-z0-9_-]/;

/** Throws a ValidationError if `code` is not a usable lobby code. */
export function validateLobbyCode(code: unknown): asserts code is string {
  if (typeof code !== "string") {
    throw new ValidationError("Lobby code must be a string");
  }
  if (code === "") {
    throw new ValidationError("Lobby code cannot be empty");
  }
  for (const c of code) {
    if (!LOBBY_CHAR_MATCHER.test(c)) {
      throw new ValidationError(`Invalid character: "${c}"`);
    }
  }
}

/** Returns an error message for an invalid lobby code, or null if it is valid. */
export function getLobbyCodeErrors(code: unknown): string | null {
  try {
    validateLobbyCode(code);
    return null;
  } catch (e) {
    if (e instanceof ValidationError) {
      return e.message;
    }
    throw e;
  }
}
