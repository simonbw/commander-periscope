import { CUSTOM_LOBBY_GAME_START, CUSTOM_LOBBY_JOINED } from '../../common/Messages';
// Convert socket messages into actions
import * as Page from '../models/Page';
import { changePage, sendMessage } from './GeneralActions';

export const messageToAction = (action) => {
  switch (action.type) {
    case CUSTOM_LOBBY_GAME_START: {
      const gameId = action.gameId;
      return [
        sendMessage('join_game', { gameId }),
        changePage(Page.GAME)
      ];
    }
    case CUSTOM_LOBBY_JOINED: {
      const gameId = action.lobby.gameId;
      if (gameId) {
        return [
          action,
          sendMessage('join_game', { gameId }),
          changePage(Page.GAME)
        ]
      }
      return action;
    }
    default: {
      return action;
    }
  }
};