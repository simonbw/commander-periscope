import { Button } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import { ID } from '../../../common/fields/GameFields';
import { LOBBY, USER_ID } from '../../../common/fields/StateFields';
import { leaveCustomLobby, selectRole } from '../../actions/CustomLobbyActions';
import FloatingText from '../FloatingText';
import ReadyButton from './ReadyButton';
import RoleSelect from './RoleSelect';
import UsernameInput from './UsernameInput';

export const UnconnectedCustomLobbyPage = ({ lobby, userId, goToMainMenu, selectRole }) => (
  <div className={styles.CustomLobbyPage} id="custom-lobby-page">
    <FloatingText>
      <h1>Lobby ID: <span className={styles.LobbyId}>{lobby.get(ID)}</span></h1>
    </FloatingText>
    <UsernameInput/>
    <RoleSelect lobby={lobby} userId={userId} selectRole={selectRole}/>
    <div className={styles.ButtonBar}>
      <MainMenuButton goToMainMenu={goToMainMenu}/>
      <ReadyButton/>
    </div>
  </div>
);

const MainMenuButton = ({ goToMainMenu }) => (
  <Button variant="raised" onClick={goToMainMenu}>
    Main Menu
  </Button>
);

export default connect(
  (state) => ({
    lobby: state.get(LOBBY),
    userId: state.get(USER_ID)
  }),
  (dispatch) => ({
    goToMainMenu: () => dispatch(leaveCustomLobby()),
    selectRole: (role, team) => dispatch(selectRole(role, team))
  })
)(UnconnectedCustomLobbyPage)