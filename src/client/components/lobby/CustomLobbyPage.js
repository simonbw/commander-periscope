import { Button } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import { ID, LOBBY } from '../../../common/StateFields';
import { leaveCustomLobby } from '../../actions/CustomLobbyActions';
import FloatingText from '../FloatingText';
import ReadyButton from './ReadyButton';
import RoleSelect from './RoleSelect';
import UsernameInput from './UsernameInput';

export const UnconnectedCustomLobbyPage = ({ lobby, goToMainMenu }) => (
  <div className={styles.CustomLobbyPage} id="custom-lobby-page">
    <FloatingText>
      <h1>Lobby ID: <span className={styles.LobbyId}>{lobby.get(ID)}</span></h1>
    </FloatingText>
    <UsernameInput/>
    <RoleSelect/>
    <div className={styles.ButtonBar}>
      <MainMenuButton goToMainMenu={goToMainMenu}/>
      <ReadyButton/>
    </div>
  </div>
);

const MainMenuButton = ({ goToMainMenu }) => (
  <Button
    raised
    onClick={goToMainMenu}
  >
    Main Menu
  </Button>
);

export default connect(
  (state) => ({
    lobby: state.get(LOBBY),
  }),
  (dispatch) => ({
    goToMainMenu: () => dispatch(leaveCustomLobby())
  })
)(UnconnectedCustomLobbyPage)