// TODO: Should this file be in /util ?

import { GAME_ID, READIED } from '../../common/fields/LobbyFields';
import { TEAMS } from '../../common/fields/LobbyFields';

export const shouldStartGame = (lobby) => {
  if (lobby.get(GAME_ID)) { // don't start a second game
    return false;
  }
  return lobby.get(TEAMS).every((team) => team.every((playerId) =>
    playerId && lobby.get(READIED).includes(playerId)));
};
