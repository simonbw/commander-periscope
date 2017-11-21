import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../styles/MainMenu.css'
import * as CustomLobbyActions from '../actions/CustomLobbyActions';

const MainMenu = ({ createCustomLobby }) => (
  <div className={styles.MainMenu}>
    <div>Form Team</div>
    <div onClick={createCustomLobby}>Custom Game</div>
    <div>How To Play</div>
  </div>
);

export default connect(
  (state) => ({}),
  (dispatch) => ({
    createCustomLobby: () => dispatch(CustomLobbyActions.createCustomLobby())
  })
)(MainMenu);