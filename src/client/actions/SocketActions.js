// Convert socket messages into actions
import * as Page from '../models/Page';
import { changePage, sendMessage } from './GeneralActions';

export const messageToAction = (action) => {
  switch (action.type) {
    case 'custom_lobby_game_start':
      const gameId = action.gameId;
      return [
        sendMessage('join_game', { gameId }),
        changePage(Page.GAME)
      ];
    case 'custom_lobby_joined':
      if (action.lobby.gameId) {
        const gameId = action.lobby.gameId;
        return [
          action,
          sendMessage('join_game', { gameId }),
          changePage(Page.GAME)
        ]
      }
      return action;
    default:
      return action;
  }
};