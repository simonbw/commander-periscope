import Immutable from 'immutable';
import { ID, TEAMS, USERNAMES } from '../../common/fields/CommonFields';
import {
  GAME_ID, IS_AVAILABLE, IS_READY, IS_USER, READIED, TEAM_AND_ROLE, USERNAME
} from '../../common/fields/LobbyFields';
import { getTeamAndRole } from '../../common/util/GameUtils';

export function transformLobby(lobby, userId) {
  return Immutable.Map({
    [ID]: lobby.get(ID),
    [GAME_ID]: lobby.get(GAME_ID),
    [TEAMS]: lobby.get(TEAMS).map(players => players.map((playerId) => Immutable.Map({
      [IS_USER]: playerId === userId,
      [IS_AVAILABLE]: !playerId,
      [IS_READY]: lobby.get(READIED).includes(playerId),
      [USERNAME]: lobby.getIn([USERNAMES, playerId]),
    }))),
    [TEAM_AND_ROLE]: getTeamAndRole(lobby.get(TEAMS), userId),
    [IS_READY]: lobby.get(READIED).includes(userId),
    [USERNAME]: lobby.getIn([USERNAMES, userId]),
  });
}

