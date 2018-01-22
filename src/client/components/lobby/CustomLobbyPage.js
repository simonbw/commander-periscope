import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import { ID, LOBBY } from '../../../common/StateFields';
import { leaveCustomLobby } from '../../actions/CustomLobbyActions';
import DebugPane from '../DebugPane';
import ReadyButton from './ReadyButton';
import RoleSelect from './RoleSelect';
import UsernameInput from './UsernameInput';

const UnconnectedCustomLobbyPage = ({ lobby, goToMainMenu }) => (
  <div className={styles.CustomLobbyPage} id="custom-lobby-page">
    <DebugPane data={lobby}/>
    <h1 className={styles.LobbyId}>{lobby.get(ID)}</h1>
    <RoleSelect/>
    <UsernameInput/>
    <ReadyButton/>
    <MainMenuButton goToMainMenu={goToMainMenu}/>
  </div>
);

const MainMenuButton = ({ goToMainMenu }) => (
  <a
    className={styles.CancelButton}
    onClick={goToMainMenu}
  >
    Main Menu
  </a>
);

export default connect(
  (state) => ({
    lobby: state.get(LOBBY),
  }),
  (dispatch) => ({
    goToMainMenu: () => dispatch(leaveCustomLobby())
  })
)(UnconnectedCustomLobbyPage)