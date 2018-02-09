import Immutable from 'immutable/dist/immutable';
import { CREATED, ID, PLAYERS, TEAMS, USERNAMES } from '../../common/fields/CommonFields';
import { READIED } from '../../common/fields/LobbyFields';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/models/Role';
import { BLUE, RED } from '../../common/models/Team';

export function createCustomLobby(id) {
  return Immutable.Map({
    [ID]: id,
    [CREATED]: Date.now(),
    [PLAYERS]: Immutable.Set(),
    [USERNAMES]: Immutable.Map(),
    [READIED]: Immutable.Set(),
    [TEAMS]: Immutable.Map({
      [RED]: createEmptyTeam(), [BLUE]: createEmptyTeam()
    })
  });
}

export function createEmptyTeam() {
  return Immutable.Map({
    [CAPTAIN]: null,
    [FIRST_MATE]: null,
    [RADIO_OPERATOR]: null,
    [ENGINEER]: null,
  });
}