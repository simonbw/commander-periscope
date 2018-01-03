// TODO: Should this file be in /util ?

export const shouldStartGame = (lobby) => {
  if (lobby.get('gameId')) { // don't start a second game
    return false;
  }
  return lobby.get('teams').every((team) => team.every((playerId) =>
    playerId && lobby.get('readied').has(playerId)));
};
