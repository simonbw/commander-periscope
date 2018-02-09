import {
  CUSTOM_LOBBY_JOINED_MESSAGE, PLAYER_ADDED_MESSAGE, PLAYER_LEFT_MESSAGE, PLAYER_READIED_MESSAGE,
  PLAYER_SET_USERNAME_MESSAGE, PLAYER_UNREADIED_MESSAGE, ROLE_SELECTED_MESSAGE
} from '../../common/messages/LobbyMessages';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';
import { JOIN_CUSTOM_LOBBY, LEAVE_CUSTOM_LOBBY } from '../actions/CustomLobbyActions';

export default (state, action) => {
  state = state || null;
  switch (action.type) {
    case JOIN_CUSTOM_LOBBY:
      return 'loading'; // TODO: Something better than this
    case LEAVE_CUSTOM_LOBBY:
      return null;
    // TODO: Don't just always replace everything
    case CUSTOM_LOBBY_JOINED_MESSAGE:
    case PLAYER_READIED_MESSAGE:
    case PLAYER_UNREADIED_MESSAGE:
    case PLAYER_ADDED_MESSAGE:
    case PLAYER_LEFT_MESSAGE:
    case ROLE_SELECTED_MESSAGE:
    case PLAYER_SET_USERNAME_MESSAGE:
      return jsonToImmutable(action.lobby);
  }
  return state;
}
