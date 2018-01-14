import * as Immutable from 'immutable';
import {
  CUSTOM_LOBBY_JOINED, PLAYER_ADDED, PLAYER_LEFT, PLAYER_READIED, PLAYER_SET_USERNAME, PLAYER_UNREADIED,
  ROLE_SELECTED
} from '../../common/Messages';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';

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
      return jsonToImmutable(action.lobby);
  }
  return state;
}
