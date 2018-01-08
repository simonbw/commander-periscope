import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../styles/MainMenu.css'
import { USER_ID } from '../../common/StateFields';
import * as CustomLobbyActions from '../actions/CustomLobbyActions';

export const UnconnectedMainMenu = ({ createCustomLobby, joinCustomLobby, userId }) => {
  let customGameInput;
  return (
    <div className={styles.MainMenu}>
      <div onClick={createCustomLobby} id="create-custom-game-button">Create Custom Game</div>
      <div>
        <input id="custom-game-input" ref={r => customGameInput = r}/>
        <button
          id="join-custom-game-button"
          onClick={() => customGameInput.value && joinCustomLobby(customGameInput.value)}
        >
          Join Custom Game
        </button>
      </div>
      <div>How To Play</div>
      <div id="userid">{userId}</div>
    </div>
  );
};

export default connect(
  (state) => ({ userId: state.get(USER_ID) }),
  (dispatch) => ({
    createCustomLobby: () => dispatch(CustomLobbyActions.createCustomLobby()),
    joinCustomLobby: (lobbyId) => dispatch(CustomLobbyActions.joinCustomLobby(lobbyId))
  })
)(UnconnectedMainMenu);