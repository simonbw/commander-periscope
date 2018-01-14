import { CUSTOM_LOBBY_GAME_START, CUSTOM_LOBBY_JOINED } from '../../common/Messages';
// Convert socket messages into actions
import { GAME_PAGE } from '../constants/Page';
import { changePage, sendMessage } from './GeneralActions';

export const messageToAction = (action) => {
  switch (action.type) {
    case CUSTOM_LOBBY_GAME_START: {
      const gameId = action.gameId;
      return [
        sendMessage('join_game', { gameId }),
        changePage(GAME_PAGE)
      ];
    }
    case CUSTOM_LOBBY_JOINED: {
      const gameId = action.lobby.gameId;
      if (gameId) {
        return [
          action,
          sendMessage('join_game', { gameId }),
          changePage(GAME_PAGE)
        ]
      }
      return action;
    }
    default: {
      return action;
    }
  }
};