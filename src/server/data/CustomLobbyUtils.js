// TODO: Should this file be in /util ?

// TODO: Make this require all players
export const shouldStartGame = (lobby) => (
  lobby.get('teams').some((team) => team.some(
    (playerId) => playerId && lobby.get('readied').has(playerId)))
);
