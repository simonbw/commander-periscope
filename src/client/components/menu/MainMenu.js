import { Button, Tooltip } from 'material-ui';
import { Comment } from 'material-ui-icons';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/MainMenu.css'
import { joinCustomLobby } from '../../actions/CustomLobbyActions';
import FloatingText from '../FloatingText';
import GithubIcon from '../icons/GithubIcon';
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

export default connect(
  (state) => ({}),
  (dispatch) => ({
    createCustomLobby: () => dispatch(joinCustomLobby(null)),
    joinCustomLobby: (lobbyId) => dispatch(joinCustomLobby(lobbyId))
  })
)(UnconnectedMainMenu);