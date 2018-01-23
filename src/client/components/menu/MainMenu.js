import { Button } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/MainMenu.css'
import { joinCustomLobby } from '../../actions/CustomLobbyActions';
import FloatingText from '../FloatingText';
import { JoinCustomGameInput } from './JoinCustomGameInput';

export const UnconnectedMainMenu = ({ createCustomLobby, joinCustomLobby }) => (
  <div className={styles.MainMenu}>
    <FloatingText>
      <h1>Commander Periscope</h1>
    </FloatingText>
    
    <Button
      raised
      id="create-custom-game-button"
      onClick={createCustomLobby}
      fullWidth
    >
      Create Lobby
    </Button>
    <br/>
    <JoinCustomGameInput joinCustomLobby={joinCustomLobby}/>
  </div>
);

export default connect(
  (state) => ({}),
  (dispatch) => ({
    createCustomLobby: () => dispatch(joinCustomLobby(null)),
    joinCustomLobby: (lobbyId) => dispatch(joinCustomLobby(lobbyId))
  })
)(UnconnectedMainMenu);