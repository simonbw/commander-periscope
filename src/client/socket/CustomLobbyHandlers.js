import { GAME_ID } from '../../common/fields/LobbyFields';
import { LOBBY } from '../../common/fields/StateFields';
import { JOIN_GAME_MESSAGE } from '../../common/messages/GameMessages';
import { CUSTOM_LOBBY_JOINED_MESSAGE } from '../../common/messages/LobbyMessages';
import { joinCustomLobby } from '../actions/CustomLobbyActions';
import { sendMessage } from '../actions/GeneralActions';
import { getLobbyIdFromUrl, setUrlForLobby } from '../navigation';

export function getLobbyHandlers(getState, dispatch) {
  return [[
    'connect', () => {
      const lobbyId = getLobbyIdFromUrl(window.location.pathname);
      if (lobbyId) {
        dispatch(joinCustomLobby(lobbyId));
      }
    }
  ], [
    'action', (action) => { // TODO: Don't have 'action' message, just use messages
      const lobby = action.lobby;
      
      // Join games if we're not already in one
      if (lobby && lobby.gameId && lobby.gameId !== getState().getIn([LOBBY, GAME_ID])) {
        dispatch(sendMessage(JOIN_GAME_MESSAGE, { gameId: lobby.gameId }));
      }
      
      if (action.type === CUSTOM_LOBBY_JOINED_MESSAGE) {
        setUrlForLobby(lobby.id);
      }
      
      dispatch(action);
    }
  ]];
}