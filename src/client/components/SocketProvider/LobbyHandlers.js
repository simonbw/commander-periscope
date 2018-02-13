import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { State } from 'statty';
import { GAME_ID } from '../../../common/fields/LobbyFields';
import { LOBBY } from '../../../common/fields/StateFields';
import { JOIN_GAME_MESSAGE } from '../../../common/messages/GameMessages';
import {
  CUSTOM_LOBBY_JOINED_MESSAGE, CUSTOM_LOBBY_UPDATED_MESSAGE, JOIN_CUSTOM_LOBBY_MESSAGE
} from '../../../common/messages/LobbyMessages';
import { jsonToImmutable } from '../../../common/util/ImmutableUtil';
import { getLobbyIdFromUrl, setUrlForLobby } from '../../navigation';
import { joinGameUpdater, joinLobbyUpdater } from '../../Updaters';
import Handlers from './Handlers';
import { EmitterContext } from './SocketProvider';

class UnconnectedLobbyHandlers extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    gameId: PropTypes.string,
  };
  
  constructor(props) {
    super(props);
    
    this.handlers = [[
      'connect', () => {
        const lobbyId = getLobbyIdFromUrl(window.location.pathname);
        if (lobbyId) {
          this.props.update(joinLobbyUpdater);
          setUrlForLobby(lobbyId);
          this.props.emit(JOIN_CUSTOM_LOBBY_MESSAGE, { lobbyId });
        }
      }
    ], [
      'action', (action) => {
        if (action.type === CUSTOM_LOBBY_JOINED_MESSAGE || action.type === CUSTOM_LOBBY_UPDATED_MESSAGE) {
          const lobby = action.lobby;
          if (action.type === action.type === CUSTOM_LOBBY_JOINED_MESSAGE) {
            setUrlForLobby(lobby.id);
          }
          if (lobby.gameId && lobby.gameId !== this.props.gameId) {
            this.props.update(joinGameUpdater(lobby.gameId));
            this.props.emit(JOIN_GAME_MESSAGE, { gameId: lobby.gameId });
          }
          this.props.update((state) => state.set(LOBBY, jsonToImmutable(lobby)))
        }
      }
    ]];
  }
  
  render() {
    return <Handlers handlers={this.handlers}/>
  }
}

const ConnectedLobbyHandlers = () => (
  <EmitterContext.Consumer>
    {({ emit }) => (
      <State
        select={(state) => ({ gameId: state.getIn([LOBBY, GAME_ID]) })}
        render={({ gameId }, update) => (
          <UnconnectedLobbyHandlers
            emit={emit}
            gameId={gameId}
            update={update}
          />
        )}
      />
    )}
  </EmitterContext.Consumer>
);

export default ConnectedLobbyHandlers;