import { CUSTOM_LOBBY_GAME_START_MESSAGE, CUSTOM_LOBBY_JOINED_MESSAGE, JOIN_GAME_MESSAGE } from '../../common/Messages';
import { joinCustomLobby } from '../actions/CustomLobbyActions';
import { sendMessage } from '../actions/GeneralActions';
import { getLobbyIdFromUrl, setUrlForLobby } from '../navigation';

export function getLobbyHandlers(dispatch) {
  return [[
    'connect', () => {
      const lobbyId = getLobbyIdFromUrl(window.location.pathname);
      if (lobbyId) {
        dispatch(joinCustomLobby(lobbyId));
      }
    }
  ], [
    'action', (action) => { // TODO: Don't have 'action' message, just use messages
      switch (action.type) {
        case CUSTOM_LOBBY_GAME_START_MESSAGE: {
          const gameId = action.gameId;
          return dispatch([
            sendMessage(JOIN_GAME_MESSAGE, { gameId }),
          ]);
        }
        case CUSTOM_LOBBY_JOINED_MESSAGE: {
          setUrlForLobby(action.lobby.id);
          
          const gameId = action.lobby.gameId; // TODO: Always deal with games and lobbies as immutable objects
          if (gameId) {
            return dispatch([
              action,
              sendMessage(JOIN_GAME_MESSAGE, { gameId }),
            ]);
          }
          return dispatch(action);
        }
        default: {
          return dispatch(action);
        }
      }
    }
  ]];
}