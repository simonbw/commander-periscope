export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const LOBBY_CHAR_MATCHER = /[A-Za-z0-9_-]/;

export function validateLobbyId(lobbyId) {
  if (typeof lobbyId !== 'string') {
    throw new ValidationError('Lobby id must be a string');
  }
  if (lobbyId === '') {
    throw new ValidationError('Lobby id cannot be empty');
  }
  for (const c of lobbyId) {
    if (!LOBBY_CHAR_MATCHER.test(c)) {
      throw new ValidationError(`Invalid character: "${c}"`)
    }
  }
  return true;
}

export function getLobbyIdErrors(lobbyId) {
  try {
    validateLobbyId(lobbyId);
    return null
  } catch (e) {
    if (e.name === 'ValidationError') { // TODO: Figure out instanceof
      return e.message;
    } else {
      throw e;
    }
  }
}