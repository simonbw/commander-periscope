import Immutable from 'immutable';
import { ID } from '../common/fields/CommonFields';
import { PHASE } from '../common/fields/GameFields';
import { GAME, LOBBY } from '../common/fields/StateFields';
import { LOADING_PHASE } from '../common/models/GamePhase';

export const LOADING_LOBBY = Immutable.Map({ loading: true });

export const joinLobbyUpdater = (state) => state.set(LOBBY, LOADING_LOBBY);

export const leaveLobbyUpdater = (state) => state.set(LOBBY, null);

export const joinGameUpdater = (gameId) => (state) => state.set(GAME,
  Immutable.Map({ [ID]: gameId, [PHASE]: [LOADING_PHASE] }));