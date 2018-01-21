import { CUSTOM_LOBBY_GAME_START_MESSAGE, CUSTOM_LOBBY_JOINED_MESSAGE } from '../../common/Messages';
import { sendMessage } from './GeneralActions';

// Convert socket messages into actions
export const messageToAction = (action) => {
  switch (action.type) {
    case CUSTOM_LOBBY_GAME_START_MESSAGE: {
      const gameId = action.gameId;
      return [
        sendMessage('join_game', { gameId }),
      ];
    }
    case CUSTOM_LOBBY_JOINED_MESSAGE: {
      const gameId = action.lobby.gameId; // TODO: Always deal with games and lobbies as immutable objectss
      if (gameId) {
        return [
          action,
          sendMessage('join_game', { gameId }),
        ]
      }
      return action;
    }
    default: {
      return action;
    }
  }
};