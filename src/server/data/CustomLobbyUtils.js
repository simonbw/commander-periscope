// TODO: Should this file be in /util ?

import { READIED, TEAMS } from '../../common/StateFields';

export const shouldStartGame = (lobby) => {
  if (lobby.get('gameId')) { // don't start a second game
    return false;
  }
  return lobby.get(TEAMS).every((team) => team.every((playerId) =>
    playerId && lobby.get(READIED).has(playerId)));
};
