import { Button, Tooltip } from 'material-ui';
import { Comment } from 'material-ui-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { State } from 'statty';
import styles from '../../../../styles/MainMenu.css'
import { JOIN_CUSTOM_LOBBY_MESSAGE } from '../../../common/messages/LobbyMessages';
import { setUrlForLobby } from '../../navigation';
import { joinLobbyUpdater } from '../../Updaters';
import FloatingText from '../FloatingText';
import GithubIcon from '../icons/GithubIcon';
import { EmitterContext } from '../SocketProvider/SocketProvider';
import HowToPlay from './HowToPlay';
import { JoinCustomGameInput } from './JoinCustomGameInput';

export const UnconnectedMainMenu = ({ createCustomLobby, joinCustomLobby }) => (
  <div className={styles.MainMenu}>
    <FloatingText>
      <h1>Commander Periscope</h1>
    </FloatingText>
    
    <Button
      variant="raised"
      id="create-custom-game-button"
      onClick={createCustomLobby}
      fullWidth
    >
      Create Lobby
    </Button>
    
    <JoinCustomGameInput joinCustomLobby={joinCustomLobby}/>
    
    <HowToPlay/>
    
    <FloatingText className={styles.Footer}>
      <Tooltip title="Leave Feedback">
        <a href="https://goo.gl/forms/WfwLe3GRFqXG8NUo1">
          <Comment/>
        </a>
      </Tooltip>
      {' '}
      <Tooltip title="Github">
        <a href="https://github.com/simonbw/commander-periscope">
          <GithubIcon/>
        </a>
      </Tooltip>
    </FloatingText>
  </div>
);

UnconnectedMainMenu.propTypes = {
  createCustomLobby: PropTypes.func.isRequired,
  joinCustomLobby: PropTypes.func.isRequired,
};

const ConnectedMainMenu = () => (
  <State
    render={(stateProps, update) => (
      <EmitterContext.Consumer>
        {({ emit }) => (
          <UnconnectedMainMenu
            createCustomLobby={() => {
              const username = window.localStorage.getItem('username');
              update(joinLobbyUpdater);
              setUrlForLobby(null);
              emit(JOIN_CUSTOM_LOBBY_MESSAGE, { lobbyId: null, username })
            }}
            joinCustomLobby={(lobbyId) => {
              const username = window.localStorage.getItem('username');
              update(joinLobbyUpdater);
              setUrlForLobby(lobbyId);
              emit(JOIN_CUSTOM_LOBBY_MESSAGE, { lobbyId, username })
            }}
          />
        )}
      </EmitterContext.Consumer>
    )}
  />
);

export default ConnectedMainMenu;