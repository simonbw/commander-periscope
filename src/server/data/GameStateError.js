export class GameStateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    Error.captureStackTrace(this, GameStateError);
  }
}