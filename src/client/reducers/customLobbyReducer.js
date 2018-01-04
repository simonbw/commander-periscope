import * as Immutable from 'immutable';
import {
  CUSTOM_LOBBY_JOINED, PLAYER_ADDED, PLAYER_LEFT, PLAYER_READIED, PLAYER_SET_USERNAME, PLAYER_UNREADIED,
  ROLE_SELECTED
} from '../../common/Messages';
import { PLAYERS, READIED } from '../../common/StateFields';

export default (state, action) => {
  state = state || Immutable.Map();
  switch (action.type) {
    case CUSTOM_LOBBY_JOINED:
    case PLAYER_READIED:
    case PLAYER_UNREADIED:
    case PLAYER_ADDED:
    case PLAYER_LEFT:
    case ROLE_SELECTED:
    case PLAYER_SET_USERNAME:
      return jsonToLobby(action.lobby);
  }
  return state;
}

const jsonToLobby = (json) => (
  Immutable.fromJS(json, (key, value) => {
    switch (key) {
      case READIED:
      case PLAYERS:
        return value.toSet();
      default:
        return Immutable.Iterable.isKeyed(value) ? value.toMap() : value.toList()
    }
  })
);