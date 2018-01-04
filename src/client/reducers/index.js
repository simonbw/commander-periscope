import { Map } from 'immutable';
import { CONNECTED, GAME, LOBBY, PAGE } from '../../common/StateFields';
import connectionReducer from './connectionReducer';
import customLobbyReducer from './customLobbyReducer';
import gameReducer from './gameReducer';
import pageReducer from './pageReducer';

export default (state, action) => {
  state = state || Map();
  
  return state
    .update(PAGE, (page) => pageReducer(page, action))
    .update(LOBBY, (lobby) => customLobbyReducer(lobby, action))
    .update(GAME, (game) => gameReducer(game, action))
    .update(CONNECTED, (connection) => connectionReducer(connection, action));
};
