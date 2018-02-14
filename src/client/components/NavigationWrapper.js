import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { State } from 'statty';
import { JOIN_CUSTOM_LOBBY_MESSAGE, LEAVE_CUSTOM_LOBBY_MESSAGE } from '../../common/messages/LobbyMessages';
import { getLobbyIdFromUrl, setUrlForLobby, setUrlForMenu } from '../navigation';
import { joinLobbyUpdater, leaveLobbyUpdater } from '../Updaters';
import { EmitterContext } from './SocketProvider/SocketProvider';

class NavigationWrapper extends Component {
  static propTypes = {
    emit: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };
  
  constructor(props) {
    super(props);
  }
  
  onPopstate = (event) => {
    console.log('popstate:', event.state);
    
    const lobbyId = getLobbyIdFromUrl(window.location.pathname);
    if (lobbyId) {
      const username = window.localStorage.getItem('username');
      setUrlForLobby(lobbyId);
      this.props.emit(JOIN_CUSTOM_LOBBY_MESSAGE, { lobbyId, username });
      this.props.update(joinLobbyUpdater);
    } else {
      setUrlForMenu();
      this.props.emit(LEAVE_CUSTOM_LOBBY_MESSAGE);
      this.props.update(leaveLobbyUpdater);
    }
  };
  
  componentDidMount() {
    window.addEventListener('popstate', this.onPopstate);
  }
  
  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopstate);
  }
  
  render() {
    return this.props.children;
  }
}

export default ({ children }) => (
  <EmitterContext.Consumer>
    {({ emit }) => (
      <State
        render={({}, update) => (
          <NavigationWrapper emit={emit} update={update}>
            {children}
          </NavigationWrapper>
        )}
      />
    )}
  </EmitterContext.Consumer>
);