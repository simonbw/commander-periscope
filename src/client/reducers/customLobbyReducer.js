import * as Immutable from 'immutable';
import * as CustomLobbyActions from '../actions/CustomLobbyActions';

export default (state, action) => {
  state = state || Immutable.Map();
  switch (action.type) {
    case CustomLobbyActions.JOINED:
    case CustomLobbyActions.PLAYER_READIED:
    case CustomLobbyActions.PLAYER_UNREADIED:
    case CustomLobbyActions.PLAYER_ADDED:
    case CustomLobbyActions.PLAYER_LEFT:
    case CustomLobbyActions.ROLE_SELECTED:
    case CustomLobbyActions.PLAYER_SET_USERNAME:
      return jsonToLobby(action.lobby);
  }
  return state;
}

const jsonToLobby = (json) => (
  Immutable.fromJS(json, (key, value) => {
    switch (key) {
      case 'readied':
      case 'players':
        return value.toSet();
      default:
        return Immutable.Iterable.isKeyed(value) ? value.toMap() : value.toList()
    }
  })
);