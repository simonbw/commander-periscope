import { CUSTOM_LOBBY_JOINED_MESSAGE, CUSTOM_LOBBY_UPDATED } from '../../common/messages/LobbyMessages';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';
import { JOIN_CUSTOM_LOBBY, LEAVE_CUSTOM_LOBBY } from '../actions/CustomLobbyActions';

export const LOADING_LOBBY = 'loading';

export default (state, action) => {
  state = state || null;
  switch (action.type) {
    case JOIN_CUSTOM_LOBBY:
      return LOADING_LOBBY;
    case LEAVE_CUSTOM_LOBBY:
      return null;
    case CUSTOM_LOBBY_JOINED_MESSAGE:
    case CUSTOM_LOBBY_UPDATED: // TODO: Don't just always replace everything
      return jsonToImmutable(action.lobby);
  }
  return state;
}
