import { Map } from 'immutable';
import connectionReducer from './connectionReducer';
import customLobbyReducer from './customLobbyReducer';
import gameReducer from './gameReducer';
import pageReducer from './pageReducer';

export default (state, action) => {
  state = state || Map();
  
  return state
    .update('page', (page) => pageReducer(page, action))
    .update('lobby', (lobby) => customLobbyReducer(lobby, action))
    .update('game', (game) => gameReducer(game, action))
    .update('connected', (connection) => connectionReducer(connection, action));
};
